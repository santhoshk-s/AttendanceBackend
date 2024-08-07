const express=require('express');
const router=express.Router();

const {createAttendance,updateDepartureTime} = require('../controllers/attendanceController')


router.post('/attendanceCreate',createAttendance);

router.put('/attendanceUpdate/:_id',updateDepartureTime);

module.exports=router;