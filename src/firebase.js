// Importa funções do SDK
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCdQbnUweA99ag2QQm1rSVUSsvwmQ1S1WI",
  authDomain: "movu-4e906.firebaseapp.com",
  projectId: "movu-4e906",
  storageBucket: "movu-4e906.firebasestorage.app",
  messagingSenderId: "715582818681",
  appId: "1:715582818681:web:fbe026dadd38ebfeaa07a8",
  measurementId: "G-M6EDJTHGSK"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Analytics apenas no navegador
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) analytics = getAnalytics(app);
  });
}

export { app, analytics };
