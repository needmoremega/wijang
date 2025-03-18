import express from 'express'
import multer from 'multer'
import { Worker } from 'worker_threads'
import fs from 'fs'
import cors from 'cors'
import admin from 'firebase-admin'
import path from 'path'
import { fileURLToPath } from 'url'

// Konversi __dirname untuk ES Module
const __filename = fileURLToPath(import.meta.url)
// eslint-disable-next-line no-unused-vars
const __dirname = path.dirname(__filename)

// Inisialisasi Firebase Admin SDK
const serviceAccount = JSON.parse(
  fs.readFileSync('informasippdb-a32b5-firebase-adminsdk-dka9u-23eeab1df3.json', 'utf8'),
)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'informasippdb-a32b5.appspot.com',
})
const bucket = admin.storage().bucket()

const app = express()
app.use(cors({ origin: '*' }))

const upload = multer({ dest: 'uploads/' })

// Fungsi untuk menjalankan Worker Thread
function convertPdfParallel(pdfPath, outputPath, callback) {
  console.log(`🚀 Starting PDF conversion: ${pdfPath}`)

  const worker = new Worker('./convertWorker.js', {
    workerData: { pdfPath, outputPath },
  })

  worker.on('message', (message) => {
    console.log(`✅ Worker finished conversion:`, message)
    callback(null, message)
  })

  worker.on('error', (error) => {
    console.error(`❌ Worker error:`, error)
    callback(error, null)
  })
}

// Fungsi untuk mengunggah file dengan retry jika gagal
async function uploadFileWithRetry(localFilePath, remoteFilePath) {
  let maxRetries = 5 // Maksimum percobaan upload
  let attempt = 0

  while (attempt < maxRetries) {
    try {
      console.log(`⬆️ Uploading: ${localFilePath} → ${remoteFilePath} (Attempt ${attempt + 1})`)
      await bucket.upload(localFilePath, { destination: remoteFilePath })

      const fileRef = bucket.file(remoteFilePath)
      const [signedUrl] = await fileRef.getSignedUrl({ action: 'read', expires: '03-01-2030' })

      console.log(`✅ Upload successful: ${localFilePath}`)
      return signedUrl
    } catch (uploadError) {
      console.error(`❌ Upload failed: Retrying in 3 seconds...`, uploadError)
      attempt++
      await new Promise((resolve) => setTimeout(resolve, 3000))
    }
  }

  console.error(`🚨 Upload failed after ${maxRetries} attempts: ${localFilePath}`)
  return null // Jika gagal total, return null
}

// Fungsi untuk mengunggah file dalam batch
async function uploadFilesInBatches(files, customName, batchSize = 50) {
  const uploadedImages = []
  let batchCount = 0

  files.sort((a, b) => {
    let numA = parseInt(a.match(/(\d+)\.jpg$/)?.[1] || '0', 10)
    let numB = parseInt(b.match(/(\d+)\.jpg$/)?.[1] || '0', 10)
    return numA - numB
  })

  for (let i = 0; i < files.length; i += batchSize) {
    batchCount++
    console.log(`🚀 Starting Batch ${batchCount} (Files ${i + 1} - ${i + batchSize})`)

    const batch = files.slice(i, i + batchSize)
    const uploadPromises = batch.map((file, index) => {
      const localFilePath = path.join('uploads', file)
      const pageNumber = (i + index + 1).toString().padStart(4, '0') // kasi kan endog nek ngarep
      const remoteFilePath = `pdf-images/${customName}/page-${pageNumber}.jpg`
      return uploadFileWithRetry(localFilePath, remoteFilePath)
    })

    const results = await Promise.allSettled(uploadPromises)

    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value !== null) {
        uploadedImages.push(result.value)
      }
    })

    console.log(`✅ Batch ${batchCount} completed.`)
  }

  return uploadedImages
}

// Endpoint untuk mengunggah dan mengonversi PDF
app.post('/convert', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

  const customName = req.body.customName || req.file.originalname.replace('.pdf', '')
  const pdfPath = req.file.path
  const outputPath = `uploads/output-${Date.now()}-%d.jpg`
  console.log('📂 Processing PDF:', pdfPath)

  try {
    convertPdfParallel(pdfPath, outputPath, async (error) => {
      if (error) {
        console.error('❌ Conversion error:', error)
        return res.status(500).json({ error: 'Conversion failed' })
      }

      let files = fs.readdirSync('uploads').filter((file) => file.startsWith('output-'))
      if (files.length === 0) {
        console.error('⚠️ No output generated. Conversion failed.')
        return res.status(500).json({ error: 'No output generated.' })
      }

      files.sort((a, b) => {
        let numA = parseInt(a.match(/(\d+)\.jpg$/)?.[1] || '0', 10)
        let numB = parseInt(b.match(/(\d+)\.jpg$/)?.[1] || '0', 10)
        return numA - numB
      })

      console.log(`📸 Found ${files.length} images to upload.`)

      // Upload dalam batch (misalnya 20 file sekaligus)
      const uploadedImages = await uploadFilesInBatches(files, customName, 50)

      // Hapus file lokal setelah upload selesai
      files.forEach((file) => fs.unlinkSync(path.join('uploads', file)))
      fs.unlinkSync(pdfPath)

      res.json({ images: uploadedImages })
      console.log('🎉 Conversion & upload completed:')
    })
  } catch (error) {
    console.error('❌ Conversion error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.listen(3001, () => console.log('🚀 Backend running on http://localhost:3001'))
