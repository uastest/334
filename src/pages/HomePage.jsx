import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ArrowRight, TrendingUp, Zap, Shield, Globe, Users, 
  ArrowLeftRight, Lock, Smartphone, Wallet, Headphones, Award, Clock, DollarSign,
  ChevronDown
} from 'lucide-react'
import { getTranslation } from '../utils/translations'
import Footer from '../components/Footer'

const currencies = [
  { code: 'USD', name: 'Dólar Americano', symbol: '$' },
  { code: 'PYG', name: 'Guarani Paraguaio', symbol: '₲' },
  { code: 'BRL', name: 'Real Brasileiro', symbol: 'R$' },
  { code: 'ARS', name: 'Peso Argentino', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'Libra Esterlina', symbol: '£' },
]

const AnimatedNumber = ({ value, duration = 2000 }) => {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let start = 0
    const increment = value / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [value, duration])

  return <span>{displayValue.toLocaleString()}</span>
}

export default function HomePage({ language }) {
  const navigate = useNavigate()
  const t = (key) => getTranslation(language, key)

  const [amount, setAmount] = useState('1000')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('PYG')
  const [convertedAmount, setConvertedAmount] = useState(0)
  const [exchangeRate, setExchangeRate] = useState(7200)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [])

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
          'USD-ARS': 1050,
          'ARS-USD': 0.00095,
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
      {/* ============ HERO SECTION ============ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-gradient-to-tr from-green-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent)',
          backgroundSize: '50px 50px'
        }} />

        <div className="relative z-10 container mx-auto px-4 max-w-6xl py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500/20 to-green-500/20 backdrop-blur-xl border border-blue-400/30 rounded-full hover:border-blue-400/60 transition-all duration-300">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-bold text-blue-200">Câmbio Express - Especialista em Paraguai</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-7xl lg:text-8xl font-black leading-tight">
                  Compre<br />
                  <span className="bg-gradient-to-r from-blue-400 via-green-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                    Dólares
                  </span><br />
                  Para o Paraguai
                </h1>
              </div>

              <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                As melhores taxas para enviar dólares ao Paraguai. Rápido, seguro e com transparência total.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <Button 
                  onClick={() => navigate('/register')}
                  className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-bold py-6 px-8 rounded-lg shadow-2xl hover:shadow-3xl transition-all duration-300 text-base flex items-center justify-center gap-2 group"
                >
                  Começar Agora
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  onClick={() => navigate('/login')}
                  className="border-2 border-blue-400 text-blue-300 hover:bg-blue-500/10 font-bold py-6 px-8 rounded-lg backdrop-blur-sm transition-all duration-300 text-base"
                >
                  Já tenho conta
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-12 border-t border-blue-500/20">
                <div>
                  <p className="text-3xl font-black text-green-400"><AnimatedNumber value={5} />K+</p>
                  <p className="text-blue-300 text-sm">Usuários Ativos</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-green-400">$<AnimatedNumber value={150} />k+</p>
                  <p className="text-blue-300 text-sm">Transações</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-green-400"><AnimatedNumber value={12} />+</p>
                  <p className="text-blue-300 text-sm">Países</p>
                </div>
              </div>
            </div>

            <div className="relative h-96 lg:h-full hidden lg:flex items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center perspective">
                <div 
                  className="absolute w-80 h-48 bg-gradient-to-br from-blue-500/30 to-green-500/30 backdrop-blur-xl border border-blue-400/50 rounded-2xl p-6 shadow-2xl"
                  style={{ 
                    transform: `translateY(${scrollY * 0.1}px) rotateZ(-8deg)`,
                    transition: 'transform 0.3s ease-out'
                  }}
                >
                  <p className="text-blue-200 text-sm mb-3 font-semibold">Taxa Atual</p>
                  <p className="text-4xl font-black text-green-300">1 USD</p>
                  <p className="text-2xl font-bold text-blue-300 mt-2">= 7,200 PYG</p>
                </div>
                <div 
                  className="absolute w-80 h-48 bg-gradient-to-br from-green-500/30 to-blue-500/30 backdrop-blur-xl border border-green-400/50 rounded-2xl p-6 shadow-2xl top-32"
                  style={{ 
                    transform: `translateY(${-scrollY * 0.15}px) rotateZ(8deg)`,
                    transition: 'transform 0.3s ease-out'
                  }}
                >
                  <p className="text-green-200 text-sm mb-3 font-semibold">Você Receberá</p>
                  <p className="text-4xl font-black text-blue-300">₲ 7.2M</p>
                  <p className="text-sm text-green-300 mt-2">Em minutos!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CONVERTER SECTION - CRIPTO STYLE ============ */}
      <section className="container mx-auto px-4 max-w-3xl py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black mb-4 text-gray-900">Conversor de Moedas</h2>
          <p className="text-lg text-gray-600">Veja a taxa em tempo real e comece sua transação</p>
        </div>

        <Card className="shadow-2xl border-0 overflow-hidden bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 text-white p-8">
            <CardTitle className="text-3xl font-black">{t('converterTitle')}</CardTitle>
            <CardDescription className="text-blue-100 mt-2 text-base">Taxa atualizada em tempo real</CardDescription>
          </CardHeader>
          
          <CardContent className="p-8 space-y-8 bg-white">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-start gap-3">
                <span className="text-red-600 font-black text-xl">!</span>
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {/* Amount Input */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Você envia</label>
              <div className="relative">
                <Input 
                  value={amount} 
                  onChange={e => setAmount(e.target.value)}
                  type="number"
                  placeholder="0.00"
                  className="text-4xl py-6 border-2 border-gray-200 focus:border-blue-500 focus:ring-0 rounded-lg font-bold text-gray-900 placeholder-gray-400 bg-white pr-16"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">{fromCurrency}</span>
              </div>
            </div>

            {/* Currency Swap - CRIPTO STYLE */}
            <div className="space-y-4">
              {/* FROM */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">De</label>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="py-6 border-2 border-gray-200 focus:border-blue-500 focus:ring-0 rounded-lg font-semibold text-gray-900 text-base bg-white hover:border-gray-300 transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {currencies.map(curr => (
                      <SelectItem key={curr.code} value={curr.code} className="font-semibold py-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{curr.code}</span>
                          <span className="text-gray-500 text-sm">{curr.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* SWAP BUTTON */}
              <div className="flex justify-center -my-2">
                <button
                  onClick={handleSwapCurrencies}
                  className="p-3 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-full transition-all duration-300 transform hover:scale-110 shadow-md border-2 border-gray-300 hover:border-gray-400"
                >
                  <ArrowLeftRight className="w-5 h-5" />
                </button>
              </div>

              {/* TO */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Para</label>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger className="py-6 border-2 border-gray-200 focus:border-green-500 focus:ring-0 rounded-lg font-semibold text-gray-900 text-base bg-white hover:border-gray-300 transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {currencies.map(curr => (
                      <SelectItem key={curr.code} value={curr.code} className="font-semibold py-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{curr.code}</span>
                          <span className="text-gray-500 text-sm">{curr.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Resultado */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border-2 border-gray-200 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-600">Você receberá</span>
                <span className="text-xs font-bold text-gray-500">Taxa: 1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-gray-900">{convertedAmount}</span>
                <span className="text-2xl font-bold text-gray-600">{toCurrency}</span>
              </div>
            </div>

            {/* Convert Button */}
            <Button 
              onClick={handleConvert} 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-black py-7 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-base disabled:opacity-50 uppercase tracking-wider border-0"
            >
              {loading ? 'Processando...' : 'Iniciar Transação'}
              {!loading && <ArrowRight className="ml-3 w-5 h-5" />}
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* ============ FEATURES SECTION ============ */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black mb-6 text-gray-900">Por que Câmbio Express?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Especialista em câmbio para o Paraguai com as melhores taxas e atendimento premium</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Rapidez', desc: 'Transações internacionais entre países do bloco sul-americano costumam levar de 1 a 3 dias úteis. Nossa casa de câmbio, porém, realiza o processo normalmente no prazo MÍNIMO (1 DIA ÚTIL), utilizando depósitos diretos. O tempo final pode variar conforme o processamento do seu banco.', color: 'from-yellow-400 to-orange-500' },
              { icon: TrendingUp, title: 'Melhores Taxas', desc: 'Utilizamos a cotação do dólar do mercado atual, aplicando uma taxa de serviço de apenas 0,4%, entre as mais competitivas do mercado', color: 'from-green-400 to-emerald-500' },
              { icon: Shield, title: 'Segurança Total', desc: 'Estamos há 9 anos atuando no câmbio com sede no Paraguai e mais de 4 anos operando online. Utilizamos a Nox Pay como intermediadora de pagamento — uma das plataformas mais sólidas do mercado para operações fiduciárias vindas do Brasil — e contamos com a infraestrutura do Firebase (Google) para armazenamento dos dados, garantindo estabilidade e confiabilidade em todo o processo', color: 'from-blue-400 to-cyan-500' },
              { icon: Globe, title: 'Foco em Paraguai', desc: 'Somos especializados em câmbio para o Paraguai, um dos destinos favoritos dos brasileiros que vêm às compras em Pedro Juan Caballero. Nossa casa de câmbio é voltada principalmente para esse público, oferecendo dólar para quem deseja realizar suas compras no Paraguai com praticidade e confiança', color: 'from-purple-400 to-pink-500' },
              { icon: Smartphone, title: 'App Intuitivo', desc: 'Nossa plataforma foi desenvolvida para ser prática e intuitiva, permitindo que qualquer pessoa utilize o site com facilidade desde o primeiro acesso. A navegação é clara, rápida e organizada, garantindo uma experiência fluida em todas as etapas da transação ', color: 'from-indigo-400 to-blue-500' },
              { icon: Users, title: 'Suporte 24/7', desc: 'Nosso suporte permanece disponível 24 horas por dia, pronto para atender com agilidade e esclarecer qualquer dúvida. Você conta com uma equipe dedicada, sempre preparada para ajudar em cada etapa da sua transação ', color: 'from-red-400 to-pink-500' },
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div 
                  key={idx}
                  className="group bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300 hover:scale-105 cursor-pointer"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-black mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 font-semibold text-sm">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 py-24">
        <div className="container mx-auto px-4 max-w-4xl text-center text-white space-y-8">
          <h2 className="text-6xl font-black">Pronto para começar?</h2>
          <p className="text-2xl text-white/90 font-semibold">Abra sua conta em 2 minutos e comece a enviar dólares para o Paraguai hoje mesmo.</p>
          <Button 
            onClick={() => navigate('/register')}
            className="bg-white text-blue-600 hover:bg-gray-100 font-black py-7 px-12 rounded-lg shadow-2xl hover:shadow-3xl transition-all duration-300 text-lg inline-flex items-center gap-3 uppercase tracking-wider"
          >
            Criar Conta Gratuita
            <ArrowRight className="w-6 h-6" />
          </Button>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  )
}
