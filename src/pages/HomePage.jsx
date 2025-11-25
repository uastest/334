import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Shield, Clock, DollarSign, CheckCircle, TrendingUp, Globe, Lock, Zap, Users, ArrowLeftRight } from 'lucide-react'
import { getTranslation } from '../utils/translations'
import Footer from '../components/Footer'

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

  // Validar entrada de valor
  const isValidAmount = (val) => {
    const num = parseFloat(val)
    return !isNaN(num) && num > 0 && num <= 999999999
  }

  // Buscar taxa de câmbio
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

  // Criar transação e ir para cadastro
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

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium hover:text-blue-600 transition-colors">
                {t('home')}
              </Link>
              <Link to="/contact" className="text-sm font-medium hover:text-blue-600 transition-colors">
                {t('contact')}
              </Link>
              <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                {t('login')}
              </Button>
              <Button size="sm" onClick={() => navigate('/register')}>
                {t('register')}
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block">
              <span className="bg-blue-100 text-blue-700 text-sm font-medium px-4 py-2 rounded-full">
                🇵🇾 Sede no Paraguai
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-foreground">
              {t('heroTitle')}
            </h1>

            <p className="text-lg text-muted-foreground">
              {t('heroSubtitle')}
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="gap-2 bg-blue-600 hover:bg-blue-700"
              >
                {t('heroButton')}
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById('converter')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('convert')}
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 pt-6 border-t">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">100% Seguro</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">Verificado</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">+10.000 Clientes</span>
              </div>
            </div>
          </div>

          {/* Currency Converter Card */}
          <Card className="shadow-2xl border-0" id="converter">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">{t('converterTitle')}</CardTitle>
              <CardDescription>Taxa de câmbio atualizada em tempo real</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* From Currency */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t('youSend')}</label>
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
                <button
                  onClick={handleSwapCurrencies}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Inverter moedas"
                >
                  <ArrowLeftRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Exchange Rate Display */}
              <div className="bg-blue-50 p-4 rounded-lg space-y-2 border border-blue-100">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('exchangeRate')}</span>
                  <span className="font-medium text-foreground">
                    1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('fee')}</span>
                  <span className="font-medium text-green-600">0.4%</span>
                </div>
              </div>

              {/* To Currency */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t('youReceive')}</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={loading ? t('loading') : convertedAmount}
                    readOnly
                    className="flex-1 text-lg font-bold bg-slate-50 text-foreground"
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

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
                onClick={handleConvert}
                disabled={loading || !isValidAmount(amount)}
              >
                {loading ? 'Processando...' : t('convert')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {t('featuresTitle')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Oferecemos o melhor serviço de câmbio com segurança, transparência e rapidez.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <Card className="border-0 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{t('feature1Title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('feature1Description')}
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-0 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">{t('feature2Title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('feature2Description')}
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-0 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">{t('feature3Title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('feature3Description')}
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="border-0 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">{t('feature4Title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('feature4Description')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <Card className="bg-gradient-to-r from-blue-600 to-blue-800 border-0 text-white">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comece a Trocar Moedas Agora
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Processo simples, rápido e seguro. Cadastre-se em minutos e comece a usar nosso serviço.
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/register')}
              className="gap-2"
            >
              Começar Agora
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
