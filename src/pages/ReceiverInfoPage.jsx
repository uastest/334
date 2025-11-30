import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, TrendingUp, Clock, AlertCircle, Building2, User, Mail, Phone, CreditCard } from 'lucide-react'
import { getTranslation } from '../utils/translations'
import { useAuth } from '../hooks/use-auth'
import { db } from '../firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

export default function ReceiverInfoPage({ language }) {
  const navigate = useNavigate()
  const { transactionId } = useParams()
  const { user, loading: authLoading } = useAuth()
  const t = (key) => getTranslation(language, key)

  const [transaction, setTransaction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    receiverFullName: '',
    receiverEmail: '',
    receiverPhone: '',
    bankName: '',
    bankCountry: '',
    accountType: 'checking',
    accountNumber: '',
    routingNumber: '',
    swiftCode: '',
    iban: '',
  })

  // Buscar transação
  useEffect(() => {
    const fetchTransaction = async () => {
      if (!transactionId || !user) {
        navigate('/dashboard')
        return
      }

      try {
        const docRef = doc(db, 'transactions', transactionId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data.userId !== user.uid) {
            navigate('/dashboard')
            return
          }
          setTransaction({ id: docSnap.id, ...data })
        } else {
          navigate('/dashboard')
        }
      } catch (err) {
        console.error('Erro ao buscar transação:', err)
        setError('Erro ao carregar transação. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      fetchTransaction()
    }
  }, [transactionId, user, authLoading, navigate])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError(null)
  }

  const validateForm = () => {
    if (!formData.receiverFullName.trim()) {
      setError('Nome completo do recebedor é obrigatório')
      return false
    }
    if (!formData.receiverEmail.trim()) {
      setError('Email do recebedor é obrigatório')
      return false
    }
    if (!formData.receiverPhone.trim()) {
      setError('Telefone do recebedor é obrigatório')
      return false
    }
    if (!formData.bankName.trim()) {
      setError('Nome do banco é obrigatório')
      return false
    }
    if (!formData.bankCountry) {
      setError('País do banco é obrigatório')
      return false
    }
    if (!formData.accountNumber.trim()) {
      setError('Número da conta é obrigatório')
      return false
    }

    // Validações específicas por país
    if (formData.bankCountry !== 'BR' && !formData.swiftCode.trim()) {
      setError('Código SWIFT é obrigatório para contas internacionais')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const docRef = doc(db, 'transactions', transactionId)
      await updateDoc(docRef, {
        receiverInfo: {
          fullName: formData.receiverFullName,
          email: formData.receiverEmail,
          phone: formData.receiverPhone,
        },
        bankInfo: {
          bankName: formData.bankName,
          bankCountry: formData.bankCountry,
          accountType: formData.accountType,
          accountNumber: formData.accountNumber,
          routingNumber: formData.routingNumber || null,
          swiftCode: formData.swiftCode || null,
          iban: formData.iban || null,
        },
        status: 'pending_whatsapp_verification',
        updatedAt: new Date().toISOString(),
      })

      // Redirecionar para verificação de WhatsApp
      navigate(`/whatsapp-verify/${transactionId}`)
    } catch (err) {
      console.error('Erro ao salvar informações do recebedor:', err)
      setError('Erro ao salvar informações. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Clock className="w-16 h-16 mx-auto mb-4 text-blue-600 animate-spin" />
            <div className="absolute inset-0 bg-blue-400 blur-xl opacity-20 animate-pulse"></div>
          </div>
          <p className="text-slate-700 font-medium text-lg">Carregando informações...</p>
        </div>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-600" />
          <p className="text-red-600 font-semibold text-lg">Transação não encontrada</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4 bg-blue-600 hover:bg-blue-700">
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="bg-gradient-to-br from-blue-600 to-green-600 p-2 rounded-xl shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                CambioExpress
              </span>
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/dashboard')} 
              className="gap-2 border-slate-300 hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Page Title */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Informações do Recebedor
            </h1>
            <p className="text-slate-600 text-lg">Insira os dados da conta que receberá o dinheiro</p>
          </div>

          {/* Transaction Summary Card */}
          <Card className="shadow-xl mb-8 border-0 bg-gradient-to-br from-blue-600 to-green-600 text-white overflow-hidden">
            <CardContent className="pt-6 pb-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-blue-100 text-sm mb-1 font-medium">Você envia</p>
                  <p className="text-2xl md:text-3xl font-bold">
                    {transaction.amount} {transaction.fromCurrency}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-blue-100 text-sm mb-1 font-medium">Recebedor recebe</p>
                  <p className="text-2xl md:text-3xl font-bold">
                    {transaction.convertedAmount} {transaction.toCurrency}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Card */}
          <Card className="shadow-xl border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 border-b">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Building2 className="w-6 h-6 text-blue-600" />
                Dados do Recebedor e Conta Bancária
              </CardTitle>
              <CardDescription className="text-base">Preencha todos os campos obrigatórios com atenção</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <div className="bg-red-50 border-2 border-red-300 text-red-800 px-4 py-3 rounded-xl text-sm flex gap-3 items-start shadow-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="font-medium">{error}</span>
                  </div>
                )}

                {/* Receiver Info Section */}
                <div className="space-y-5 pb-6 border-b-2 border-slate-200">
                  <h3 className="font-bold text-xl flex items-center gap-2 text-slate-800">
                    <User className="w-5 h-5 text-blue-600" />
                    Dados do Recebedor
                  </h3>

                  <div>
                    <Label htmlFor="receiverFullName" className="text-base font-semibold text-slate-700">
                      Nome Completo *
                    </Label>
                    <div className="relative mt-2">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="receiverFullName"
                        type="text"
                        placeholder="João Silva Santos"
                        value={formData.receiverFullName}
                        onChange={(e) => handleInputChange('receiverFullName', e.target.value)}
                        className="pl-11 h-12 text-base border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="receiverEmail" className="text-base font-semibold text-slate-700">
                      Email *
                    </Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="receiverEmail"
                        type="email"
                        placeholder="joao@exemplo.com"
                        value={formData.receiverEmail}
                        onChange={(e) => handleInputChange('receiverEmail', e.target.value)}
                        className="pl-11 h-12 text-base border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="receiverPhone" className="text-base font-semibold text-slate-700">
                      Telefone/WhatsApp *
                    </Label>
                    <div className="relative mt-2">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="receiverPhone"
                        type="tel"
                        placeholder="+55 11 99999-9999"
                        value={formData.receiverPhone}
                        onChange={(e) => handleInputChange('receiverPhone', e.target.value)}
                        className="pl-11 h-12 text-base border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Bank Info Section */}
                <div className="space-y-5">
                  <h3 className="font-bold text-xl flex items-center gap-2 text-slate-800">
                    <Building2 className="w-5 h-5 text-green-600" />
                    Informações Bancárias
                  </h3>

                  <div>
                    <Label htmlFor="bankCountry" className="text-base font-semibold text-slate-700">
                      País da Conta *
                    </Label>
                    <Select value={formData.bankCountry} onValueChange={(value) => handleInputChange('bankCountry', value)}>
                      <SelectTrigger id="bankCountry" className="mt-2 h-12 text-base border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white">
                        <SelectValue placeholder="Selecione o país" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-slate-200 shadow-xl">
                        <SelectItem value="BR" className="text-base py-3 cursor-pointer hover:bg-blue-50 focus:bg-blue-100">
                          🇧🇷 Brasil
                        </SelectItem>
                        <SelectItem value="US" className="text-base py-3 cursor-pointer hover:bg-blue-50 focus:bg-blue-100">
                          🇺🇸 Estados Unidos
                        </SelectItem>
                        <SelectItem value="EU" className="text-base py-3 cursor-pointer hover:bg-blue-50 focus:bg-blue-100">
                          🇪🇺 Europa (IBAN)
                        </SelectItem>
                        <SelectItem value="AR" className="text-base py-3 cursor-pointer hover:bg-blue-50 focus:bg-blue-100">
                          🇦🇷 Argentina
                        </SelectItem>
                        <SelectItem value="PY" className="text-base py-3 cursor-pointer hover:bg-blue-50 focus:bg-blue-100">
                          🇵🇾 Paraguai
                        </SelectItem>
                        <SelectItem value="OTHER" className="text-base py-3 cursor-pointer hover:bg-blue-50 focus:bg-blue-100">
                          🌎 Outro
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="bankName" className="text-base font-semibold text-slate-700">
                      Nome do Banco *
                    </Label>
                    <div className="relative mt-2">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="bankName"
                        type="text"
                        placeholder="Ex: Banco do Brasil, BBVA, etc"
                        value={formData.bankName}
                        onChange={(e) => handleInputChange('bankName', e.target.value)}
                        className="pl-11 h-12 text-base border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="accountType" className="text-base font-semibold text-slate-700">
                      Tipo de Conta *
                    </Label>
                    <Select value={formData.accountType} onValueChange={(value) => handleInputChange('accountType', value)}>
                      <SelectTrigger id="accountType" className="mt-2 h-12 text-base border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-slate-200 shadow-xl">
                        <SelectItem value="checking" className="text-base py-3 cursor-pointer hover:bg-blue-50 focus:bg-blue-100">
                          💳 Conta Corrente
                        </SelectItem>
                        <SelectItem value="savings" className="text-base py-3 cursor-pointer hover:bg-blue-50 focus:bg-blue-100">
                          🏦 Conta Poupança
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="accountNumber" className="text-base font-semibold text-slate-700">
                      Número da Conta *
                    </Label>
                    <div className="relative mt-2">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="accountNumber"
                        type="text"
                        placeholder="123456789"
                        value={formData.accountNumber}
                        onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                        className="pl-11 h-12 text-base border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        required
                      />
                    </div>
                  </div>

                  {formData.bankCountry === 'BR' && (
                    <div>
                      <Label htmlFor="routingNumber" className="text-base font-semibold text-slate-700">
                        Agência (com dígito)
                      </Label>
                      <Input
                        id="routingNumber"
                        type="text"
                        placeholder="1234-5"
                        value={formData.routingNumber}
                        onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                        className="mt-2 h-12 text-base border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                  )}

                  {formData.bankCountry !== 'BR' && formData.bankCountry !== 'EU' && formData.bankCountry && (
                    <div>
                      <Label htmlFor="swiftCode" className="text-base font-semibold text-slate-700">
                        Código SWIFT/BIC *
                      </Label>
                      <Input
                        id="swiftCode"
                        type="text"
                        placeholder="ABCDUS33"
                        value={formData.swiftCode}
                        onChange={(e) => handleInputChange('swiftCode', e.target.value)}
                        className="mt-2 h-12 text-base border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        required={formData.bankCountry !== 'BR' && formData.bankCountry !== 'EU'}
                      />
                    </div>
                  )}

                  {formData.bankCountry === 'EU' && (
                    <div>
                      <Label htmlFor="iban" className="text-base font-semibold text-slate-700">
                        IBAN *
                      </Label>
                      <Input
                        id="iban"
                        type="text"
                        placeholder="DE89370400440532013000"
                        value={formData.iban}
                        onChange={(e) => handleInputChange('iban', e.target.value)}
                        className="mt-2 h-12 text-base border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        required={formData.bankCountry === 'EU'}
                      />
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <Clock className="w-5 h-5 animate-spin" />
                      Salvando informações...
                    </span>
                  ) : (
                    'Continuar para Verificação'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="mt-6 text-center text-sm text-slate-600 bg-blue-50 p-4 rounded-xl border border-blue-200">
            <p className="font-medium">🔒 Suas informações estão seguras e criptografadas</p>
          </div>
        </div>
      </section>
    </div>
  )
}
