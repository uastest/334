import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Shield, Clock, DollarSign, CheckCircle, TrendingUp, Globe, Lock, Zap, Users, ArrowLeftRight, Star, Briefcase, BarChart3, Smile } from 'lucide-react'
import { getTranslation } from '../utils/translations'
import Footer from '../components/Footer'

/**
 * Design Philosophy: Premium Fintech Exchange
 * - Modern gradient backgrounds with subtle animations
 * - Clear information hierarchy with trust-building elements
 * - Professional color palette (blue, green, white)
 * - Responsive and accessible design
 */

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
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-green-600/5 pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full text-green-700 font-medium text-sm">
              <Star className="w-4 h-4" />
              Melhores Taxas do Mercado
            </span>
          </div>

          {/* Main Headline */}
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-700 to-green-600">
              Câmbio Internacional Descomplicado
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Taxas competitivas, processamento rápido e segurança garantida. Envie dinheiro para qualquer lugar do mundo com confiança.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-6 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-base"
            >
              Começar Agora
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              onClick={() => navigate('/login')}
              variant="outline"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-6 px-8 rounded-lg transition-all duration-300 text-base"
            >
              Já tenho conta
            </Button>
          </div>
        </div>
      </section>

      {/* Converter Card Section */}
      <section className="container mx-auto px-4 max-w-7xl mb-24">
        <Card className="shadow-2xl border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl">{t('converterTitle')}</CardTitle>
            <CardDescription className="text-blue-100">Taxa de câmbio atualizada em tempo real</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0 mt-0.5">!</div>
                <span>{error}</span>
              </div>
            )}

            {/* Amount Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Valor a Converter</label>
              <Input 
                value={amount} 
                onChange={e => setAmount(e.target.value)}
                type="number"
                placeholder="1000"
                className="text-lg py-6 border-2 border-gray-200 focus:border-blue-600 focus:ring-blue-600"
              />
            </div>

            {/* Currency Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* From Currency */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">De</label>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="py-6 border-2 border-gray-200 focus:border-blue-600">
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

              {/* Swap Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleSwapCurrencies}
                  className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-all duration-200 transform hover:scale-110"
                >
                  <ArrowLeftRight className="w-5 h-5" />
                </button>
              </div>

              {/* To Currency */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Para</label>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger className="py-6 border-2 border-gray-200 focus:border-blue-600">
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

            {/* Exchange Rate Display */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border border-blue-200">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Taxa de Câmbio</p>
                  <p className="text-2xl font-bold text-blue-600">{exchangeRate.toFixed(4)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Você Receberá</p>
                  <p className="text-2xl font-bold text-green-600">{convertedAmount}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}</p>
            </div>

            {/* Convert Button */}
            <Button 
              onClick={handleConvert} 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-base"
            >
              {loading ? 'Processando...' : 'Iniciar Transação'}
              {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 max-w-7xl mb-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Por que nos escolher?</h2>
          <p className="text-lg text-gray-600">Segurança, velocidade e transparência em cada transação</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <TrendingUp className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Melhores Taxas</h3>
            <p className="text-gray-600">Comparamos constantemente o mercado para oferecer as taxas mais competitivas do setor.</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100">
            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Processamento Rápido</h3>
            <p className="text-gray-600">Suas transações são processadas em minutos, não em dias. Velocidade garantida.</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <Shield className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">100% Seguro</h3>
            <p className="text-gray-600">Criptografia de ponta a ponta e conformidade regulatória garantem sua segurança.</p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100">
            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <Globe className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Cobertura Global</h3>
            <p className="text-gray-600">Enviamos para mais de 150 países com suporte a múltiplas moedas.</p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <Users className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Suporte 24/7</h3>
            <p className="text-gray-600">Nossa equipe está sempre disponível para ajudar com suas dúvidas.</p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100">
            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Transparência Total</h3>
            <p className="text-gray-600">Sem taxas ocultas. Você sabe exatamente quanto vai pagar e receber.</p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16 mb-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold mb-2">50K+</p>
              <p className="text-blue-100">Usuários Ativos</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">$2B+</p>
              <p className="text-blue-100">Transações Processadas</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">150+</p>
              <p className="text-blue-100">Países Cobertos</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">99.9%</p>
              <p className="text-blue-100">Uptime Garantido</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 max-w-7xl mb-24 text-center">
        <h2 className="text-4xl font-bold mb-6 text-gray-900">Pronto para começar?</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">Abra sua conta em minutos e comece a enviar dinheiro hoje mesmo com as melhores taxas do mercado.</p>
        <Button 
          onClick={() => navigate('/register')}
          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-6 px-10 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-base"
        >
          Criar Conta Gratuita
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </section>

      <Footer />
    </div>
  )
}
