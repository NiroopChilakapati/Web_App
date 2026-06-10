const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },

  filename(req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post("/", upload.array("files", 10), (req, res) => {
  const fileUrls = req.files.map((file) => {
    return `http://localhost:5000/uploads/${file.filename}`;
  });

  res.json({
    message: "Files uploaded successfully",
    files: fileUrls,
  });
});

module.exports = router;
