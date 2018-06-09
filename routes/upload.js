const express = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `uploads`);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      const err = new Error(`Extension`)
      err.code = `EXTENSION`
      return cb(err)
    }
    cb(null, true)
  }
}).single(`file`);

router.post(`/image`, (req, res) => {
  upload(req, res, err => {
    let error = ``;
    if (err) {
      if (err.code === `LIMIT_FILE_SIZE`) {
        error = `Image must be < 2mb`;
      }
      if (err.code === `EXTENSION`) {
        error = `Only jpg, jpeg and png`;
      }
    }
    res.json({
      ok: !error,
      error
    });
  });
});

module.exports = router;
