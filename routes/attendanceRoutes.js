const express=require('express');
const router=express.Router();

const {createAttendance,updateDepartureTime,getAllUsers,getUserAttendance,approveDeparture, getTodayAttendance,getLastWeekAttendance,getLastMonthAttendance,getAttendanceByName,getRangeSelectedAttendance} = require('../controllers/attendanceController')


router.post('/attendanceCreate',createAttendance);

router.put('/attendanceUpdate',updateDepartureTime);
router.get('/getAllUser',getAllUsers);
router.get('/getUserAttendance/:emailId',getUserAttendance);
router.post('/approveDeparture',approveDeparture);
router.get('/getTodayAttendance',getTodayAttendance);
router.get('/getLastWeekAttendance',getLastWeekAttendance);
router.get('/getLastMonthAttendance',getLastMonthAttendance);
router.post('/getAttendanceByName',getAttendanceByName);
router.post('/getRangeSelectedAttendance',getRangeSelectedAttendance);

module.exports=router;