const User = require("../modals/userModel");
const Attendance = require("../modals/attendanceSchema")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../middlewares/asyncHandler");
const createToken = require("../utils/createToken");
const { message } = require("antd");

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new Error("Please fill all the inputs");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res
      .status(400)
      .json({
        message:
          "User with this email already exists, please choose another email",
      });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();

    // Generate a token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Store the token in the user document
    newUser.token = token;
    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      token,
      message: `${username} Account created successfully`,
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid user data" });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (isPasswordValid) {
      // Generate a new token
      const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      // Store the new token in the user document
      existingUser.token = token;
      await existingUser.save();

      res.status(201).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
        token,
        message: `${email} Login successfully`,
      });
    } else {
      res.status(401).json({
        message: "Invalid password. Please try again.",
      });
    }
  } else {
    res.status(404).json({
      message: "User not found. Please check your email.",
    });
  }
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httyOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});
const getLoggedInUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      gender: user.gender,
      birthdate: user.birthdate,
      image: user.image,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const UpdateUsers = asyncHandler(async (req, res) => {
  // Get user from database
  const user = await User.findById(req.params.id);

  if (user) {
    // Update user fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin =
      req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;

    // Save updated user to database
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      message: `User successfully promoted to Admin`, // Success message
    });
  } else {
    res.status(404);
    throw new Error("User not found. Please check the provided ID."); // More descriptive error message
  }
});

const ProfileUpdate = asyncHandler(async (req, res) => {
  try {
    // const { username, birthdate, email, gender,employeeCode,DateOfjoining,position } = req.body;
    // console.log(username, birthdate, email, gender,employeeCode,DateOfjoining,position);

    const project = await User.findByIdAndUpdate(req.params.id, {
      ...req.body,
    });

    await project.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      project,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  // Delete user from database
  const result = await User.findByIdAndDelete(req.params.id);

  if (result) {
    res.json({
      message: "User removed successfully",
    });
  } else {
    res.status(404);
    throw new Error("User not found. Please check the provided ID.");
  }
});

const countTotalemails = async (req, res) => {
  try {
    const totalEmails = await User.countDocuments();
    res.json({ totalEmails });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getLoggedInUser,
  ProfileUpdate,
  deleteUser,
  UpdateUsers,
  createUser,
  loginUser,
  logoutCurrentUser,
  countTotalemails,
  getAllUsers,
};
