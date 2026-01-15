const upload = require("../middleware/uploadMiddleware");

const uploadImage = async (req, res) => {
  try {
    // Multer middleware handles the file upload
    upload.single("image")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Construct the image URL
      const imageUrl = `${process.env.CLIENT_URL || "http://localhost:8000"}/uploads/${req.file.filename}`;

      res.status(200).json({
        message: "Image uploaded successfully",
        imageUrl: imageUrl,
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Error uploading image", error: error.message });
  }
};

module.exports = {
  uploadImage,
};
