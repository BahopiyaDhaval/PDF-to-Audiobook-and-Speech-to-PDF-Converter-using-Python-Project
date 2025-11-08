import sys
import speech_recognition as sr
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

def audio_to_pdf(input_audio, output_pdf):
    # Transcribe audio to text
    recognizer = sr.Recognizer()
    with sr.AudioFile(input_audio) as source:
        audio_data = recognizer.record(source)
        text = recognizer.recognize_google(audio_data)

    # Create PDF with text
    c = canvas.Canvas(output_pdf, pagesize=letter)
    width, height = letter
    c.drawString(50, height - 50, text)
    c.save()

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python audio_to_pdf.py <input_audio> <output_pdf>")
        sys.exit(1)
    input_audio = sys.argv[1]
    output_pdf = sys.argv[2]
    audio_to_pdf(input_audio, output_pdf)
    print("PDF generated successfully")
