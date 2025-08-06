// middleware/upload.js
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const s3Client = require('../config/s3Client');

const bucket = process.env.AWS_BUCKET_NAME;

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket,
   //acl: 'public-read',
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const fileName = `meals/${Date.now()}${ext}`;
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'), false);
    }
  },
});

module.exports = upload;
