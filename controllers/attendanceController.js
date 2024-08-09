const Attendance = require("../modals/attendanceSchema");
const asyncHandler = require("../middlewares/asyncHandler");

//create attandence data include arrival and dispature
const createAttendance = asyncHandler(async (req, res) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const { emailId, name, arrivalDate, arrivalTime, remarks } = req.body;
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
      res.json({
        success: true,
        message: "Arrival record created",
        data: newRecord,
      });
    } else {
      res.json({
        success: false,
        message: "Attendance record already exists for today",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
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
  const targetHour = 20;
  const targetMinute = 0o1;
  const isAfterTargetTime =
    currentHour > targetHour ||
    (currentHour === targetHour && currentMinute >= targetMinute);

  const { emailId, arrivalDate, departureDate, departureTime, remarks } =
    req.body;

  try {
    const existingRecord = await Attendance.findOne({ emailId, createdAt: {
      $gte: startOfDay,
      $lt: endOfDay
    } });

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
      return res.json({ success: true, message: "Rejected." });
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
    const record = await Attendance.findOne({ emailId, createdAt: {
      $gte: startOfDay,
      $lt: endOfDay
    } });
    if (record) {
      res.json({
        success: true,
        data: record,
      });
    } else {
      res
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
    const records = await Attendance.find();
    res.json({
      success: true,
      data: records,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = {
  createAttendance,
  updateDepartureTime,
  approveDeparture,
  getUserAttendance,
  getAllUsers,
};
