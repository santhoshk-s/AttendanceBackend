const express=require('express');
const formidable=require("express-formidable");
const {getLoggedInUser,ProfileUpdate,UpdateUsers,createUser,loginUser,logoutCurrentUser,countTotalemails,getAllUsers, deleteUser, findUser}=require('../controllers/userController');
const {authenticate,authorizeAdmin}=require('../middlewares/authMiddleware');
const router=express.Router();
const multer = require('multer');
const {profileStorage} = require('../config/storage');
const { getImage } = require('../controllers/imageFetchHandler');
const uploads = multer({ storage: profileStorage });


router.
    route('/')
    .post(createUser)
    .get( getAllUsers);

router.route('/:id').put(UpdateUsers).delete(deleteUser);
router.route('/profile/:id').put(uploads.single('file'),ProfileUpdate)
router.route('/profile/image/:filename').get(getImage)
router.route('/profile').get(getLoggedInUser)
router.route('/find/profile/:email').get(findUser)

router.post("/auth",loginUser);

router.post("/logout",logoutCurrentUser);

router.route("/total-emails").get(countTotalemails);

module.exports=router;