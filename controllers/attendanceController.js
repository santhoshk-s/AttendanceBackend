const Attendance = require("../modals/attendanceSchema");
const asyncHandler = require("../middlewares/asyncHandler");
const { networkInterfaces } = require("os");
const dns = require("dns");

const ipAddress = "192.168.31.1";


//create attandence data include arrival and dispature
const createAttendance = asyncHandler(async (req, res) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const { emailId, name } = req.body;

  if (ipAddress !== dns.getServers()[0]) {
    return res.status(401).json({
      success: false,
      message: "You are not in office location",
    });
  }

  try {
    const existingRecord = await Attendance.findOne({
      emailId,
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });
    if (!existingRecord) {
      const newRecord = new Attendance({
        name,
        emailId,
      });
      await newRecord.save();
      return res.json({
        success: true,
        message: "Arrival record created",
        data: newRecord,
      });
    } else {
      return res.json({
        success: false,
        message: "Attendance record already exists for today",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});
//update departure time

const updateDepartureTime = asyncHandler(async (req, res) => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const endOfDay = new Date(now.setHours(23, 59, 59, 999));

  // Define the target time
  const targetHour = 19;
  const targetMinute = 30;
  const isAfterTargetTime =
    currentHour > targetHour ||
    (currentHour === targetHour && currentMinute >= targetMinute);

  const { emailId, remarks } = req.body;


  try {
    const existingRecord = await Attendance.findOne({
      emailId,
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    if (!existingRecord) {
      return res.status(404).json({
        message: "Your email is not valid or you have not updated arrival.",
      });
    }

    if (existingRecord.departureDate) {
      return res.json({
        message: "Departure already updated.",
      });
    }

    if (isAfterTargetTime) {
      existingRecord.departureDate = new Date();
      await existingRecord.save();
      return res.json({ message: "Updated departure time successfully." });
    }

    if (!isAfterTargetTime) {
      if (
        existingRecord.remarks &&
        existingRecord.remarks.trim() !== "" &&
        existingRecord.status === true
      ) {
        existingRecord.departureDate = new Date();
        await existingRecord.save();
        return res.json({ message: "Updated departure time successfully." });
      }

      if (
        existingRecord.remarks &&
        existingRecord.remarks.trim() !== "" &&
        existingRecord.status === false
      ) {
        return res.json({ message: "Wait for admin response." });
      }

      if (!remarks) {
        return res.json({ message: "Please enter remarks." });
      }

      existingRecord.remarks = remarks;
      await existingRecord.save();
      return res.json({ message: "Remarks updated." });
    }

    return res.json({ message: "Something went wrong." });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

// Admin approval endpoint
const approveDeparture = asyncHandler(async (req, res) => {
  const { _id, approve } = req.body;

  try {
    const existingRecord = await Attendance.findById(_id);

    if (!existingRecord) {
      return res
        .status(404)
        .json({ success: false, message: "Attendance record not found." });
    }

    if (approve === false) {
      existingRecord.status = false;
      await existingRecord.save();
      return res.json({ success: false, message: "Rejected." });
    }

    if (approve === true) {
      existingRecord.status = true;
      await existingRecord.save();
      return res.json({ success: true, message: "Approved." });
    }

    return res
      .status(400)
      .json({ success: false, message: "Invalid approval status." });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
});

const getUserAttendance = asyncHandler(async (req, res) => {
  const { emailId } = req.params;
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  try {
    const record = await Attendance.findOne({
      emailId,
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });
    if (record) {
      return res.json({
        success: true,
        data: record,
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Attendance record not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const records = await Attendance.find().sort({ arrivalDate: -1 });
    return res.json({
      success: true,
      data: records,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Get today's updated attendance
const getTodayAttendance = asyncHandler(async (req, res) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  try {
    const employees = await Attendance.find({
      updatedAt: { $gte: todayStart, $lte: todayEnd },
    });
    return res.json({
      success: true,
      data: employees,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const getLastWeekAttendance = asyncHandler(async (req, res) => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  try {
    const employees = await Attendance.find({ updatedAt: { $gte: weekAgo } });
    return res.json({
      success: true,
      data: employees,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const getLastMonthAttendance = asyncHandler(async (req, res) => {
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  try {
    const employees = await Attendance.find({ updatedAt: { $gte: monthAgo } });
    return res.json({
      success: true,
      data: employees,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const getAttendanceByName = asyncHandler(async (req, res) => {
  const { emailId } = req.body;

  try {
    const employees = await Attendance.find({ emailId });
    return res.json({
      success: true,
      data: employees,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const getRangeSelectedAttendance = asyncHandler(async (req, res) => {
  const { fromDate, toDate } = req.body;

  const todayStart = new Date(fromDate);
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date(toDate);
  todayEnd.setHours(23, 59, 59, 999);

  try {
    const employees = await Attendance.find({
      updatedAt: { $gte: todayStart, $lte: todayEnd },
    });
    return res.json({
      success: true,
      data: employees,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = {
  createAttendance,
  updateDepartureTime,
  approveDeparture,
  getUserAttendance,
  getAllUsers,
  getTodayAttendance,
  getLastWeekAttendance,
  getLastMonthAttendance,
  getAttendanceByName,
  getRangeSelectedAttendance,
};
