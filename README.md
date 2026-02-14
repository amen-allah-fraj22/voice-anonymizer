# 🎙️ Voice Anonymizer — Setup Guide
## Hack for Hope | SafeVoice Feature

---

## 📁 Project Structure

```
voice-anonymizer/
├── python-service/
│   ├── anonymizer.py        ← The Python voice changer (Flask API)
│   └── requirements.txt     ← Python dependencies
├── node-integration/
│   └── voiceAnonymizer.js   ← Node.js module to call the Python service
└── voice-recorder.html      ← Frontend recording UI
```

---

## 🐍 PART 1: Setup the Python Service

### Step 1.1 — Make sure Python is installed
```bash
python3 --version
# Should show Python 3.8 or higher
```

### Step 1.2 — Install Python dependencies
```bash
cd python-service
pip install -r requirements.txt
```

### Step 1.3 — Start the Python service
```bash
python3 anonymizer.py
```

You should see:
```
🎙️  Voice Anonymizer Service starting on port 5001...
 * Running on http://0.0.0.0:5001
```

### Step 1.4 — Test it's working
Open a new terminal and run:
```bash
curl http://localhost:5001/health
# Should return: {"status": "ok", "service": "voice-anonymizer"}
```

---

## 🟢 PART 2: Setup the Node.js Integration

### Step 2.1 — Install Node.js dependencies
```bash
npm install axios form-data multer uuid
```

### Step 2.2 — Add to your existing Express app

In your main `app.js` or `server.js`, add these lines:

```javascript
const { upload, voiceReportRoute } = require('./voiceAnonymizer')

// Add this route to your Express app
app.post('/api/report/voice', upload.single('audio'), voiceReportRoute)
```

That's it for Node.js! 🎉

---

## 🌐 PART 3: Frontend Integration

The `voice-recorder.html` file shows the recording UI.

If you're using React, here's how to adapt it:
- The `startRecording()` function → useEffect with MediaRecorder
- The `submitReport()` function → call your API with fetch/axios
- The UI → translate JSX

The key part is this fetch call:
```javascript
const formData = new FormData()
formData.append('audio', audioBlob, 'report.wav')
fetch('/api/report/voice', { method: 'POST', body: formData })
```

---

## 🔄 How Everything Works Together

```
[Browser]
  User presses record button
  → MediaRecorder captures mic audio
  → User presses send
  → fetch('/api/report/voice') sends audio blob

[Node.js - Port 3000]
  → multer receives the audio file
  → voiceAnonymizer.js reads the file
  → sends it to Python service via axios

[Python - Port 5001]
  → librosa loads the audio
  → pitch shift: voice goes up 4 steps
  → time stretch: rhythm slightly changed
  → noise added: masks vocal fingerprint
  → original audio DELETED
  → returns anonymized audio

[Node.js]
  → receives anonymized audio from Python
  → saves it to disk
  → stores file path in database with the report
  → returns success + report tracking code

[Browser]
  → Shows "Your identity is protected ✅"
  → Shows tracking code for anonymous follow-up
```

---

## ⚙️ Tuning the Anonymization

In `anonymizer.py`, you can change these values:

| Parameter | Default | Effect |
|-----------|---------|--------|
| `pitch_steps` | `4` | Higher = more different from original. Try 3-6 |
| `time_stretch_rate` | `0.95` | 0.9 = slower, 1.1 = faster |
| `noise_level` | `0.002` | Higher = more noise (don't go above 0.01) |

---

## 🚨 Important Security Notes

1. **Original audio is ALWAYS deleted** immediately after anonymization
2. **Run Python service on the same server** as Node.js (not exposed to internet)
3. **Never send raw audio to any external API** — everything runs locally
4. The anonymized audio should also be **encrypted at rest** in your database

---

## 🐞 Common Problems

**Problem: `ModuleNotFoundError: No module named 'librosa'`**
```bash
pip install librosa
# If that doesn't work:
pip3 install librosa
```

**Problem: `ECONNREFUSED localhost:5001`**
→ The Python service is not running. Start it with `python3 anonymizer.py`

**Problem: `Cannot read property 'path' of undefined`**
→ Make sure you're using `upload.single('audio')` middleware in your route

**Problem: Audio quality is bad after anonymization**
→ Reduce `pitch_steps` to 3, or `noise_level` to 0.001

---

## ✅ Checklist for the Hackathon Demo

- [ ] Python service running on port 5001
- [ ] Node.js running and connected to Python
- [ ] User can record voice in the browser
- [ ] Audio preview plays before sending
- [ ] Anonymized version sounds clearly different
- [ ] Original audio deleted after processing
- [ ] Tracking code shown to user after submit
