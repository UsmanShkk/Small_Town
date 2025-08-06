// routes/uploadImage.js
const express = require("express");
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../config/s3");

const router = express.Router();

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "public-read",
    key: (req, file, cb) => {
      const uniqueName = `${Date.now()}_${file.originalname}`;
      cb(null, uniqueName);
    },
  }),
});

router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.status(200).json({ imageUrl: req.file.location });
});

module.exports = router;
