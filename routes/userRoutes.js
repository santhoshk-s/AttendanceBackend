const express=require('express');
const formidable=require("express-formidable");
const {getLoggedInUser,ProfileUpdate,UpdateUsers,createUser,loginUser,logoutCurrentUser,countTotalemails,getAllUsers, deleteUser, getTime,createAttendance,updateDepartureTime}=require('../controllers/userController');
const {authenticate,authorizeAdmin}=require('../middlewares/authMiddleware');
const router=express.Router();


router.
    route('/')
    .post(createUser)
    .get( getAllUsers);

router.route('/:id').put(UpdateUsers).delete(deleteUser);
router.route('/profile/:id').put(ProfileUpdate)
router.route('/profile').get(getLoggedInUser)

router.post("/auth",loginUser);

router.post("/logout",logoutCurrentUser);

router.route("/total-emails").get(countTotalemails);

module.exports=router;