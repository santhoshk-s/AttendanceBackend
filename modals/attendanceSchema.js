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
      /* required: true, */
      /* validate: {
          validator: function(v) {
            return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(v);
          },
          message: props => `${props.value} is not a valid IP address!`
        } */
    },
    arrivalDate: {
      type: String,    },
    arrivalTime: {
      type: String,
      /* required: true, */
    },
    departureDate: {
      type: String,
      /*   required:true, */
    },
    departureTime: {
      type: String,
      /*  required: true, */
    },
    status:{
      type:String,
      default:'pending', 
    },
    remarks:{
      type:String,      
    }
  },
  { timestamps: true }
);

const Attendance = mongoose.model("attendance", attendanceSchema);

module.exports = Attendance;
