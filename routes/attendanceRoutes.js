const express=require('express');
const router=express.Router();

const {createAttendance,updateDepartureTime,getAllUsers,getUserAttendance,approveDeparture} = require('../controllers/attendanceController')


router.post('/attendanceCreate',createAttendance);

router.put('/attendanceUpdate',updateDepartureTime);
router.get('/getAllUser',getAllUsers);
router.get('/getUserAttendance/:emailId',getUserAttendance);
router.post('/approveDeparture',approveDeparture);

module.exports=router;