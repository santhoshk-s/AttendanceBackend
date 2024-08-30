const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const { MongoClient, GridFSBucket } = require('mongodb');

// Initialize GridFS
const conn = mongoose.connection;
let gfs;
let bucket;

conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("images");
  bucket = new GridFSBucket(conn.db, { bucketName: 'images' }); 
});

const getImage= async (req, res) => {
  try {
    try {
      const { filename } = req.params;
      if(!filename){
        return res.status(404).json({ error: "no filename" });
      }
      const file = await bucket.find({ filename }).toArray();
      if (!file || file.length === 0) {
        return res.status(404).json({ error: "No file exists" });
      }
  
      const { contentType } = file[0];
      if (contentType === "image/jpeg" || contentType === "image/png") {
        const readstream = bucket.openDownloadStreamByName(filename);
        res.set("Content-Type", contentType);
        readstream.pipe(res);
      } else {
        res.status(404).json({ error: "Not an image" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = { getImage };
