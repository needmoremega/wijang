import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, get } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyBL4mZOuuPvypgWTDEBDrZ0KfXOXg77fOE',
  authDomain: 'wijang1.firebaseapp.com',
  databaseURL: 'https://wijang1-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'wijang1',
  storageBucket: 'wijang1.firebasestorage.app',
  messagingSenderId: '1018107958280',
  appId: '1:1018107958280:web:3826a51959fca6a8962dbd',  
  measurementId: 'G-TR7C7S1KF0',
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

export { database, ref, set, get }
