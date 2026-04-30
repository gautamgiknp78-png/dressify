const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

const app = express();
app.use(cors());
app.use(express.json());

// Bug fix: Serve output files from a proper 'public' directory
const publicDir = path.join(__dirname, "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
app.use(express.static(publicDir));

// Bug fix: Ensure uploads directory exists before multer uses it
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const upload = multer({ dest: uploadsDir });

app.post("/ai", upload.single("image"), async (req, res) => {
  // Bug fix: check if file was actually uploaded
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded." });
  }

  const prompt = req.body.prompt;
  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  const imagePath = req.file.path;

  try {
    const formData = new FormData();
    formData.append("image", fs.createReadStream(imagePath));
    formData.append("prompt", prompt);

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/yisol/IDM-VTON",
      formData,
      {
        headers: {
          Authorization: "Bearer YOUR_HF_API_KEY",
          ...formData.getHeaders(),
        },
        responseType: "arraybuffer",
        timeout: 60000, // Bug fix: add timeout so server doesn't hang forever
      }
    );

    // Bug fix: save to public/ so it's actually served by express.static
    const outputFilename = `output_${Date.now()}.png`;
    const outputPath = path.join(publicDir, outputFilename);
    fs.writeFileSync(outputPath, response.data);

    res.json({
      image: `http://localhost:5000/${outputFilename}`,
    });

  } catch (err) {
    console.error("AI Error:", err.message);
    res.status(500).json({ error: "AI generation failed. Check your HuggingFace API key." });
  } finally {
    // Bug fix: clean up temp uploaded file to prevent disk leak
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
