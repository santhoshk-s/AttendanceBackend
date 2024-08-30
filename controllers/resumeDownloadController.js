const mongoose = require('mongoose');
const { MongoClient, GridFSBucket } = require('mongodb');
const Grid = require('gridfs-stream');
const conn = mongoose.connection;
let bucket;

conn.once('open', () => {
  const db = conn.db;
  bucket = new GridFSBucket(db, { bucketName: 'uploads' }); // Ensure this matches your GridFS bucket name
});
let gfs;
const downloadFile = async (req, res) => {
  const { pdfId } = req.params;

  try {
    // Ensure pdfId is a valid ObjectId
    const objectId = new mongoose.Types.ObjectId(pdfId);

    // Create a download stream
    const downloadStream = bucket.openDownloadStream(objectId);

    downloadStream.on('error', (err) => {
      console.error('Error downloading file:', err); // Debug log
      res.status(500).json({ error: 'An error occurred while downloading the file' });
    });

    downloadStream.on('data', (chunk) => {
      res.write(chunk); // Write the file chunks to the response
    });

    downloadStream.on('end', () => {
      res.end(); // End the response when the file stream ends
    });

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/pdf'); // Adjust based on actual file type
    res.setHeader('Content-Disposition', `attachment; filename=downloaded-file.pdf`); // Adjust filename as needed

  } catch (err) {
    console.error('Error:', err); // Debug log
    res.status(500).json({ error: 'An error occurred' });
  }
};

const getResume = (req, res) => {
  const { filename } = req.params;
  console.log('pdf',filename)
  gfs.files.findOne({ filename }, (err, file) => {
      if (err) return res.status(500).json({ error: 'Error fetching file' });
      if (!file) return res.status(404).json({ error: 'No file exists' });
      if (file.contentType === 'application/pdf') {
          const readstream = gfs.createReadStream(file.filename);
          res.set('Content-Type', 'application/pdf');
          readstream.pipe(res);
      } else {
          res.status(404).json({ error: 'Not a PDF' });
      }
  });
};




module.exports = { downloadFile,getResume };
