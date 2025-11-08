# File Converter Website

A modern, responsive web application for converting various file formats including PDF, DOCX, and audio files. Built with React (frontend) and Node.js/Express (backend), featuring audio conversion capabilities using Python scripts.

## Features

- **File Conversions**:
  - PDF to DOCX
  - DOCX to PDF
  - PDF to Audio (Audiobook generation)
  - Audio to PDF (Speech-to-Text transcription)

- **Modern UI**: Beautiful gradient background with TailwindCSS styling
- **Drag & Drop**: Easy file upload interface
- **Progress Tracking**: Real-time conversion progress indicators
- **Error Handling**: Comprehensive error messages and validation
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React, TailwindCSS
- **Backend**: Node.js, Express, Multer
- **Libraries**: pdf-lib, mammoth, docx, PyPDF2, pyttsx3, SpeechRecognition, ReportLab
- **Audio Processing**: Python scripts for TTS and STT

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Python (v3.6 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd file-converter-website
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Install Python dependencies
   pip install pyttsx3 PyPDF2 SpeechRecognition reportlab
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend**:
   ```bash
   cd backend
   npm start
   ```
   Server will run on http://localhost:5000

2. **Start the Frontend**:
   ```bash
   cd frontend
   npm start
   ```
   App will open at http://localhost:3000

## Usage

1. Select the desired conversion type from the dropdown
2. Upload your file (drag & drop or click to select)
3. Click "Upload & Convert"
4. Wait for the conversion to complete
5. Download the converted file

## Supported Formats

- **PDF**: Portable Document Format
- **DOCX**: Microsoft Word Document
- **Audio**: WAV, MP3, FLAC (for speech-to-text)

## API Endpoints

- `POST /upload`: Convert PDF ↔ DOCX
- `POST /convert/pdf-to-audio`: Convert PDF to audio
- `POST /convert/audio-to-pdf`: Convert audio to PDF
- `GET /download/:filename`: Download converted file

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Offline Version (Python)

A lightweight offline converter combining all file conversions into one Python program.

### Features
- PDF to Audio (Audiobook generation)
- Audio to PDF (Speech-to-Text transcription)
- Text-based menu interface
- Works 100% offline (no internet required)
- Local file saving

### Setup
```bash
pip install PyPDF2 pyttsx3 SpeechRecognition pyaudio fpdf
```

### Usage
```bash
python offline_converter.py
```

Choose from the menu:
1. PDF → Audiobook (enter PDF file path)
2. Audio → PDF (speak into microphone)
3. Exit

Output files are saved in the same folder.

## License

This project is licensed under the MIT License - see the LICENSE file for details.


## for start this cd file-converter-website ; python offline_converter.py