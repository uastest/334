// Importa funções do SDK
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"
import { getAnalytics, isSupported } from "firebase/analytics"

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCdQbnUweA99ag2QQm1rSVUSsvwmQ1S1WI",
  authDomain: "movu-4e906.firebaseapp.com",
  projectId: "movu-4e906",
  storageBucket: "movu-4e906.firebasestorage.app",
  messagingSenderId: "715582818681",
  appId: "1:715582818681:web:fbe026dadd38ebfeaa07a8",
  measurementId: "G-M6EDJTHGSK"
}

// Inicializa Firebase
const app = initializeApp(firebaseConfig)

const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

// Analytics só no navegador
let analytics = null

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) analytics = getAnalytics(app)
  }).catch(() => {})
}

export { app, db, auth, storage, analytics }
