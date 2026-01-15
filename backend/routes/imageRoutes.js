const express = require("express");
const { uploadImage } = require("../controllers/imageController");

const router = express.Router();

// Route for uploading images
router.post("/upload-image", uploadImage);

module.exports = router;
