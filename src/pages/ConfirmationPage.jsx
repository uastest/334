import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, CheckCircle, Clock, Download, Home } from 'lucide-react'
import { getTranslation } from '../utils/translations'

export default function ConfirmationPage({ language }) {
  const navigate = useNavigate()
  const { transactionId } = useParams()
  const t = (key) => getTranslation(language, key)
  
  const [transaction, setTransaction] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Buscar transação
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]')
    const foundTransaction = transactions.find(t => t.id === transactionId)
    
    if (foundTransaction) {
      setTransaction(foundTransaction)
      
      // Buscar usuário
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const foundUser = users.find(u => u.id === foundTransaction.userId)
      setUser(foundUser)
    } else {
      navigate('/')
    }
  }, [transactionId, navigate])

  if (!transaction || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-spin" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  const deliveryDate = new Date(new Date(transaction.paymentConfirmedAt || Date.now()).getTime() + 12 * 60 * 60 * 1000)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
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
              {t('confirmationTitle')}
            </h1>
            <p className="text-lg text-muted-foreground">
              Sua transação foi processada com sucesso
            </p>
          </div>

          {/* Transaction Details */}
          <Card className="shadow-lg mb-6 border-2 border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle>Detalhes da Transação</CardTitle>
              <CardDescription>
                ID da Transação: #{transactionId}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Você enviou:</p>
                  <p className="text-xl font-bold">
                    {transaction.amount} {transaction.fromCurrency}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Você receberá:</p>
                  <p className="text-xl font-bold text-green-600">
                    {transaction.convertedAmount} {transaction.toCurrency}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg">
                  <Clock className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-900">
                      {t('confirmationMessage')}
                    </p>
                    <p className="text-sm text-blue-700">
                      Previsão de entrega: {deliveryDate.toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <h3 className="font-semibold">Informações de Entrega:</h3>
                {user.deliveryMethod === 'bank' ? (
                  <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Método:</span> Transferência Bancária
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Banco:</span> {user.bankName}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Agência:</span> {user.bankAgency}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Conta:</span> {user.bankAccount}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Titular:</span> {user.accountHolder}
                    </p>
                  </div>
                ) : (
                  <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Método:</span> Retirada na Sede
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Endereço:</span> Av. Principal, 1234 - Ciudad del Este, Paraguay
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Horário:</span> Segunda a Sexta, 9h às 18h
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Lembre-se de trazer um documento de identidade válido.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="shadow-lg mb-6">
            <CardHeader>
              <CardTitle>Próximos Passos</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                <li className="flex gap-3">
                  <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Confirmação de Pagamento</p>
                    <p className="text-sm text-muted-foreground">
                      Nossa equipe está verificando o recebimento do pagamento.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-blue-600">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Processamento</p>
                    <p className="text-sm text-muted-foreground">
                      Após a confirmação, iniciaremos o processamento da sua transação.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-blue-600">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Entrega</p>
                    <p className="text-sm text-muted-foreground">
                      {user.deliveryMethod === 'bank' 
                        ? 'O valor será transferido para sua conta bancária em até 12 horas.'
                        : 'Você poderá retirar o dinheiro em nossa sede em até 12 horas.'}
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Notificação</p>
                    <p className="text-sm text-muted-foreground">
                      Você receberá uma confirmação via WhatsApp quando tudo estiver pronto.
                    </p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="flex-1"
              onClick={() => navigate('/')}
            >
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1"
              onClick={() => window.print()}
            >
              <Download className="w-4 h-4 mr-2" />
              Imprimir Comprovante
            </Button>
          </div>

          {/* Support */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              Precisa de ajuda? Entre em contato conosco:
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              <a href="https://wa.me/595611234567" className="text-sm font-medium text-blue-600 hover:underline">
                📱 WhatsApp
              </a>
              <a href="mailto:contato@cambioexpress.com" className="text-sm font-medium text-blue-600 hover:underline">
                📧 E-mail
              </a>
              <Link to="/contact" className="text-sm font-medium text-blue-600 hover:underline">
                💬 Fale Conosco
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

