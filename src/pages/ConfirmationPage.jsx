import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, CheckCircle, Clock, Download, Home, MessageCircle, Copy } from 'lucide-react'
import { getTranslation } from '../utils/translations'
import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function ConfirmationPage({ language }) {
  const navigate = useNavigate()
  const { transactionId } = useParams()
  const t = (key) => getTranslation(language, key)

  const [transaction, setTransaction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!transactionId) {
        navigate('/')
        return
      }

      try {
        const docRef = doc(db, 'transactions', transactionId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setTransaction({ id: docSnap.id, ...docSnap.data() })
        } else {
          navigate('/')
        }
      } catch (err) {
        console.error('Erro ao buscar transação:', err)
        navigate('/')
      } finally {
        setLoading(false)
      }
    }

    fetchTransaction()
  }, [transactionId, navigate])

  const handleCopyTransactionId = () => {
    navigator.clipboard.writeText(transactionId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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

  if (!transaction) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
        <div className="text-center">
          <p className="text-muted-foreground">Transação não encontrada</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Voltar para Home
          </Button>
        </div>
      </div>
    )
  }

  const deliveryDate = new Date(new Date(transaction.paymentConfirmedAt || Date.now()).getTime() + 12 * 60 * 60 * 1000)
  const deliveryDateFormatted = deliveryDate.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

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
          </div>
        </div>
      </header>

      {/* Confirmation Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-green-800">
              Pagamento Processando!
            </h1>
            <p className="text-lg text-muted-foreground">
              Sua transação foi recebida e está sendo processada pelo nosso time
            </p>
          </div>

          {/* Transaction Details */}
          <Card className="shadow-lg mb-6 border-2 border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle>Detalhes da Transação</CardTitle>
              <CardDescription className="flex items-center justify-between mt-2">
                <span>ID: #{transactionId?.slice(0, 12)}</span>
                <button
                  onClick={handleCopyTransactionId}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  {copied ? 'Copiado!' : 'Copiar ID'}
                </button>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Você enviou:</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {transaction.amount} {transaction.fromCurrency}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Você receberá:</p>
                  <p className="text-2xl font-bold text-green-600">
                    {transaction.convertedAmount} {transaction.toCurrency}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-3">
                  <span className="text-muted-foreground">Taxa de câmbio:</span>
                  <span className="font-semibold">1 {transaction.fromCurrency} = {transaction.exchangeRate?.toFixed(4)} {transaction.toCurrency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Método de pagamento:</span>
                  <span className="font-semibold capitalize">
                    {transaction.paymentMethod === 'pix' && '💳 PIX'}
                    {transaction.paymentMethod === 'swift' && '🏦 SWIFT Transfer'}
                    {transaction.paymentMethod === 'card' && '💳 Cartão de Crédito'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Receiver Info */}
          {transaction.receiverInfo && (
            <Card className="shadow-lg mb-6">
              <CardHeader>
                <CardTitle>Dados do Recebedor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nome:</span>
                  <span className="font-semibold">{transaction.receiverInfo.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-semibold">{transaction.receiverInfo.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Telefone:</span>
                  <span className="font-semibold">{transaction.receiverInfo.phone}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card className="shadow-lg mb-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Próximas Etapas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold flex-shrink-0">✓</div>
                  <div className="w-0.5 h-12 bg-blue-300 my-2"></div>
                </div>
                <div className="pb-4">
                  <p className="font-semibold text-blue-900">Pagamento Recebido</p>
                  <p className="text-sm text-blue-700">Seu pagamento foi processado com sucesso</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                  <div className="w-0.5 h-12 bg-blue-300 my-2"></div>
                </div>
                <div className="pb-4">
                  <p className="font-semibold text-blue-900">Comprovante via WhatsApp</p>
                  <p className="text-sm text-blue-700">Você receberá o comprovante cambial via WhatsApp em breve</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                  <div className="w-0.5 h-12 bg-blue-300 my-2"></div>
                </div>
                <div className="pb-4">
                  <p className="font-semibold text-blue-900">Transferência Processada</p>
                  <p className="text-sm text-blue-700">O dinheiro será transferido para sua conta</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">4</div>
                </div>
                <div>
                  <p className="font-semibold text-blue-900">Entrega Estimada</p>
                  <p className="text-sm text-blue-700">{deliveryDateFormatted}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Card */}
          <Card className="shadow-lg mb-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-900 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Precisa de Ajuda?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-green-900">
                Entre em contato conosco via WhatsApp para acompanhar sua transação ou esclarecer dúvidas.
              </p>
              <Button className="w-full bg-green-600 hover:bg-green-700 gap-2">
                <MessageCircle className="w-4 h-4" />
                Falar com Suporte via WhatsApp
              </Button>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 gap-2"
            >
              Voltar ao Dashboard
            </Button>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="flex-1 gap-2"
            >
              <Home className="w-4 h-4" />
              Página Inicial
            </Button>
          </div>

          {/* Important Info */}
          <Card className="shadow-lg mt-6 bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <p className="text-sm text-yellow-900">
                <span className="font-semibold">⚠️ Importante:</span> Guarde o ID da transação para referência. Você receberá o comprovante cambial via WhatsApp em breve.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
