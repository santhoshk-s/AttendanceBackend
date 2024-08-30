// config/storage.js
const { GridFsStorage } = require('multer-gridfs-storage');
const path = require('path');

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
const profileStorage = new GridFsStorage({
    url: mongoURI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const filename = path.basename(file.originalname);
            const fileInfo = {
                filename: filename,
                bucketName: 'images',
            };
            resolve(fileInfo);
        });
    },
  });

module.exports = {storage,profileStorage};
