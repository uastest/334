import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, TrendingUp, Clock, AlertCircle } from 'lucide-react'
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
    accountType: 'checking', // checking ou savings
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-spin" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
          <p className="text-red-600 font-medium">Transação não encontrada</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                CambioExpress
              </span>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Informações do Recebedor</h1>
            <p className="text-muted-foreground">Insira os dados da conta que receberá o dinheiro</p>
          </div>

          {/* Transaction Summary */}
          <Card className="shadow-lg mb-6 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Você envia</p>
                  <p className="text-xl font-bold text-blue-900">
                    {transaction.amount} {transaction.fromCurrency}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Você recebe</p>
                  <p className="text-xl font-bold text-blue-900">
                    {transaction.convertedAmount} {transaction.toCurrency}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Dados do Recebedor e Conta Bancária</CardTitle>
              <CardDescription>Todos os campos são obrigatórios</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm flex gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    {error}
                  </div>
                )}

                {/* Receiver Info Section */}
                <div className="space-y-4 pb-6 border-b">
                  <h3 className="font-semibold text-lg">Dados do Recebedor</h3>

                  <div>
                    <Label htmlFor="receiverFullName">Nome Completo *</Label>
                    <Input
                      id="receiverFullName"
                      type="text"
                      placeholder="João Silva Santos"
                      value={formData.receiverFullName}
                      onChange={(e) => handleInputChange('receiverFullName', e.target.value)}
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="receiverEmail">Email *</Label>
                    <Input
                      id="receiverEmail"
                      type="email"
                      placeholder="joao@exemplo.com"
                      value={formData.receiverEmail}
                      onChange={(e) => handleInputChange('receiverEmail', e.target.value)}
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="receiverPhone">Telefone/WhatsApp *</Label>
                    <Input
                      id="receiverPhone"
                      type="tel"
                      placeholder="+55 11 99999-9999"
                      value={formData.receiverPhone}
                      onChange={(e) => handleInputChange('receiverPhone', e.target.value)}
                      className="mt-2"
                      required
                    />
                  </div>
                </div>

                {/* Bank Info Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Informações Bancárias</h3>

                  <div>
                    <Label htmlFor="bankCountry">País da Conta *</Label>
                    <Select value={formData.bankCountry} onValueChange={(value) => handleInputChange('bankCountry', value)}>
                      <SelectTrigger id="bankCountry" className="mt-2">
                        <SelectValue placeholder="Selecione o país" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BR">🇧🇷 Brasil</SelectItem>
                        <SelectItem value="US">🇺🇸 Estados Unidos</SelectItem>
                        <SelectItem value="EU">🇪🇺 Europa (IBAN)</SelectItem>
                        <SelectItem value="GB">🇬🇧 Reino Unido</SelectItem>
                        <SelectItem value="AR">🇦🇷 Argentina</SelectItem>
                        <SelectItem value="PY">🇵🇾 Paraguai</SelectItem>
                        <SelectItem value="OTHER">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="bankName">Nome do Banco *</Label>
                    <Input
                      id="bankName"
                      type="text"
                      placeholder="Ex: Banco do Brasil, BBVA, etc"
                      value={formData.bankName}
                      onChange={(e) => handleInputChange('bankName', e.target.value)}
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="accountType">Tipo de Conta *</Label>
                    <Select value={formData.accountType} onValueChange={(value) => handleInputChange('accountType', value)}>
                      <SelectTrigger id="accountType" className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="checking">Conta Corrente</SelectItem>
                        <SelectItem value="savings">Conta Poupança</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="accountNumber">Número da Conta *</Label>
                    <Input
                      id="accountNumber"
                      type="text"
                      placeholder="123456789"
                      value={formData.accountNumber}
                      onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                      className="mt-2"
                      required
                    />
                  </div>

                  {formData.bankCountry === 'BR' && (
                    <div>
                      <Label htmlFor="routingNumber">Agência (com dígito) *</Label>
                      <Input
                        id="routingNumber"
                        type="text"
                        placeholder="1234-5"
                        value={formData.routingNumber}
                        onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  )}

                  {formData.bankCountry !== 'BR' && formData.bankCountry !== 'EU' && (
                    <div>
                      <Label htmlFor="swiftCode">Código SWIFT/BIC *</Label>
                      <Input
                        id="swiftCode"
                        type="text"
                        placeholder="ABCDUS33"
                        value={formData.swiftCode}
                        onChange={(e) => handleInputChange('swiftCode', e.target.value)}
                        className="mt-2"
                        required={formData.bankCountry !== 'BR' && formData.bankCountry !== 'EU'}
                      />
                    </div>
                  )}

                  {formData.bankCountry === 'EU' && (
                    <div>
                      <Label htmlFor="iban">IBAN *</Label>
                      <Input
                        id="iban"
                        type="text"
                        placeholder="DE89370400440532013000"
                        value={formData.iban}
                        onChange={(e) => handleInputChange('iban', e.target.value)}
                        className="mt-2"
                        required={formData.bankCountry === 'EU'}
                      />
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {submitting ? 'Salvando...' : 'Continuar para Verificação'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
