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
const __dirname = path.dirname(__filename)

// ====================
// Inisialisasi Firebase
// ====================

// Proyek pertama: "wijang" untuk RTDB
const serviceAccountWijang = JSON.parse(
  await fs.promises.readFile(path.join(__dirname, 'wijang1-firebase-private-key.json'), 'utf8'),
)

const appRTDB = admin.initializeApp({
  credential: admin.credential.cert(serviceAccountWijang),
  databaseURL: 'https://wijang1-default-rtdb.asia-southeast1.firebasedatabase.app/', // Ganti dengan URL RTDB proyek "wijang"
})

// Proyek kedua: Misal file service account dari teman untuk Storage
const serviceAccountFriend = JSON.parse(
  await fs.promises.readFile(path.join(__dirname, 'informasippdb.json'), 'utf8'),
)
// Inisialisasi dengan nama app khusus, misalnya "storageApp"
const appStorage = admin.initializeApp(
  {
    credential: admin.credential.cert(serviceAccountFriend),
    storageBucket: 'informasippdb-a32b5.appspot.com', // Ganti dengan bucket storage proyek teman
  },
  'storageApp',
)

// Ambil referensi ke RTDB dan Storage Bucket
const database = appRTDB.database()
const bucket = appStorage.storage().bucket()
console.log('🔥 RTDB connected:', database.ref('/').toString())
console.log('🔥 Storage bucket:', bucket.name)

// ====================
// Setup Express & Middleware
// ====================
const app = express()
app.use(cors({ origin: '*' }))
app.use(express.json())

const upload = multer({ dest: 'uploads/' })

// ====================
// Bagian Konversi PDF
// ====================

// Fungsi untuk menjalankan Worker Thread
function convertPdfParallel(pdfPath, outputPath, callback) {
  console.log(`🚀 Starting PDF conversion: ${pdfPath}`)

  const worker = new Worker('./convertWorker.js', {
    workerData: { pdfPath, outputPath },
  })

  worker.on('message', (message) => {
    console.log('✅ Worker finished conversion:', message)
    callback(null, message)
  })

  worker.on('error', (error) => {
    console.error('❌ Worker error:', error)
    callback(error, null)
  })
}

// Fungsi untuk mengunggah file dengan retry jika gagal
async function uploadFileWithRetry(localFilePath, remoteFilePath) {
  let maxRetries = 5
  let attempt = 0

  while (attempt < maxRetries) {
    try {
      console.log(`⬆️ Uploading: ${localFilePath} → ${remoteFilePath} (Attempt ${attempt + 1})`)
      await bucket.upload(localFilePath, { destination: remoteFilePath })

      const fileRef = bucket.file(remoteFilePath)
      const [signedUrl] = await fileRef.getSignedUrl({
        action: 'read',
        expires: '03-01-2030',
      })

      console.log(`✅ Upload successful: ${localFilePath}`)
      return signedUrl
    } catch (uploadError) {
      console.error('❌ Upload failed: Retrying in 3 seconds...', uploadError)
      attempt++
      await new Promise((resolve) => setTimeout(resolve, 3000))
    }
  }

  console.error(`🚨 Upload failed after ${maxRetries} attempts: ${localFilePath}`)
  return null
}

