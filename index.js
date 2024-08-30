const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const Grid = require('gridfs-stream'); // Make sure to import GridFS stream

// Files
const userRoutes = require('./routes/userRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes')
const resumeuploadRoutes =require('./routes/resumeUploadRoutes')
const app = express();
const url = process.env.ATLAS_URL;

  

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const conn = mongoose.connection;

app.use('/api/users', userRoutes);
app.use('/api/attendance',attendanceRoutes)


let gfs;

conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', () => {
    console.log('MongoDB connected.');

    // Init gfs
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
    gfs.collection('images');
    // Use upload routes
    app.use('/api', resumeuploadRoutes);

    // // Route for retrieving all files
    // app.get('/api/files', (req, res) => {
    //     gfs.files.find().toArray((err, files) => {
    //         if (err) {
    //             return res.status(500).json({ error: 'Error fetching files' });
    //         }
    //         if (!files || files.length === 0) {
    //             return res.status(404).json({ error: 'No files exist' });
    //         }
    //         return res.json(files);
    //     });
    // });

    // // Route for retrieving a single file
    // app.get('/api/files/:filename', (req, res) => {
    //     gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    //         if (err) {
    //             return res.status(500).json({ error: 'Error fetching file' });
    //         }
    //         if (!file) {
    //             return res.status(404).json({ error: 'No file exists' });
    //         }
    //         return res.json(file);
    //     });
    // });
});

const dirname = path.resolve();
app.use('/uploads', express.static(path.join(dirname, '/uploads')));
app.use('/uploads/profile', express.static(path.join(dirname, '/uploads/profile')));

// Define routes

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: err.message });
});

const port = process.env.PORT || 8001;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
