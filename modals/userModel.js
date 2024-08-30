const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    token: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male" 
    },
    birthdate: {
      type: Date,
      default: Date.now
    },
    image: {
      type: String,
    },
    employeeCode:{
      type:String
    },
    DateOfjoining:{
      type: Date,
      default: Date.now
    },
    position:{
      type:String
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
