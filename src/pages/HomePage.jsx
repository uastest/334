import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, TrendingUp, Zap, Shield, Globe, Users, CheckCircle, Star, ArrowLeftRight, Gauge, Lock, Smartphone } from 'lucide-react'
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
  const [scrollY, setScrollY] = useState(0)

  // 🔧 FIX: Scroll reset ao montar o componente
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // 🎨 Parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const fetchExchangeRate = async () => {
      setLoading(true)
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
        setExchangeRate(rate * 0.996)
      } catch (err) {
        setError('Erro ao buscar taxa de câmbio.')
      } finally {
        setLoading(false)
      }
    }

    fetchExchangeRate()
  }, [fromCurrency, toCurrency])

  useEffect(() => {
    const numAmount = parseFloat(amount) || 0
    if (numAmount > 0) {
      setConvertedAmount((numAmount * exchangeRate).toFixed(2))
    } else {
      setConvertedAmount(0)
    }
  }, [amount, exchangeRate])

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const handleConvert = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setError('Valor inválido')
      return
    }

    setLoading(true)
    try {
      await addDoc(collection(db, 'transactions'), {
        amount,
        fromCurrency,
        toCurrency,
        convertedAmount,
        exchangeRate,
        status: 'pending'
      })

      navigate('/register')
    } catch {
      setError('Erro ao criar transação.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* 🎨 HERO SECTION - Premium & Inovador */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-green-500">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" style={{ transform: `translateY(${scrollY * 0.5}px)` }} />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" style={{ transform: `translateY(${-scrollY * 0.3}px)` }} />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 max-w-6xl py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text */}
            <div className="text-white space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full">
                <Star className="w-4 h-4" />
                <span className="text-sm font-semibold">Líder em Câmbio Internacional</span>
              </div>

              <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                Seu Dinheiro, <span className="text-green-200">Sem Fronteiras</span>
              </h1>

              <p className="text-xl text-white/90 leading-relaxed max-w-lg">
                Envie dinheiro para qualquer lugar do mundo em minutos. Taxas justas, conversão instantânea e segurança garantida.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  onClick={() => navigate('/register')}
                  className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-6 px-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 text-base flex items-center justify-center gap-2"
                >
                  Começar Agora
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button 
                  onClick={() => navigate('/login')}
                  className="border-2 border-white text-white hover:bg-white/10 font-bold py-6 px-8 rounded-lg backdrop-blur-sm transition-all duration-300 text-base"
                >
                  Já tenho conta
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/20">
                <div>
                  <p className="text-2xl font-bold">50K+</p>
                  <p className="text-white/70 text-sm">Usuários Ativos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">$2B+</p>
                  <p className="text-white/70 text-sm">Transações</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">150+</p>
                  <p className="text-white/70 text-sm">Países</p>
                </div>
              </div>
            </div>

            {/* Right Side - Visual */}
            <div className="relative h-96 lg:h-full hidden lg:flex items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Animated Cards */}
                <div className="absolute w-72 h-40 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl" style={{ transform: `translateY(${scrollY * 0.2}px) rotate(-5deg)` }}>
                  <p className="text-white/70 text-sm mb-2">Taxa Atual</p>
                  <p className="text-3xl font-bold text-green-200">1 USD = 5.50 BRL</p>
                </div>
                <div className="absolute w-72 h-40 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl top-32" style={{ transform: `translateY(${-scrollY * 0.15}px) rotate(5deg)` }}>
                  <p className="text-white/70 text-sm mb-2">Você Receberá</p>
                  <p className="text-3xl font-bold text-blue-200">R$ 5,500.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 💱 CONVERTER SECTION - Interactive */}
      <section className="container mx-auto px-4 max-w-6xl py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Conversor em Tempo Real</h2>
          <p className="text-lg text-gray-600">Veja exatamente quanto você vai receber antes de confirmar</p>
        </div>

        <Card className="shadow-2xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-green-500 text-white p-8">
            <CardTitle className="text-2xl">{t('converterTitle')}</CardTitle>
            <CardDescription className="text-blue-100 mt-2">Taxa de câmbio atualizada em tempo real</CardDescription>
          </CardHeader>
          
          <CardContent className="p-8 space-y-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded flex items-start gap-3">
                <div className="text-red-500 font-bold">!</div>
                <span>{error}</span>
              </div>
            )}

            {/* Amount Input */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-700">Valor a Converter</label>
              <Input 
                value={amount} 
                onChange={e => setAmount(e.target.value)}
                type="number"
                placeholder="1000"
                className="text-2xl py-6 border-2 border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 rounded-lg font-bold"
              />
            </div>

            {/* Currency Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700">De</label>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="py-6 border-2 border-gray-300 focus:border-blue-600 rounded-lg font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(curr => (
                      <SelectItem key={curr.code} value={curr.code}>
                        {curr.flag} {curr.code} - {curr.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleSwapCurrencies}
                  className="p-4 bg-gradient-to-br from-blue-100 to-green-100 hover:from-blue-200 hover:to-green-200 text-blue-600 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
                >
                  <ArrowLeftRight className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700">Para</label>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger className="py-6 border-2 border-gray-300 focus:border-blue-600 rounded-lg font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(curr => (
                      <SelectItem key={curr.code} value={curr.code}>
                        {curr.flag} {curr.code} - {curr.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Exchange Rate Display - Premium */}
            <div className="bg-gradient-to-br from-blue-50 via-green-50 to-blue-50 p-8 rounded-xl border-2 border-blue-200 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2 font-semibold">Taxa de Câmbio</p>
                  <p className="text-3xl font-bold text-blue-600">{exchangeRate.toFixed(4)}</p>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <Gauge className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Conversão</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2 font-semibold">Você Receberá</p>
                  <p className="text-3xl font-bold text-green-600">{convertedAmount}</p>
                </div>
              </div>
              <p className="text-center text-xs text-gray-500 border-t pt-4">1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}</p>
            </div>

            {/* Convert Button - CTA */}
            <Button 
              onClick={handleConvert} 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-bold py-7 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 text-lg disabled:opacity-50"
            >
              {loading ? 'Processando...' : 'Iniciar Transação'}
              {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* ✨ FEATURES SECTION - Inovador */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 text-gray-900">Por que somos diferentes?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Tecnologia de ponta + atendimento humano = a melhor experiência de câmbio</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-200 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Melhores Taxas</h3>
              <p className="text-gray-600">Algoritmo inteligente que compara o mercado em tempo real para oferecer as melhores taxas.</p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-200 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Instantâneo</h3>
              <p className="text-gray-600">Processamento em minutos, não em dias. Seu dinheiro chega rápido e seguro.</p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-200 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Segurança Total</h3>
              <p className="text-gray-600">Criptografia de ponta a ponta e conformidade com regulamentações internacionais.</p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-200 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Cobertura Global</h3>
              <p className="text-gray-600">Mais de 150 países e múltiplas moedas. Envie para qualquer lugar.</p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-200 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Smartphone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">App Intuitivo</h3>
              <p className="text-gray-600">Interface simples e poderosa. Qualquer pessoa consegue usar em segundos.</p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-200 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Suporte 24/7</h3>
              <p className="text-gray-600">Equipe dedicada sempre pronta para ajudar com qualquer dúvida ou problema.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🎯 FINAL CTA SECTION */}
      <section className="bg-gradient-to-r from-blue-600 to-green-500 py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center text-white space-y-8">
          <h2 className="text-5xl font-bold">Pronto para começar?</h2>
          <p className="text-xl text-white/90">Abra sua conta em 2 minutos e comece a enviar dinheiro hoje mesmo.</p>
          <Button 
            onClick={() => navigate('/register')}
            className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-6 px-10 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 text-lg inline-flex items-center gap-2"
          >
            Criar Conta Gratuita
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
