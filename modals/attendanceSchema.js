const mongoose = require("mongoose");

const attendanceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
    },
    arrivalDate: {
      type: Date,
       default: Date.now,
    },
    departureDate: {
      type: Date,
    },
    status: {
      type: Boolean,
      default: false,
    },
    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

const Attendance = mongoose.model("attendance", attendanceSchema);

module.exports = Attendance;
