import sys
import pyttsx3
from PyPDF2 import PdfReader

def pdf_to_audio(input_pdf, output_audio):
    # Extract text from PDF
    reader = PdfReader(input_pdf)
    text = ""
    for page in reader.pages:
        text += page.extract_text()

    # Convert text to speech
    engine = pyttsx3.init()
    engine.save_to_file(text, output_audio)
    engine.runAndWait()

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python pdf_to_audio.py <input_pdf> <output_audio>")
        sys.exit(1)
    input_pdf = sys.argv[1]
    output_audio = sys.argv[2]
    pdf_to_audio(input_pdf, output_audio)
    print("Audio generated successfully")
