import { useState } from 'react'
import { db, auth } from '../firebase'
import { collection, addDoc, doc, setDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

import RegisterStep1 from '@/components/RegisterStep1'
import RegisterStep2 from '@/components/RegisterStep2'
import RegisterStep3 from '@/components/RegisterStep3'
import RegisterStep4 from '@/components/RegisterStep4'
import RegisterStep5 from '@/components/RegisterStep5'
import RegisterStep6 from '@/components/RegisterStep6'

export default function RegisterPage() {
  const navigate = useNavigate()

  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    nationality: '',
    deliveryMethod: 'bank',
    bankName: '',
    bankAccount: '',
    bankAgency: '',
    accountHolder: '',
    documentFile: null,
    selfieFile: null,
  })

  // Removendo getTotalSteps e totalSteps para simplificar a lógica de navegação.
  // A navegação será controlada diretamente em handleNext e handlePrevious.

  const handleDataChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNext = (deliveryMethod) => {
    let nextStep = currentStep + 1

    // Lógica para pular o passo 5 (dados bancários) se o método de entrega for 'pickup'
    // Usa o deliveryMethod passado como argumento para garantir que o valor mais recente seja usado
    if (currentStep === 4 && deliveryMethod === 'pickup') {
      nextStep = 6 // Pula do passo 4 para o passo 6
    }

    // O número máximo de passos é 6 (Passo 6 é o último)
    setCurrentStep(prev => Math.min(nextStep, 6))
  }

  const handlePrevious = () => {
    let previousStep = currentStep - 1

    // Lógica para voltar do passo 6 para o passo 4 se o método de entrega for 'pickup'
    if (currentStep === 6 && formData.deliveryMethod === 'pickup') {
      previousStep = 4 // Volta do passo 6 para o passo 4
    }

    setCurrentStep(prev => Math.max(previousStep, 1))
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      if (!formData.email || !formData.email.includes('@')) {
        alert("Email inválido")
        setLoading(false)
        return
      }

      // 1. Cria usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )

      const uid = userCredential.user.uid

      // 2. Cria documento em USERS
      await setDoc(doc(db, 'users', uid), {
        uid,
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone,
        status: 'pending_approval',
        role: 'user',
        createdAt: new Date().toISOString()
      })

      // 3. Cria LEAD
      const leadRef = await addDoc(collection(db, 'leads'), {
        uid,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        nationality: formData.nationality,
        deliveryMethod: formData.deliveryMethod,
        bankName: formData.bankName || null,
        bankAccount: formData.bankAccount || null,
        bankAgency: formData.bankAgency || null,
        accountHolder: formData.accountHolder || null,
        documentFileName: formData.documentFile?.name || null,
        selfieFileName: formData.selfieFile?.name || null,
        status: 'pending_verification',
        createdAt: new Date().toISOString()
      })

      // 4. Vai pra verificação
      navigate(`/verify/${leadRef.id}`)

    } catch (error) {
      console.error("Erro no cadastro:", error)

      if (error.code === 'auth/invalid-email') {
        alert("Email inválido")
      } else if (error.code === 'auth/email-already-in-use') {
        alert("Email já cadastrado")
      } else if (error.code === 'auth/weak-password') {
        alert("Senha fraca (mínimo 6 caracteres)")
      } else {
        alert("Erro ao criar cadastro. Veja o console.")
      }
    }

    setLoading(false)
  }

  const renderStep = () => {
    const props = {
      formData,
      onDataChange: handleDataChange,
      onNext: handleNext,
      onPrevious: handlePrevious,
      onSubmit: handleSubmit,
      loading
    }

    switch (currentStep) {
      case 1: return <RegisterStep1 {...props} />
      case 2: return <RegisterStep2 {...props} />
      case 3: return <RegisterStep3 {...props} />
      case 4: return <RegisterStep4 {...props} />
      case 5: return <RegisterStep5 {...props} />
      case 6: return <RegisterStep6 {...props} />
      default: return <RegisterStep1 {...props} />
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {renderStep()}
    </div>
  )
}
