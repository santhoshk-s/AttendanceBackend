// config/storage.js
const { GridFsStorage } = require('multer-gridfs-storage');
const path = require('path');

// MongoDB URI should be securely handled, typically using environment variables
const mongoURI =process.env.ATLAS_URL

const storage = new GridFsStorage({
    url: mongoURI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const filename = path.basename(file.originalname);
            const fileInfo = {
                filename: filename,
                bucketName: 'uploads',
            };
            resolve(fileInfo);
        });
    },
});

module.exports = storage;
