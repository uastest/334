import { useState, useEffect, useContext, createContext } from 'react'
import { auth, db } from '../firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const authContext = createContext()

// Hook
export const useAuth = () => {
  return useContext(authContext)
}

// Provider
export function AuthProvider({ children }) {
  const authValue = useProvideAuth()
  return <authContext.Provider value={authValue}>{children}</authContext.Provider>
}

function useProvideAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userStatus, setUserStatus] = useState(null)

  // Busca status do usuário no banco
  const fetchUserStatus = async (uid) => {
    if (!uid) return null

    try {
      const userDocRef = doc(db, 'users', uid)
      const userDoc = await getDoc(userDocRef)

      if (!userDoc.exists()) {
        setUserStatus('pending')
        return 'pending'
      }

      const status = userDoc.data().status || 'pending'

      setUserStatus(status)
      return status

    } catch (error) {
      console.error("Erro ao buscar status:", error)
      setUserStatus('error')
      return 'error'
    }
  }

  // Monitora login automático
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        await fetchUserStatus(firebaseUser.uid)
      } else {
        setUser(null)
        setUserStatus(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // ✅ REGISTRO: TODO USUÁRIO NASCE PENDENTE
  // Removendo a função register, pois ela não existe no original.
  // A lógica de registro está no RegisterPage.jsx


  // ✅ LOGIN: BLOQUEIA ATÉ SER APROVADO
  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const uid = userCredential.user.uid

    const userRef = doc(db, 'users', uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      await signOut(auth)
      throw new Error("Usuário ainda não foi registrado corretamente.")
    }

    const status = userSnap.data().status

    if (status !== "approved") {
      await signOut(auth)
      throw new Error("Cadastro pendente de aprovação.")
    }

    return userCredential.user
  }

  const logout = () => signOut(auth)

  return {
    user,
    userStatus,
    loading,
    register,
    login,
    logout,
    fetchUserStatus,
  }
}
