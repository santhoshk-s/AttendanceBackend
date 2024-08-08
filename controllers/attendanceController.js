const Attendance = require("../modals/attendanceSchema");
const asyncHandler = require("../middlewares/asyncHandler");

//create attandence data include arrival and dispature
const createAttendance = asyncHandler(async (req, res) => {
  const { emailId, name, arrivalDate, arrivalTime, remarks } = req.body;

  try {
    const existingRecord = await Attendance.findOne({ emailId, arrivalDate });
    if (!existingRecord) {
      const newRecord = new Attendance({
        name,
        emailId,
        arrivalDate,
        arrivalTime,
        remarks,
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

  // Define the target time
  const targetHour = 12;
  const targetMinute = 12;
  const isAterTargetTime =
    currentHour > targetHour ||
    (currentHour === targetHour && currentMinute >= targetMinute);

  const { emailId, arrivalDate, departureDate, departureTime, remarks } =
    req.body;

  try {
    const existingRecord = await Attendance.findOne({ emailId, arrivalDate });
    if (!existingRecord)
      return res.json({
        message: "your email is not valid or you are not upadated arrival",
      });
    if (!existingRecord.departureDate) {
      if (isAterTargetTime) {
        existingRecord.departureDate = departureDate;
        existingRecord.departureTime = departureTime;
        await existingRecord.save();
        return res.json({ message: "update departure time success" });
      } else if (
        !isAterTargetTime &&
        existingRecord.remarks &&
        existingRecord.remarks !== "" &&
        existingRecord.status === true
      ) {
        existingRecord.departureDate = departureDate;
        existingRecord.departureTime = departureTime;
        await existingRecord.save();
        console.log("update departure time");
        return res.json({ message: "update departure time success" });
      } else if (
        !isAterTargetTime &&
        existingRecord.remarks &&
        existingRecord.remarks !== "" &&
        existingRecord.status === false
      ) {
        return res.json({ message: "wait for admin response" });
      } else if (!isAterTargetTime && !existingRecord.remarks && !remarks) {
        return res.json({ message: "please enter remarks" });
      } else if (!isAterTargetTime && !existingRecord.remarks && remarks) {
        existingRecord.remarks = remarks;
        await existingRecord.save();
        return res.json({ message: "remarks updated" });
      } else {
        return res.json({ message: "something went wrong" });
      }
    } else {
      res.json({
        message: "departute already updated",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Admin approval endpoint
const approveDeparture = asyncHandler(async (req, res) => {
  const { _id, approve } = req.body;
  console.log(_id, approve);
  try {
    const existingRecord = await Attendance.findById({ _id });

    if (existingRecord) {
      if (approve) {
        existingRecord.status = true;
        await existingRecord.save();
        res.json({ success: true, message: "approved" });
      } else {
        existingRecord.status = false;
        await existingRecord.save();
        res.json({ success: true, message: "rejected" });
      }
    } else {
      res
        .status(404)
        .json({ success: false, message: "Attendance record not foundf" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
});
const getUserAttendance = asyncHandler(async (req, res) => {
  const { emailId } = req.params;
  const options = { day: "2-digit", month: "2-digit", year: "2-digit" };
  const arrivalDate = new Date().toLocaleDateString("en-GB", options);
  try {
    const record = await Attendance.findOne({ emailId, arrivalDate });
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
