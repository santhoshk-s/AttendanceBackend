const Attendance = require("../modals/attendanceSchema")
const asyncHandler = require("../middlewares/asyncHandler");


//create attandence data include arrival and dispature
const createAttendance =  asyncHandler(async (req, res) => {
    const { emailId, name, arrivalDate, arrivalTime,remarks } = req.body;
  
    try {
      const existingRecord = await Attendance.findOne({ emailId,arrivalDate });
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
        res.json({ success: false, message: 'Attendance record already exists for today' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
//update departure time

const updateDepartureTime =  asyncHandler(async (req, res) => {
    const { emailId,arrivalDate,departureDate,departureTime,remarks } = req.body;
  
    try {
      const existingRecord = await Attendance.findOne({ emailId,arrivalDate });
      if(!existingRecord) return res.json({ message: "your email is not valid or you are not upadated arrival", });
      if (!existingRecord.departureDate) {
        if(new Date().getHours >=17){
        existingRecord.departureDate = departureDate;
        existingRecord.departureTime = departureTime;
        existingRecord.status = 'pending';
        // Save the updated record
        await existingRecord.save()
        
        res.json({
          message: "departute  updated",
        });
      }else{
        existingRecord.departureDate = departureDate;
        existingRecord.departureTime = departureTime;
        existingRecord.status = 'pending';
      existingRecord.remarks=remarks;
      await existingRecord.save()
      res.json({ message: "you can't update departure time before 5 PM" });
    }
      }else {
        res.json({
          message: "departute already updated",
        });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }

  });
  
  // Admin approval endpoint
  const approveDeparture =  asyncHandler(async (req, res) => {
    const { emailId,arrivalDate,departureDate,departureTime,approve } = req.body;
  
  
    try {
      const existingRecord = await Attendance.findById({ emailId,arrivalDate });
  
      if (existingRecord) {
        if (existingRecord.status === 'pending') {
          if (approve) {
            existingRecord.departureDate = departureDate;
            existingRecord.departureTime = departureTime;
            existingRecord.status = 'approved';
            await existingRecord.save();
            res.json({ success: true, message: 'Departure approved', data: existingRecord });
          } else {
            existingRecord.departureDate = "";
            existingRecord.departureTime = "";
            existingRecord.status = 'rejected';
            await existingRecord.save();
            res.json({ success: true, message: 'Departure rejected', data: existingRecord });
          }
        } else {
          res.json({ success: false, message: 'No pending approval found' });
        }
      } else {
        res.status(404).json({ success: false, message: 'Attendance record not found' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error', error });
    }
  });
  const getUserAttendance = asyncHandler(async (req, res) => {
    const { emailId } = req.params;
    const arrivalDate = new Date().toLocaleDateString();
  
    try {
      const record = await Attendance.findOne({ emailId, arrivalDate });
  
      if (record) {
        res.json({
          success: true,
          data: record,
        });
      } else {
        res.status(404).json({ success: false, message: 'Attendance record not found' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
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
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


  module.exports = {
    createAttendance,
    updateDepartureTime,
    approveDeparture,
    getUserAttendance,
    getAllUsers,
  };
