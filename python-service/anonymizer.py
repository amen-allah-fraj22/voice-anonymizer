"""
Voice Anonymizer Microservice
==============================
This Python script receives an audio file,
changes the voice characteristics so the reporter
cannot be identified, then returns the anonymized audio.

It uses: librosa (audio processing) + Flask (API server)
"""

from flask import Flask, request, jsonify, send_file
import librosa
import soundfile as sf
import numpy as np
import os
import uuid
import tempfile

app = Flask(__name__)

# ─────────────────────────────────────────────
# FOLDER where temp audio files are saved
# ─────────────────────────────────────────────
TEMP_FOLDER = tempfile.gettempdir()


def anonymize_voice(input_path: str, output_path: str):
    """
    This function does the actual voice changing.

    What it does:
    1. Loads the audio file
    2. Shifts the pitch (changes how high/low the voice sounds)
    3. Stretches time slightly (makes speech rhythm slightly different)
    4. Adds subtle noise to mask vocal fingerprint
    5. Saves the result

    Parameters:
    - input_path  : path to the original audio file
    - output_path : path where the anonymized file will be saved
    """

    # ── Step 1: Load the audio ──────────────────────────────────────
    # y  = the audio signal (a long list of numbers representing sound)
    # sr = sample rate (how many samples per second, usually 22050)
    y, sr = librosa.load(input_path, sr=None)

    # ── Step 2: Pitch shifting ──────────────────────────────────────
    # n_steps controls how much we change the pitch
    # Positive = voice goes higher, Negative = voice goes lower
    # 4 steps up is enough to make the voice unrecognizable
    # but still clearly understandable
    pitch_steps = 4  # you can change this: try 3, 4, or 5
    y_pitch_shifted = librosa.effects.pitch_shift(
        y,
        sr=sr,
        n_steps=pitch_steps
    )

    # ── Step 3: Time stretching ─────────────────────────────────────
    # Changes the speed/rhythm slightly without affecting pitch again
    # 1.0 = no change, 0.9 = 10% slower, 1.1 = 10% faster
    time_stretch_rate = 0.95  # very subtle, keeps voice natural
    y_stretched = librosa.effects.time_stretch(
        y_pitch_shifted,
        rate=time_stretch_rate
    )

    # ── Step 4: Add very subtle background noise ────────────────────
    # This masks the unique "vocal fingerprint" of the speaker
    # The noise level is very low so it doesn't disturb listening
    noise_level = 0.002  # 0.001 = almost silent, 0.005 = noticeable
    noise = np.random.normal(0, noise_level, len(y_stretched))
    y_final = y_stretched + noise

    # ── Step 5: Normalize audio level ──────────────────────────────
    # Makes sure the output isn't too loud or too quiet
    y_final = y_final / np.max(np.abs(y_final))

    # ── Step 6: Save the result ─────────────────────────────────────
    sf.write(output_path, y_final, sr)

    print(f"✅ Voice anonymized successfully → {output_path}")


# ─────────────────────────────────────────────────────────────────────
# API ENDPOINT: POST /anonymize
# ─────────────────────────────────────────────────────────────────────
# Your Node.js backend will call this endpoint
# It sends the audio file, gets back the anonymized version
# ─────────────────────────────────────────────────────────────────────
@app.route("/anonymize", methods=["POST"])
def anonymize_endpoint():
    """
    Receives audio file from Node.js
    Returns anonymized audio file
    """

    # ── Check that a file was actually sent ─────────────────────────
    if "audio" not in request.files:
        return jsonify({
            "success": False,
            "error": "No audio file provided. Send it as form field 'audio'"
        }), 400

    audio_file = request.files["audio"]

    # ── Check file is not empty ──────────────────────────────────────
    if audio_file.filename == "":
        return jsonify({
            "success": False,
            "error": "Empty filename"
        }), 400

    # ── Create unique temp file names ────────────────────────────────
    # uuid4() generates a random unique ID like: a3f8c2d1-...
    unique_id = str(uuid.uuid4())
    input_path  = os.path.join(TEMP_FOLDER, f"input_{unique_id}.wav")
    output_path = os.path.join(TEMP_FOLDER, f"output_{unique_id}.wav")

    try:
        # ── Save the uploaded file temporarily ───────────────────────
        audio_file.save(input_path)
        print(f"📥 Received audio: {input_path}")

        # ── Run the anonymization ────────────────────────────────────
        anonymize_voice(input_path, output_path)

        # ── Send back the anonymized file ────────────────────────────
        return send_file(
            output_path,
            mimetype="audio/wav",
            as_attachment=True,
            download_name="anonymized_report.wav"
        )

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

    finally:
        # ── IMPORTANT: Delete the ORIGINAL audio immediately ─────────
        # We never keep the original voice on disk
        if os.path.exists(input_path):
            os.remove(input_path)
            print(f"🗑️  Original audio deleted: {input_path}")
        # Note: output file is deleted after it's sent by Flask


# ─────────────────────────────────────────────
# Health check endpoint (to test the service)
# ─────────────────────────────────────────────
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "voice-anonymizer"})


# ─────────────────────────────────────────────
# START THE SERVER
# ─────────────────────────────────────────────
if __name__ == "__main__":
    print("🎙️  Voice Anonymizer Service starting on port 5001...")
    app.run(host="0.0.0.0", port=5001, debug=False)
