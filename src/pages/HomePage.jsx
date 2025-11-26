
HomePage.jsx
import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Shield, Clock, DollarSign, CheckCircle, TrendingUp, Globe, Lock, Zap, Users, ArrowLeftRight, Star } from 'lucide-react' // Adicionado Star
import { getTranslation } from '../utils/translations'
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

export default function HomePage({ language }) {
  const navigate = useNavigate()
  const t = (key) => getTranslation(language, key)

  const [amount, setAmount] = useState('1000')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('BRL')
  const [convertedAmount, setConvertedAmount] = useState(0)
  const [exchangeRate, setExchangeRate] = useState(5.5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Validar entrada de valor (MANTIDA INTACTA)
  const isValidAmount = (val) => {
    const num = parseFloat(val)
    return !isNaN(num) && num > 0 && num <= 999999999
  }

  // Buscar taxa de câmbio (MANTIDA INTACTA)
  useEffect(() => {
    const fetchExchangeRate = async () => {
      setLoading(true)
      setError(null)
      try {
        // Simulação de delay de API
        await new Promise(resolve => setTimeout(resolve, 500))

        // Taxas simuladas (em produção, buscar de API real)
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

        // Aplicar taxa de 0.4%
        const rateWithFee = rate * 0.996
        setExchangeRate(rateWithFee)
      } catch (err) {
        console.error('Erro ao buscar taxa de câmbio:', err)
        setError('Erro ao buscar taxa de câmbio. Tente novamente.')
      } finally {
        setLoading(false)
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

  // Criar transação e ir para cadastro (MANTIDA INTACTA)
  const handleConvert = async () => {
    if (!isValidAmount(amount)) {
      setError('Por favor, insira um valor válido entre 1 e 999.999.999')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const transactionData = {
        amount: parseFloat(amount),
        fromCurrency,
        toCurrency,
        convertedAmount: parseFloat(convertedAmount),
        exchangeRate,
        status: 'pending_verification',
        createdAt: new Date().toISOString(),
      }

      const docRef = await addDoc(collection(db, 'transactions'), transactionData)
      // Redirecionar para cadastro com ID da transação
      navigate(`/register?transactionId=${docRef.id}`)
    } catch (err) {
      console.error('Erro ao criar transação:', err)
      setError('Erro ao criar transação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  // --- INÍCIO DO REDESENHO DO JSX ---
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="bg-blue-600 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                CambioExpress
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-4">
              <Link to="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                {t('home')}
              </Link>
              <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                {t('contact')}
              </Link>
              <Button variant="outline" size="sm" onClick={() => navigate('/login')} className="text-blue-600 border-blue-600 hover:bg-blue-50">
                {t('login')}
              </Button>
              <Button size="sm" onClick={() => navigate('/register')} className="bg-blue-600 hover:bg-blue-700">
                {t('register')}
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - Foco na Conversão e Destaque */}
      <section className="container mx-auto px-4 py-16 md:py-24 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Texto e Chamada */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-block">
              <span className="bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-2">
                <Star className="w-4 h-4 fill-green-500 text-green-500" />
                Melhores Taxas do Mercado
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900">
              {t('heroTitle')}
            </h1>

            <p className="text-xl text-gray-600">
              {t('heroSubtitle')}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/50 transition transform hover:scale-[1.02]"
              >
                {t('heroButton')}
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById('converter')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                {t('convert')}
              </Button>
            </div>

            {/* Trust Indicators - Mais visíveis */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-gray-200 mt-8">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" />
                <span className="text-base font-medium text-gray-700">100% Seguro</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span className="text-base font-medium text-gray-700">Regulamentado</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-purple-600" />
                <span className="text-base font-medium text-gray-700">+10.000 Clientes</span>
              </div>
            </div>
          </div>

          {/* Currency Converter Card - Destaque Visual */}
          <div className="lg:col-span-6">
            <Card className="shadow-2xl border-t-4 border-blue-600" id="converter">
              <CardHeader className="pb-4 bg-gray-50 border-b border-gray-200">
                <CardTitle className="text-2xl text-gray-900">{t('converterTitle')}</CardTitle>
                <CardDescription className="text-gray-600">Taxa de câmbio atualizada em tempo real</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg text-sm font-medium">
                    {error}
                  </div>
                )}

                {/* From Currency */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">{t('youSend')}</label>
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
                      <SelectContent>
                        {currencies.map((curr) => (
                          <SelectItem key={curr.code} value={curr.code}>
                            {curr.flag} {curr.code} - {curr.name}
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
                  <label className="text-sm font-semibold text-gray-700">{t('youReceive')}</label>
                  <div className="flex gap-3">
                    <Input
                      type="text"
                      value={loading ? t('loading') : convertedAmount}
                      readOnly
                      className="flex-1 text-2xl p-3 font-extrabold bg-blue-50 border-blue-300 text-blue-800"
                    />
                    <Select value={toCurrency} onValueChange={setToCurrency}>
                      <SelectTrigger className="w-[160px] text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((curr) => (
                          <SelectItem key={curr.code} value={curr.code}>
                            {curr.flag} {curr.code} - {curr.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold shadow-md shadow-green-500/50"
                  size="lg"
                  onClick={handleConvert}
                  disabled={loading || !isValidAmount(amount)}
                >
                  {loading ? 'Processando...' : 'Iniciar Transação'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section - Mais clean */}
      <section className="bg-white py-16 md:py-24 border-t border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4 text-gray-900">
              Por Que Escolher a CambioExpress?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Oferecemos o melhor serviço de câmbio com segurança, transparência e rapidez.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <Card className="shadow-lg border-t-4 border-blue-600 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <DollarSign className="w-7 h-7 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">{t('feature1Title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base text-gray-600">
                  {t('feature1Description')}
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="shadow-lg border-t-4 border-green-600 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="bg-green-50 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Zap className="w-7 h-7 text-green-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">{t('feature2Title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base text-gray-600">
                  {t('feature2Description')}
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="shadow-lg border-t-4 border-purple-600 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="bg-purple-50 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Lock className="w-7 h-7 text-purple-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">{t('feature3Title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base text-gray-600">
                  {t('feature3Description')}
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="shadow-lg border-t-4 border-orange-600 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="bg-orange-50 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Globe className="w-7 h-7 text-orange-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">{t('feature4Title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base text-gray-600">
                  {t('feature4Description')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section - Mais impactante */}
      <section className="container mx-auto px-4 py-16 md:py-24 max-w-7xl">
        <Card className="bg-gradient-to-r from-blue-700 to-blue-900 border-0 text-white shadow-2xl">
          <CardContent className="py-16 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Comece a Trocar Moedas Agora
            </h2>
            <p className="text-blue-200 mb-10 text-xl max-w-3xl mx-auto">
              Processo simples, rápido e seguro. Cadastre-se em minutos e comece a usar nosso serviço.
            </p>
            <Button
              size="xl" // Usando uma classe maior para o botão
              variant="secondary"
              onClick={() => navigate('/register')}
              className="gap-2 bg-white text-blue-700 hover:bg-gray-100 font-bold text-lg px-8 py-4 shadow-xl transition transform hover:scale-[1.05]"
            >
              Começar Agora
              <ArrowRight className="w-5 h-5" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
