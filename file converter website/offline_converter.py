import pyttsx3
import PyPDF2
import speech_recognition as sr
from fpdf import FPDF
import os

# ----------- PDF → AUDIOBOOK -----------
def pdf_to_audio(pdf_path):
    if not os.path.exists(pdf_path):
        print("❌ File not found.")
        return

    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for page in reader.pages:
                text += page.extract_text()

        if not text.strip():
            print("⚠️ No readable text found in PDF.")
            return

        print("🎧 Converting text to speech...")
        engine = pyttsx3.init()
        engine.say(text)
        engine.runAndWait()
        print("✅ Done! Audiobook played successfully.")

    except Exception as e:
        print(f"⚠️ Error converting PDF to audio: {e}")


# ----------- AUDIO → PDF (Speech-to-Text) -----------
def audio_to_pdf(output_pdf="speech_output.pdf"):
    recognizer = sr.Recognizer()
    mic = sr.Microphone()

    print("🎙️ Speak clearly. Say 'stop listening' to finish.")
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    text_data = ""

    try:
        with mic as source:
            recognizer.adjust_for_ambient_noise(source)
            while True:
                print("🗣️ Listening...")
                audio = recognizer.listen(source, timeout=5)
                try:
                    text = recognizer.recognize_google(audio)
                    if "stop listening" in text.lower():
                        print("🛑 Stopping recording.")
                        break
                    print("You said:", text)
                    text_data += text + "\n"
                except sr.UnknownValueError:
                    print("⚠️ Could not understand audio.")
                except sr.RequestError:
                    print("❌ Speech Recognition service unavailable.")
                    break

        if text_data:
            pdf.multi_cell(0, 10, text_data)
            pdf.output(output_pdf)
            print(f"✅ PDF saved as '{output_pdf}'")
        else:
            print("⚠️ No text captured.")

    except Exception as e:
        print(f"⚠️ Error: {e}")


# ----------- MAIN MENU -----------
def main():
    print("\n🧩 FILE CONVERTER (Offline Edition)")
    print("1️⃣  PDF → Audiobook")
    print("2️⃣  Audio → PDF")
    print("3️⃣  Exit")

    choice = input("\nEnter your choice (1/2/3): ")

    if choice == "1":
        path = input("Enter PDF file path: ").strip('"')
        pdf_to_audio(path)
    elif choice == "2":
        audio_to_pdf()
    elif choice == "3":
        print("👋 Exiting... Have a great day!")
    else:
        print("❌ Invalid choice. Try again.")


if __name__ == "__main__":
    main()