// Fungsi untuk mengunggah file dalam batch
async function uploadFilesInBatches(files, customName, batchSize = 500) {
  const uploadedImages = []
  let batchCount = 0

  files.sort((a, b) => {
    let numA = parseInt(a.match(/(\\d+)\\.jpg$/)?.[1] || '0', 10)
    let numB = parseInt(b.match(/(\\d+)\\.jpg$/)?.[1] || '0', 10)
    return numA - numB
  })

  for (let i = 0; i < files.length; i += batchSize) {
    batchCount++
    console.log(`🚀 Starting Batch ${batchCount} (Files ${i + 1} - ${i + batchSize})`)

    const batch = files.slice(i, i + batchSize)
    const uploadPromises = batch.map((file, index) => {
      const localFilePath = path.join('uploads', file)
      const pageNumber = (i + index + 1).toString().padStart(4, '0')
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

      console.log(`📸 Found ${files.length} images to upload.`)

      await uploadFilesInBatches(files, customName, 500)

      // Hapus file lokal setelah upload selesai
      files.forEach((file) => fs.unlinkSync(path.join('uploads', file)))
      fs.unlinkSync(pdfPath)

      // URL folder di Firebase Storage
      const encodedFolderName = encodeURIComponent(`pdf-images/${customName}`)
      const folderUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedFolderName}%2F`

      res.json({ folderUrl })
      console.log('🎉 Conversion & upload completed. Folder URL:', folderUrl)
    })
  } catch (error) {
    console.error('❌ Conversion error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Endpoint untuk mengupload cover buku
app.post('/uploadCover', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

  const localFilePath = req.file.path
  // Buat nama file remote, misalnya berdasarkan original name
  const remoteFilePath = `book-covers/${req.file.originalname}`

  try {
    // Upload file cover ke Firebase Storage
    await bucket.upload(localFilePath, { destination: remoteFilePath })

    // Ambil URL file cover
    const fileRef = bucket.file(remoteFilePath)
    const [coverUrl] = await fileRef.getSignedUrl({
      action: 'read',
      expires: '03-01-2030',
    })

    // Hapus file lokal setelah upload selesai
    fs.unlinkSync(localFilePath)

    res.json({ coverUrl })
    console.log('Cover uploaded. URL:', coverUrl)
  } catch (error) {
    console.error('Error uploading cover:', error)
    res.status(500).json({ error: error.message })
  }
})

// ====================
// Endpoint CRUD Buku (RTDB)
// ====================

// Ambil semua buku dari RTDB
app.get('/books', async (req, res) => {
  try {
    const snapshot = await database.ref('kategori').once('value')
    if (!snapshot.exists()) {
      return res.status(404).json({ message: 'Tidak ada buku.' })
    }

    const books = []
    snapshot.forEach((kategoriSnap) => {
      kategoriSnap.forEach((bookSnap) => {
        books.push({
          id: bookSnap.key,
          kategori: kategoriSnap.key,
          ...bookSnap.val(),
        })
      })
    })

    res.json(books)
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengambil data buku.',
      error: error.message,
    })
  }
})

// Tambah buku baru
app.post('/books', async (req, res) => {
  try {
    const { judul, author, TanggalTerbit, kategori, stock, cover, pdf } = req.body

    if (!judul || !author || !kategori || stock === undefined) {
      return res.status(400).json({ message: 'Data tidak lengkap.' })
    }

    const sanitizedTitle = judul.trim().replace(/[.#$/[\]]/g, '')
    const bookRef = database.ref(`kategori/${kategori}/${sanitizedTitle}`)

    await bookRef.set({
      judul,
      author,
      TanggalTerbit,
      kategori,
      stock,
      view: 0,
      rekomendasi: false,
      ketersediaan: stock > 0,
      cover: cover || '',
      pdf: pdf || '',
    })

    res.status(201).json({ message: 'Buku berhasil ditambahkan.' })
  } catch (error) {
    res.status(500).json({
      message: 'Gagal menambahkan buku.',
      error: error.message,
    })
  }
})

app.put('/books/:kategori/:id', async (req, res) => {
  try {
    // Destructuring parameter dari URL dan body request
    const { kategori, id } = req.params
    const { judul, author, TanggalTerbit, stock, cover, pdf } = req.body

    // Validasi input
    if (!kategori || !id) {
      return res.status(400).json({ message: 'Kategori dan ID harus disertakan.' })
    }
    if (!judul || !author || !TanggalTerbit || stock === undefined) {
      return res
        .status(400)
        .json({ message: 'Judul, author, tanggal terbit, dan stock wajib diisi.' })
    }
    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({ message: 'Stock harus berupa angka positif.' })
    }

    // Referensi ke database Firebase
    const bookRef = database.ref(`kategori/${kategori}/${id}`)

    // Data yang akan diperbarui
    const updatedData = {
      judul,
      author,
      TanggalTerbit,
      stock,
      ketersediaan: stock > 0, // Menghitung ketersediaan berdasarkan stock
      cover: cover || '', // Jika cover tidak diberikan, tetapkan sebagai string kosong
      pdf: pdf || '', // Jika pdf tidak diberikan, tetapkan sebagai string kosong
    }

    // Memperbarui data di Firebase
    await bookRef.update(updatedData)

    // Mengembalikan respons sukses
    res.json({ message: 'Buku berhasil diperbarui.', updatedData })
  } catch (error) {
    // Menangani kesalahan
    console.error('Error updating book:', error)
    res.status(500).json({
      message: 'Gagal memperbarui buku.',
      error: error.message,
    })
  }
})

// Hapus buku
app.delete(`/books/:kategori/:id`, async (req, res) => {
  try {
    const { kategori, id } = req.params
    console.log(`👉 Permintaan hapus buku: kategori = ${kategori}, id = ${id}`)

    // 1. Ambil data buku
    const bookRef = database.ref(`kategori/${kategori}/${id}`)
    const bookSnapshot = await bookRef.once('value')
    const bookData = bookSnapshot.val()

    if (!bookData) {
      console.warn('❌ Buku tidak ditemukan di database.')
      return res.status(404).json({ message: 'Buku tidak ditemukan.' })
    }

    console.log('✅ Data buku ditemukan:', bookData)

    // 2. Hapus semua file di folder pdf-images/<judul>
    const encodedJudul = encodeURIComponent(bookData.judul)
    const folderName = `pdf-images/${encodedJudul}/`
    console.log(`📂 Menghapus file dari folder: ${folderName}`)

    const [files] = await bucket.getFiles({ prefix: folderName })
    console.log(`📄 Ditemukan ${files.length} file di folder.`)

    for (const file of files) {
      try {
        await file.delete()
        console.log(`🗑️ Berhasil hapus file: ${file.name}`)
      } catch (err) {
        console.warn(`⚠️ Gagal hapus file ${file.name}:`, err.message)
      }
    }

    // 3. Hapus PDF utama jika ada
    if (bookData.pdf) {
      console.log('📄 Mencoba hapus file PDF:', bookData.pdf)
      try {
        await bucket.file(bookData.pdf).delete()
        console.log('🗑️ File PDF berhasil dihapus.')
      } catch (err) {
        console.warn('⚠️ Gagal hapus PDF:', err.message)
      }
    }

    // 4. Hapus data dari Firebase Realtime Database
    console.log('🗂️ Menghapus data dari database...')
    await bookRef.remove()
    console.log('✅ Data di database berhasil dihapus.')

    res.json({ message: 'Buku berhasil dihapus beserta file di Storage.' })
  } catch (error) {
    console.error('💥 Error saat menghapus buku:', error.message)
    res.status(500).json({
      message: 'Gagal menghapus buku.',
      error: error.message,
    })
  }
})

// rekomendasi
app.put('/buku/:kategori/:id', async (req, res) => {
  try {
    const { kategori, id } = req.params
    const { rekomendasi } = req.body

    const bookRef = database.ref(`kategori/${kategori}/${id}`)
    await bookRef.update({ rekomendasi })

    res.json({ message: 'Status rekomendasi berhasil diperbarui.' })
  } catch (error) {
    res.status(500).json({
      message: 'Gagal memperbarui status rekomendasi.',
      error: error.message,
    })
  }
})
app.listen(3001, () => console.log('🚀 Backend running on http://localhost:3001'))
