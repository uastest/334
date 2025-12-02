import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, CreditCard, Copy, TrendingUp, AlertCircle, Clock, ArrowLeft } from 'lucide-react'
import { db } from '../firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

// Este componente agora é específico para PIX.
export default function PayToPix0189({ language }) {
  // **CORREÇÃO APLICADA AQUI** - Removemos 'pageId' pois não é mais necessário.
  // O roteador deve estar configurado para passar apenas 'transactionId'.
  // Ex: <Route path="/Pay-to-Pix-0189/:transactionId" element={<PayToPix0189 />} />
  const { transactionId } = useParams()
  const navigate = useNavigate()
  const [pixCode, setPixCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [transaction, setTransaction] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // **CORREÇÃO APLICADA AQUI** - O método de pagamento é fixo.
  const [paymentMethod] = useState('pix') // Sempre será 'pix' nesta página.

  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [showProcessingMessage, setShowProcessingMessage] = useState(false)

  // **REMOVIDO** - A lógica para determinar o tipo de pagamento não é mais necessária.
  // useEffect(() => { ... }, [pageId])

  // Gerar código PIX
  useEffect(() => {
    // A condição 'if (paymentMethod === 'pix')' ainda é útil se você copiar este
    // componente para outros métodos, mas aqui ela sempre será verdadeira.
    setPixCode("SEU_CODIGO_PIX_FIXO_AQUI")
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

  // O resto do componente permanece praticamente igual, mas agora só renderiza a parte do PIX.
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

      <section className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
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

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              💳 Pagamento via PIX
            </h1>
            <p className="text-muted-foreground">
              Escaneie o QR Code ou copie o código PIX
            </p>
          </div>

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

          {/* Apenas a lógica de pagamento PIX é mantida */}
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

          {/* O resto do componente continua igual... */}
        </div>
      </section>
    </div>
  )
}
