const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const auth = require('../middleware/auth');
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', auth, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No photo uploaded' });
    }

    const result = await cloudinary.uploader.upload_stream({ 
      folder: 'skillbloom/profiles' 
    }, (error, result) => {
      if (error) {
        return res.status(500).json({ error: 'Upload failed' });
      }
      res.json({ photoUrl: result.secure_url });
    }).end(req.file.buffer);

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Server upload error' });
  }
});

module.exports = router;

