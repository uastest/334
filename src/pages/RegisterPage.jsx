import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, TrendingUp, CheckCircle } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { getTranslation } from '../utils/translations'

// Importar componentes de etapas
import RegisterStep1 from '@/components/RegisterStep1'
import RegisterStep2 from '@/components/RegisterStep2'
import RegisterStep3 from '@/components/RegisterStep3'
import RegisterStep4 from '@/components/RegisterStep4'
import RegisterStep5 from '@/components/RegisterStep5'
import RegisterStep6 from '@/components/RegisterStep6'

export default function RegisterPage({ language }) {
  const navigate = useNavigate()
  const t = (key) => getTranslation(language, key)

  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
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
    password: '',
  })

  // Determinar quantas etapas serão necessárias
  const getTotalSteps = () => {
    // Etapas: 1 (dados), 2 (info adicionais), 3 (docs), 4 (entrega), 5 (banco - se selecionado), 6 (revisão)
    return formData.deliveryMethod === 'bank' ? 6 : 5
  }

  const totalSteps = getTotalSteps()

  const handleDataChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNextStep = () => {
    // Se está na etapa 4 (escolha de entrega) e selecionou "pickup", pula a etapa de dados bancários
    if (currentStep === 4 && formData.deliveryMethod === 'pickup') {
      setCurrentStep(5) // Vai direto para revisão (que é a etapa 5 neste caso)
    } else {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // A lógica de registro de usuário (email/senha) foi movida para LoginPage.jsx
      // Esta página agora coleta dados adicionais e cria um 'lead' no Firestore.
      const docRef = await addDoc(collection(db, 'leads'), {
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
        status: 'pending_verification', // Status de verificação de lead
        password: formData.password, // Adicionando a senha ao lead
        createdAt: new Date().toISOString(),
      })

      // Mostrar página de sucesso
      navigate(`/verify/${docRef.id}`)
    } catch (error) {
      console.error('Erro ao adicionar documento ao Firebase: ', error)
      alert('Erro ao enviar cadastro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    const stepProps = {
      formData,
      onDataChange: handleDataChange,
      onNext: handleNextStep,
      onPrevious: handlePreviousStep,
      loading,
    }

    switch (currentStep) {
      case 1:
        return <RegisterStep1 {...stepProps} />
      case 2:
        return <RegisterStep2 {...stepProps} />
      case 3:
        return <RegisterStep3 {...stepProps} />
      case 4:
        return <RegisterStep4 {...stepProps} />
      case 5:
        // Se delivery é 'pickup', esta é a etapa de revisão
        if (formData.deliveryMethod === 'pickup') {
          return (
            <RegisterStep6
              {...stepProps}
              onSubmit={handleSubmit}
            />
          )
        }
        // Se delivery é 'bank', esta é a etapa de dados bancários
        return <RegisterStep5 {...stepProps} />
      case 6:
        // Esta é a etapa de revisão (apenas para delivery 'bank')
        return (
          <RegisterStep6
            {...stepProps}
            onSubmit={handleSubmit}
          />
        )
      default:
        return <RegisterStep1 {...stepProps} />
    }
  }

  const getStepLabel = (step) => {
    const labels = {
      1: 'Dados Pessoais',
      2: 'Informações',
      3: 'Documentos',
      4: 'Entrega',
      5: formData.deliveryMethod === 'bank' ? 'Banco' : 'Revisão',
      6: 'Revisão',
    }
    return labels[step] || ''
  }

  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                CambioExpress
              </span>
            </Link>
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-muted-foreground">
                Etapa {currentStep} de {totalSteps}
              </h2>
              <span className="text-sm font-medium text-blue-600">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />

            {/* Step Labels */}
            <div className="flex justify-between mt-6 gap-2">
              {Array.from({ length: totalSteps }).map((_, index) => {
                const step = index + 1
                const isCompleted = step < currentStep
                const isCurrent = step === currentStep

                return (
                  <div key={step} className="flex-1 flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold mb-2 transition-all ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isCurrent
                          ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        step
                      )}
                    </div>
                    <span className="text-xs text-center text-muted-foreground hidden md:block">
                      {getStepLabel(step)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Step Content */}
          <Card className="border-0 shadow-none">
            {renderStep()}
          </Card>
        </div>
      </section>

      {/* Footer Info */}
      <section className="border-t bg-gray-50 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 text-center text-sm">
              <div>
                <p className="font-semibold text-foreground mb-1">🔒 Seguro</p>
                <p className="text-muted-foreground">Seus dados são criptografados</p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">⚡ Rápido</p>
                <p className="text-muted-foreground">Processo simples e direto</p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">✓ Confiável</p>
                <p className="text-muted-foreground">Plataforma verificada</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
