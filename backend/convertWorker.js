import { workerData, parentPort } from 'worker_threads'
import { spawnSync } from 'child_process'

const { pdfPath, outputPath } = workerData

console.log(`🛠️ Worker started: Converting ${pdfPath} → ${outputPath}`)

const result = spawnSync('pdftoppm', [
  '-jpeg',
  '-jpegopt',
  'quality=75', // Menurunkan kualitas untuk ukuran lebih kecil
  '-r',
  '100', // Resolusi lebih rendah agar lebih cepat
  pdfPath,
  outputPath.replace('%d.jpg', ''),
])

if (result.error) {
  console.error(`❌ Worker failed:`, result.error.message)
  parentPort.postMessage({ error: result.error.message })
} else {
  console.log(`✅ Worker success: Converted ${pdfPath}`)
  parentPort.postMessage({ success: true })
}
