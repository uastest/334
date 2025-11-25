import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, TrendingUp, Clock, AlertCircle, MessageCircle, CheckCircle } from 'lucide-react'
import { getTranslation } from '../utils/translations'
import { useAuth } from '../hooks/use-auth'
import { db } from '../firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

export default function WhatsAppVerifyPage({ language }) {
  const navigate = useNavigate()
  const { transactionId } = useParams()
  const { user, loading: authLoading } = useAuth()
  const t = (key) => getTranslation(language, key)

  const [transaction, setTransaction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [verificationCode, setVerificationCode] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [showCodeInput, setShowCodeInput] = useState(false)

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

  // Determinar opções de pagamento baseado no país
  const getPaymentOptions = () => {
    const country = transaction?.toCurrency
    
    if (country === 'BRL') {
      // Brasil: apenas PIX
      return [
        { code: 'pix', label: 'PIX', description: 'Transferência instantânea via PIX' }
      ]
    } else {
      // Outros países: SWIFT e Cartão
      return [
        { code: 'swift', label: 'SWIFT Transfer', description: 'Transferência bancária internacional' },
        { code: 'card', label: 'Cartão de Crédito', description: 'Pagamento com cartão de crédito' }
      ]
    }
  }

  const handleSendCode = async () => {
    if (!paymentMethod) {
      setError('Por favor, selecione um método de pagamento')
      return
    }

    setError(null)
    // Aqui você enviaria o código via WhatsApp
    // Por enquanto, apenas mostramos o input para o código
    setShowCodeInput(true)
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()

    if (!verificationCode.trim()) {
      setError('Por favor, insira o código de verificação')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const docRef = doc(db, 'transactions', transactionId)
      
      // Mapear código para página de pagamento
      let paymentPageId = ''
      
      if (paymentMethod === 'pix') {
        // PIX: códigos 1-10
        const codeNum = parseInt(verificationCode)
        if (codeNum >= 1 && codeNum <= 10) {
          paymentPageId = `pix_${codeNum}`
        } else {
          setError('Código inválido para PIX. Use códigos de 1 a 10.')
          setSubmitting(false)
          return
        }
      } else if (paymentMethod === 'swift') {
        // SWIFT: códigos 11-12
        const codeNum = parseInt(verificationCode)
        if (codeNum >= 11 && codeNum <= 12) {
          paymentPageId = `swift_${codeNum}`
        } else {
          setError('Código inválido para SWIFT. Use códigos 11 ou 12.')
          setSubmitting(false)
          return
        }
      } else if (paymentMethod === 'card') {
        // Cartão: códigos 13-14
        const codeNum = parseInt(verificationCode)
        if (codeNum >= 13 && codeNum <= 14) {
          paymentPageId = `card_${codeNum}`
        } else {
          setError('Código inválido para Cartão. Use códigos 13 ou 14.')
          setSubmitting(false)
          return
        }
      }

      await updateDoc(docRef, {
        paymentMethod,
        verificationCode,
        paymentPageId,
        status: 'pending_payment',
        verifiedAt: new Date().toISOString(),
      })

      // Redirecionar para página de pagamento
      navigate(`/payment-gateway/${paymentPageId}/${transactionId}`)
    } catch (err) {
      console.error('Erro ao verificar código:', err)
      setError('Erro ao verificar código. Tente novamente.')
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

  const paymentOptions = getPaymentOptions()

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
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Verificação de WhatsApp</h1>
            <p className="text-muted-foreground">Escolha seu método de pagamento e verifique via WhatsApp</p>
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

          {/* Payment Method Selection */}
          <Card className="shadow-lg border-0 mb-6">
            <CardHeader>
              <CardTitle>Escolha o Método de Pagamento</CardTitle>
              <CardDescription>Selecione como deseja pagar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm flex gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <div className="space-y-3">
                {paymentOptions.map((option) => (
                  <label
                    key={option.code}
                    className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === option.code
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={option.code}
                      checked={paymentMethod === option.code}
                      onChange={(e) => {
                        setPaymentMethod(e.target.value)
                        setShowCodeInput(false)
                        setVerificationCode('')
                        setError(null)
                      }}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{option.label}</p>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>

              {paymentMethod && !showCodeInput && (
                <Button
                  onClick={handleSendCode}
                  className="w-full bg-green-600 hover:bg-green-700 gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Enviar Código via WhatsApp
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Code Verification */}
          {showCodeInput && (
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Insira o Código de Verificação</CardTitle>
                <CardDescription>Você receberá um código via WhatsApp</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <div>
                    <Label htmlFor="verificationCode">Código de Verificação *</Label>
                    <Input
                      id="verificationCode"
                      type="text"
                      placeholder="Digite o código recebido"
                      value={verificationCode}
                      onChange={(e) => {
                        setVerificationCode(e.target.value)
                        setError(null)
                      }}
                      className="mt-2 text-center text-2xl font-bold tracking-widest"
                      maxLength="2"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {paymentMethod === 'pix' && 'Use códigos de 1 a 10 para PIX'}
                      {paymentMethod === 'swift' && 'Use códigos 11 ou 12 para SWIFT'}
                      {paymentMethod === 'card' && 'Use códigos 13 ou 14 para Cartão'}
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-2">
                      <MessageCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-900">
                        <p className="font-medium">Não recebeu o código?</p>
                        <p className="text-xs mt-1">Entre em contato conosco via WhatsApp para receber o código manualmente.</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting || !verificationCode.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {submitting ? 'Verificando...' : 'Verificar Código'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCodeInput(false)
                      setVerificationCode('')
                      setPaymentMethod('')
                    }}
                    className="w-full"
                  >
                    Voltar
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Info Card */}
          {!showCodeInput && (
            <Card className="shadow-lg border-0 mt-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-900 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Próximas Etapas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-green-900">
                <div className="flex gap-2">
                  <span className="font-bold bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</span>
                  <p>Selecione o método de pagamento acima</p>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</span>
                  <p>Clique em "Enviar Código via WhatsApp"</p>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">3</span>
                  <p>Insira o código que receberá</p>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">4</span>
                  <p>Prossiga para o pagamento</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}
