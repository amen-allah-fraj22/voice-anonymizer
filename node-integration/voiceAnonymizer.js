/**
 * voiceAnonymizer.js
 * ==================
 * This module is what your Node.js backend uses
 * to send audio to the Python service and get back
 * the anonymized version.
 *
 * How to use it in your existing Node.js route:
 *   const { anonymizeVoice } = require('./voiceAnonymizer')
 */

const axios   = require('axios')      // To make HTTP requests to Python
const FormData = require('form-data') // To send files as form data
const fs      = require('fs')         // File system (read/write files)
const path    = require('path')       // Build file paths correctly
const { v4: uuidv4 } = require('uuid') // Generate unique file names
const multer  = require('multer')     // Receive audio uploads from frontend

// ─────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────

// URL of your Python microservice
// If running on same machine: http://localhost:5001
const PYTHON_SERVICE_URL = process.env.VOICE_SERVICE_URL || 'http://localhost:5001'

// Folder where anonymized audio files are saved
const ANONYMIZED_FOLDER = path.join(__dirname, 'anonymized-audio')

// Create the folder if it doesn't exist
if (!fs.existsSync(ANONYMIZED_FOLDER)) {
  fs.mkdirSync(ANONYMIZED_FOLDER, { recursive: true })
}


// ─────────────────────────────────────────────────────────────────
// MULTER SETUP — handles audio file upload from the browser
// ─────────────────────────────────────────────────────────────────

// Store uploaded files temporarily before sending to Python
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/tmp') // Save temp files in /tmp
  },
  filename: (req, file, cb) => {
    // Give each file a unique name to avoid conflicts
    cb(null, `upload_${uuidv4()}.wav`)
  }
})

// Only accept audio files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['audio/wav', 'audio/webm', 'audio/ogg', 'audio/mp4']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true) // Accept the file
  } else {
    cb(new Error('Only audio files are allowed'), false)
  }
}

// Max file size: 20MB
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }
})


// ─────────────────────────────────────────────────────────────────
// MAIN FUNCTION: anonymizeVoice
// ─────────────────────────────────────────────────────────────────
/**
 * Sends an audio file to the Python service,
 * gets back the anonymized version, saves it,
 * and returns the file path.
 *
 * @param {string} inputFilePath - Path to the original audio file on disk
 * @returns {string} - Path to the saved anonymized audio file
 */
async function anonymizeVoice(inputFilePath) {
  console.log('🎙️  Sending audio to anonymizer service...')

  // ── Step 1: Read the original audio file ──────────────────────
  const fileStream = fs.createReadStream(inputFilePath)

  // ── Step 2: Build a form to send the file (like a browser form) ─
  const form = new FormData()
  form.append('audio', fileStream, {
    filename: 'voice.wav',
    contentType: 'audio/wav'
  })

  // ── Step 3: Send to Python service ────────────────────────────
  const response = await axios.post(
    `${PYTHON_SERVICE_URL}/anonymize`,
    form,
    {
      headers: {
        ...form.getHeaders() // Important: includes the multipart boundary
      },
      responseType: 'arraybuffer', // We expect binary audio data back
      timeout: 30000 // 30 second timeout
    }
  )

  // ── Step 4: Save the anonymized audio ─────────────────────────
  const outputFileName = `anon_${uuidv4()}.wav`
  const outputFilePath = path.join(ANONYMIZED_FOLDER, outputFileName)

  fs.writeFileSync(outputFilePath, response.data)
  console.log(`✅ Anonymized audio saved: ${outputFilePath}`)

  // ── Step 5: Delete the ORIGINAL file immediately ───────────────
  fs.unlinkSync(inputFilePath)
  console.log('🗑️  Original voice deleted from disk')

  // ── Step 6: Return path to anonymized file ────────────────────
  return outputFilePath
}


// ─────────────────────────────────────────────────────────────────
// EXPRESS ROUTE — plug this into your existing Express app
// ─────────────────────────────────────────────────────────────────
/**
 * POST /api/report/voice
 *
 * The frontend sends an audio recording.
 * This route anonymizes it and saves it with the report.
 *
 * Example frontend fetch():
 *   const formData = new FormData()
 *   formData.append('audio', audioBlob, 'report.wav')
 *   fetch('/api/report/voice', { method: 'POST', body: formData })
 */
async function voiceReportRoute(req, res) {
  try {
    // req.file is set by multer (the uploaded audio)
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No audio file received'
      })
    }

    const originalPath = req.file.path // temp path where multer saved it

    // ── Anonymize the voice ──────────────────────────────────────
    const anonymizedPath = await anonymizeVoice(originalPath)

    // ── Return the anonymized file path to store with the report ─
    // In your report creation logic, save this path to the database
    return res.status(200).json({
      success: true,
      message: 'Voice anonymized successfully',
      anonymizedAudioPath: anonymizedPath,
      // This is what you store in your database for this report
      // The original voice is already deleted at this point
    })

  } catch (error) {
    console.error('❌ Voice anonymization failed:', error.message)
    return res.status(500).json({
      success: false,
      error: 'Voice anonymization failed'
      // Never send the real error to the client in production!
    })
  }
}


// ─────────────────────────────────────────────────────────────────
// HOW TO ADD THIS TO YOUR EXISTING EXPRESS APP
// ─────────────────────────────────────────────────────────────────
//
// In your main app.js or routes file, add:
//
//   const { upload, voiceReportRoute } = require('./voiceAnonymizer')
//   app.post('/api/report/voice', upload.single('audio'), voiceReportRoute)
//
// ─────────────────────────────────────────────────────────────────

module.exports = {
  anonymizeVoice,     // Use this function directly in other parts of your code
  upload,             // Multer middleware for the route
  voiceReportRoute    // Express route handler
}
