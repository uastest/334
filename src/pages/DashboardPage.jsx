import { useState, useEffect, useLayoutEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowRight, TrendingUp, LogOut, User, ArrowLeftRight, DollarSign, Clock, CheckCircle, BarChart3 } from 'lucide-react' // Adicionado Settings e BarChart3
import { getTranslation } from '../utils/translations'
import { useAuth } from '../hooks/use-auth'
import { db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'
import Footer from '../components/Footer'

// Lógica de Backend e Estado (MANTIDA INTACTA)
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

  // Redirecionar se não estiver autenticado (MANTIDA INTACTA)
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  // Correção de Scroll Local: Força o scroll para o topo na montagem do componente
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Validar entrada de valor (MANTIDA INTACTA)
  const isValidAmount = (val) => {
    const num = parseFloat(val)
    return !isNaN(num) && num > 0 && num <= 999999999
  }

  // Buscar taxa de câmbio (MANTIDA INTACTA)
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

  // Calcular valor convertido (MANTIDA INTACTA)
  useEffect(() => {
    const numAmount = parseFloat(amount) || 0
    if (numAmount > 0) {
      setConvertedAmount((numAmount * exchangeRate).toFixed(2))
    } else {
      setConvertedAmount(0)
    }
  }, [amount, exchangeRate])

  // Inverter moedas (MANTIDA INTACTA)
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  // Criar transação e ir para informações do recebedor (MANTIDA INTACTA)
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

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Clock className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
          <p className="text-gray-600">Carregando painel...</p>
        </div>
      </div>
    )
  }

  // --- INÍCIO DO REDESENHO DO JSX ---
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Mais profissional e com perfil destacado */}
      <header className="border-b border-gray-200 bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="bg-blue-600 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                CambioExpress
              </span>
            </Link>

            <div className="flex items-center gap-4">

              
              {/* Perfil do Usuário */}
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">{user?.email}</span>
              </div>
              
              {/* Botão de Sair */}
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 border-red-400 text-red-600 hover:bg-red-50">
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Bem-vindo, {user?.email.split('@')[0]}!</h1>
          <p className="text-lg text-gray-600">Seu painel de controle para conversões de moeda rápidas e seguras.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Coluna 1: Conversor de Moedas (Destaque) */}
          <div className="lg:col-span-2">
            <Card className="shadow-2xl border-t-4 border-blue-600">
              <CardHeader className="pb-4 bg-gray-50 border-b border-gray-200">
                <CardTitle className="text-2xl font-bold text-gray-900">Conversor de Moedas</CardTitle>
                <CardDescription className="text-gray-600">Inicie uma nova transação com a melhor taxa do dia.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                {error && (
                  <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg text-sm font-medium">
                    {error}
                  </div>
                )}

                {/* From Currency */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Você envia</label>
                  <div className="flex gap-3">
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value)
                        setError(null)
                      }}
                      className="flex-1 text-xl p-3 border-gray-300 focus:border-blue-500"
                      placeholder="1000"
                      min="0"
                      max="999999999"
                      step="0.01"
                    />
                    <Select value={fromCurrency} onValueChange={setFromCurrency}>
                      <SelectTrigger className="w-[160px] text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent position="popper" className="bg-white">
                        {currencies.map((curr) => (
                          <SelectItem key={curr.code} value={curr.code}>
                            {curr.flag} {curr.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Swap Button e Taxa */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleSwapCurrencies}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors border border-gray-300"
                    title="Inverter moedas"
                  >
                    <ArrowLeftRight className="w-5 h-5 text-blue-600" />
                  </button>
                  
                  {/* Exchange Rate Display - Mais proeminente */}
                  <div className="text-sm text-gray-600 font-medium">
                    Taxa: <span className="text-blue-600 font-bold">1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}</span>
                    <span className="ml-4 text-green-600 font-bold">Taxa de Serviço: 0.4%</span>
                  </div>
                </div>

                {/* To Currency - Destaque no Recebimento */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Você recebe</label>
                  <div className="flex gap-3">
                    <Input
                      type="text"
                      value={loadingRate ? 'Calculando...' : convertedAmount}
                      readOnly
                      className="flex-1 text-2xl p-3 font-extrabold bg-green-50 border-green-300 text-green-800"
                    />
                    <Select value={toCurrency} onValueChange={setToCurrency}>
                      <SelectTrigger className="w-[160px] text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent position="popper" className="bg-white">
                        {currencies.map((curr) => (
                          <SelectItem key={curr.code} value={curr.code}>
                            {curr.flag} {curr.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handleConvert}
                  disabled={converting || loadingRate || !isValidAmount(amount)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/50"
                  size="lg"
                >
                  {converting ? 'Processando Transação...' : 'Converter e Continuar'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Coluna 2: Informações e Status */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Card de Status/Estatísticas (Novo) */}
            <Card className="shadow-lg border-t-4 border-purple-600">
              <CardHeader>
                <BarChart3 className="w-6 h-6 text-purple-600 mb-2" />
                <CardTitle className="text-xl font-bold">Minhas Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Transações Concluídas:</span>
                  <span className="font-bold text-lg text-gray-900">12</span> {/* Dados simulados */}
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Total Enviado (USD):</span>
                  <span className="font-bold text-lg text-green-600">$ 15,450.00</span> {/* Dados simulados */}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Última Transação:</span>
                  <span className="font-medium text-sm text-gray-900">2 dias atrás</span> {/* Dados simulados */}
                </div>
              </CardContent>
            </Card>

            {/* Card de Próximas Etapas (Aprimorado) */}
            <Card className="shadow-lg border-t-4 border-green-600 bg-green-50">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-green-800">Próximas Etapas da Transação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-green-800">
                <div className="flex gap-3 items-start">
                  <span className="font-bold bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</span>
                  <p>Insira o valor e escolha as moedas</p>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="font-bold bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</span>
                  <p>Informe os dados do recebedor</p>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="font-bold bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">3</span>
                  <p>Verifique seu WhatsApp</p>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="font-bold bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">4</span>
                  <p>Escolha o método de pagamento</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Footer (Reutilizando o componente redesenhado) */}
      <Footer />
    </div>
  )
}
