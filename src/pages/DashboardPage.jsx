import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowRight, TrendingUp, LogOut, User, ArrowLeftRight, DollarSign, Clock, CheckCircle } from 'lucide-react'
import { getTranslation } from '../utils/translations'
import { useAuth } from '../hooks/use-auth'
import { db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'

const currencies = [
  { code: 'USD', name: 'Dólar Americano', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'Libra Esterlina', symbol: '£', flag: '🇬🇧' },
  { code: 'BRL', name: 'Real Brasileiro', symbol: 'R$', flag: '🇧🇷' },
  { code: 'PYG', name: 'Guarani Paraguaio', symbol: '₲', flag: '🇵🇾' },
  { code: 'ARS', name: 'Peso Argentino', symbol: '$', flag: '🇦🇷' },
]

export default function DashboardPage({ language }) {
  const navigate = useNavigate()
  const { user, logout, loading } = useAuth()
  const t = (key) => getTranslation(language, key)

  const [amount, setAmount] = useState('1000')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('BRL')
  const [convertedAmount, setConvertedAmount] = useState(0)
  const [exchangeRate, setExchangeRate] = useState(5.5)
  const [loadingRate, setLoadingRate] = useState(false)
  const [error, setError] = useState(null)
  const [converting, setConverting] = useState(false)

  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  // Validar entrada de valor
  const isValidAmount = (val) => {
    const num = parseFloat(val)
    return !isNaN(num) && num > 0 && num <= 999999999
  }

  // Buscar taxa de câmbio
  useEffect(() => {
    const fetchExchangeRate = async () => {
      setLoadingRate(true)
      setError(null)
      try {
        await new Promise(resolve => setTimeout(resolve, 500))

        const rates = {
          'USD-BRL': 5.5,
          'EUR-BRL': 6.1,
          'GBP-BRL': 7.2,
          'BRL-USD': 0.18,
          'BRL-EUR': 0.16,
          'USD-PYG': 7200,
          'PYG-USD': 0.00014,
          'USD-EUR': 0.92,
          'EUR-USD': 1.09,
          'GBP-USD': 1.27,
          'USD-GBP': 0.79,
        }

        const rateKey = `${fromCurrency}-${toCurrency}`
        const rate = rates[rateKey] || 1
        const rateWithFee = rate * 0.996
        setExchangeRate(rateWithFee)
      } catch (err) {
        console.error('Erro ao buscar taxa de câmbio:', err)
        setError('Erro ao buscar taxa de câmbio. Tente novamente.')
      } finally {
        setLoadingRate(false)
      }
    }

    fetchExchangeRate()
  }, [fromCurrency, toCurrency])

  // Calcular valor convertido
  useEffect(() => {
    const numAmount = parseFloat(amount) || 0
    if (numAmount > 0) {
      setConvertedAmount((numAmount * exchangeRate).toFixed(2))
    } else {
      setConvertedAmount(0)
    }
  }, [amount, exchangeRate])

  // Inverter moedas
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  // Criar transação e ir para informações do recebedor
  const handleConvert = async () => {
    if (!isValidAmount(amount)) {
      setError('Por favor, insira um valor válido entre 1 e 999.999.999')
      return
    }

    setConverting(true)
    setError(null)

    try {
      const transactionData = {
        userId: user.uid,
        userEmail: user.email,
        amount: parseFloat(amount),
        fromCurrency,
        toCurrency,
        convertedAmount: parseFloat(convertedAmount),
        exchangeRate,
        status: 'pending_receiver_info',
        createdAt: new Date().toISOString(),
      }

      const docRef = await addDoc(collection(db, 'transactions'), transactionData)
      navigate(`/receiver-info/${docRef.id}`)
    } catch (err) {
      console.error('Erro ao criar transação:', err)
      setError('Erro ao criar transação. Tente novamente.')
    } finally {
      setConverting(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (err) {
      console.error('Erro ao fazer logout:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
            <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                CambioExpress
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">{user?.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Bem-vindo ao Dashboard</h1>
            <p className="text-muted-foreground">Realize suas conversões de moeda de forma rápida e segura</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Converter Card */}
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">Conversor de Moedas</CardTitle>
                <CardDescription>Taxa de câmbio atualizada em tempo real</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* From Currency */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Você envia</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value)
                        setError(null)
                      }}
                      className="flex-1 text-lg"
                      placeholder="1000"
                      min="0"
                      max="999999999"
                      step="0.01"
                    />
                    <Select value={fromCurrency} onValueChange={setFromCurrency}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((curr) => (
                          <SelectItem key={curr.code} value={curr.code}>
                            {curr.flag} {curr.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSwapCurrencies}
                    className="rounded-full w-10 h-10 p-0"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </Button>
                </div>

                {/* To Currency */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Você recebe</label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={convertedAmount}
                      readOnly
                      className="flex-1 text-lg bg-gray-50"
                      placeholder="0.00"
                    />
                    <Select value={toCurrency} onValueChange={setToCurrency}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((curr) => (
                          <SelectItem key={curr.code} value={curr.code}>
                            {curr.flag} {curr.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Exchange Rate Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-blue-700 font-medium">Taxa de câmbio:</span>
                    <span className="text-blue-900 font-semibold">
                      1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleConvert}
                  disabled={converting || loadingRate || !isValidAmount(amount)}
                  className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <ArrowRight className="w-4 h-4" />
                  {converting ? 'Processando...' : 'Converter Agora'}
                </Button>
              </CardContent>
            </Card>

            {/* Info Card */}
            <div className="space-y-4">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Por que escolher a CambioExpress?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Taxas Competitivas</p>
                      <p className="text-xs text-muted-foreground">Melhores taxas de câmbio do mercado</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Segurança Garantida</p>
                      <p className="text-xs text-muted-foreground">Todas as transações são criptografadas</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Processamento Rápido</p>
                      <p className="text-xs text-muted-foreground">Transferências em poucas horas</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Suporte 24/7</p>
                      <p className="text-xs text-muted-foreground">Equipe sempre disponível para ajudar</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-900">Próximas Etapas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-blue-900">
                  <div className="flex gap-2">
                    <span className="font-bold bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</span>
                    <p>Insira o valor e escolha as moedas</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</span>
                    <p>Informe os dados do recebedor</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">3</span>
                    <p>Verifique seu WhatsApp</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">4</span>
                    <p>Escolha o método de pagamento</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
