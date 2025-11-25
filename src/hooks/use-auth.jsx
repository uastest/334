import { auth, db } from '../firebase'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useState, useEffect, createContext, useContext } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null)
        setLoading(false)
        return
      }

      try {
        const userRef = doc(db, 'users', firebaseUser.uid)
        const userSnap = await getDoc(userRef)

        if (!userSnap.exists()) {
          await signOut(auth)
          setUser(null)
          setLoading(false)
          return
        }

        const data = userSnap.data()

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          ...data
        })

      } catch (err) {
        console.error("Erro ao buscar usuário:", err)
        await signOut(auth)
        setUser(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

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

  const logout = async () => {
    await signOut(auth)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
