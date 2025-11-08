const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const { Document, Packer, Paragraph, TextRun } = require("docx");
const { PDFDocument, rgb } = require("pdf-lib");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Test route
app.get("/", (req, res) => res.send("Backend running..."));

// Upload & convert route
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const ext = path.extname(req.file.originalname).toLowerCase();
  const inputPath = req.file.path;
  let outputFilename = "";
  let outputPath = "";

  try {
    if (ext === ".pdf") {
      // Convert PDF to DOCX
      const dataBuffer = fs.readFileSync(inputPath);
      const data = await pdfParse(dataBuffer);
      const text = data.text;

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [new TextRun(text)],
              }),
            ],
          },
        ],
      });

      outputFilename = Date.now() + ".docx";
      outputPath = path.join(__dirname, "uploads", outputFilename);
      const buffer = await Packer.toBuffer(doc);
      fs.writeFileSync(outputPath, buffer);
    } else if (ext === ".docx") {
      // Convert DOCX to PDF
      const result = await mammoth.extractRawText({ path: inputPath });
      const text = result.value;

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      page.drawText(text, {
        x: 50,
        y: height - 50,
        size: 12,
        color: rgb(0, 0, 0),
      });

      outputFilename = Date.now() + ".pdf";
      outputPath = path.join(__dirname, "uploads", outputFilename);
      const pdfBytes = await pdfDoc.save();
      fs.writeFileSync(outputPath, pdfBytes);
    } else {
      return res.status(400).json({ error: "Unsupported file type. Only PDF and DOCX are supported." });
    }

    res.json({
      message: "File converted successfully",
      file: outputFilename
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Conversion failed" });
  }
});

// Audio conversion routes
app.post("/convert/pdf-to-audio", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const ext = path.extname(req.file.originalname).toLowerCase();
  if (ext !== ".pdf") return res.status(400).json({ error: "Only PDF files are supported for audio conversion" });

  const inputPath = req.file.path;
  const outputFilename = Date.now() + ".mp3";
  const outputPath = path.join(__dirname, "uploads", outputFilename);

  const pythonProcess = spawn("python", ["pdf_to_audio.py", inputPath, outputPath]);

  pythonProcess.on("close", (code) => {
    if (code === 0) {
      res.json({ message: "Audio generated successfully", file: outputFilename });
    } else {
      res.status(500).json({ error: "Audio generation failed" });
    }
  });

  pythonProcess.on("error", (error) => {
    console.error("Failed to start Python process:", error);
    res.status(500).json({ error: "Internal server error" });
  });
});

app.post("/convert/audio-to-pdf", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const ext = path.extname(req.file.originalname).toLowerCase();
  if (![".wav", ".mp3", ".flac"].includes(ext)) return res.status(400).json({ error: "Only audio files (WAV, MP3, FLAC) are supported" });

  const inputPath = req.file.path;
  const outputFilename = Date.now() + ".pdf";
  const outputPath = path.join(__dirname, "uploads", outputFilename);

  const pythonProcess = spawn("python", ["audio_to_pdf.py", inputPath, outputPath]);

  pythonProcess.on("close", (code) => {
    if (code === 0) {
      res.json({ message: "PDF generated successfully", file: outputFilename });
    } else {
      res.status(500).json({ error: "PDF generation failed" });
    }
  });

  pythonProcess.on("error", (error) => {
    console.error("Failed to start Python process:", error);
    res.status(500).json({ error: "Internal server error" });
  });
});

// Download route
app.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "uploads", filename);
  res.download(filePath, (err) => {
    if (err) {
      res.status(404).json({ error: "File not found" });
    }
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
