const jwt =require('jsonwebtoken');
const User=require('../modals/userModel.js');
const asyncHandler=require('../middlewares/asyncHandler.js');
const { message } = require('antd');
require('dotenv').config();

const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // Read JWT from the 'jwt' cookie
  token = req.cookies.jwt;
console.log('token',token);
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed.");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token.");
  }
});

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({message:"Not authorized as an admin."});
  }
};

module.exports ={authenticate,authorizeAdmin };
