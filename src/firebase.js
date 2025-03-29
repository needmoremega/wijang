import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, get } from 'firebase/database'
import { getStorage } from 'firebase/storage'

// Firebase RTDB configuration
const firebaseConfigRTDB = {
  apiKey: import.meta.env.VITE_FIREBASE_RTD_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_RTD_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_RTD_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_RTD_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_RTD_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_RTD_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_RTD_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_RTD_MEASUREMENT_ID,
}

// Firebase Storage configuration
const firebaseConfigStorage = {
  apiKey: import.meta.env.VITE_FIREBASE_STO_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_STO_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_STO_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_STO_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STO_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_STO_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_STO_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_STO_MEASUREMENT_ID,
}

// 🔥 Inisialisasi Firebase utama untuk RTDB
const appRTDB = initializeApp(firebaseConfigRTDB)
console.log(import.meta.env)
const database = getDatabase(appRTDB)

// 🔥 Inisialisasi Firebase sekunder untuk Storage
const appStorage = initializeApp(firebaseConfigStorage, 'storageApp')
const storage = getStorage(appStorage)

export { database, storage, ref, set, get }
