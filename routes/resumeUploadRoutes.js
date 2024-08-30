// routes/uploadRoutes.js
const express = require('express');
const multer = require('multer');
const {storage} = require('../config/storage');
const uploadController = require('../controllers/resumeUploadHandler');
const {getFilesByJobType}=require('../controllers/resumeFetchHandler')
const {downloadFile,getResume}=require('../controllers/resumeDownloadController')
const router = express.Router();
const upload = multer({ storage });

// Route for uploading files and creating dynamic schema
router.post('/upload/:jobType',  upload.array('files'), uploadController.createSchemaAndUploadFile);
router.get('/files/:jobType', getFilesByJobType);
router.get('/download/:pdfId', downloadFile);
router.get('/files/:filename', getResume);
module.exports = router;
