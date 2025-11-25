import { useState, useEffect } from 'react'
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Shield, Clock, DollarSign, CheckCircle, TrendingUp, Globe, Lock, Zap, Users } from 'lucide-react'
import { getTranslation } from '../utils/translations'

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

  useEffect(() => {
    // Simular busca de taxa de câmbio (em produção, usar API real)
    const fetchExchangeRate = async () => {
      setLoading(true)
      // Simulação de delay de API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Taxas simuladas (em produção, buscar de API)
      const rates = {
        'USD-BRL': 5.5,
        'EUR-BRL': 6.1,
        'GBP-BRL': 7.2,
        'BRL-USD': 0.18,
        'BRL-EUR': 0.16,
        'USD-PYG': 7200,
        'PYG-USD': 0.00014,
      }
      
      const rateKey = `${fromCurrency}-${toCurrency}`
      const rate = rates[rateKey] || 1
      
      // Aplicar taxa de 0.4%
      const rateWithFee = rate * 0.996
      setExchangeRate(rateWithFee)
      setLoading(false)
    }
    
    fetchExchangeRate()
  }, [fromCurrency, toCurrency])

  useEffect(() => {
    const numAmount = parseFloat(amount) || 0
    setConvertedAmount((numAmount * exchangeRate).toFixed(2))
  }, [amount, exchangeRate])

  const handleConvert = async () => {
    try {
      const transactionData = {
        amount: parseFloat(amount),
        fromCurrency,
        toCurrency,
        convertedAmount: parseFloat(convertedAmount),
        exchangeRate,
        status: 'pending_verification', // Novo status para indicar que precisa de verificação
        createdAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, "transactions"), transactionData);
      alert("Transação criada com sucesso! Redirecionando para o cadastro.");
      navigate(`/register?transactionId=${docRef.id}`); // Redireciona para o cadastro com o ID da transação
    } catch (e) {
      console.error("Erro ao criar transação: ", e);
      alert("Erro ao criar transação. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                CambioExpress
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium hover:text-blue-600 transition-colors">
                {t('home')}
              </Link>
              <Link to="/contact" className="text-sm font-medium hover:text-blue-600 transition-colors">
                {t('contact')}
              </Link>
              <Button variant="outline" size="sm">
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
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              {t('heroTitle')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={() => navigate('/register')} className="gap-2">
                {t('heroButton')}
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => document.getElementById('converter').scrollIntoView({ behavior: 'smooth' })}>
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
          <Card className="shadow-2xl border-2" id="converter">
            <CardHeader>
              <CardTitle className="text-2xl">{t('converterTitle')}</CardTitle>
              <CardDescription>
                Taxa de câmbio atualizada em tempo real
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* From Currency */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('youSend')}</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1 text-lg"
                    placeholder="1000"
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

              {/* Exchange Rate Display */}
              <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('exchangeRate')}</span>
                  <span className="font-medium">
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
                <label className="text-sm font-medium">{t('youReceive')}</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={loading ? t('loading') : convertedAmount}
                    readOnly
                    className="flex-1 text-lg font-bold bg-slate-50"
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
                className="w-full" 
                size="lg" 
                onClick={handleConvert}
                disabled={loading || !amount || parseFloat(amount) <= 0}
              >
                {t('convert')}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('featuresTitle')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Oferecemos o melhor serviço de câmbio com segurança, transparência e rapidez.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>{t('feature1Title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t('feature1Desc')}</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>{t('feature2Title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t('feature2Desc')}</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>{t('feature3Title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t('feature3Desc')}</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>{t('feature4Title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t('feature4Desc')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('howItWorksTitle')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Processo simples e rápido em 4 passos
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="relative">
                <div className="text-center space-y-4">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                    {step}
                  </div>
                  <h3 className="text-xl font-bold">{t(`step${step}Title`)}</h3>
                  <p className="text-muted-foreground">{t(`step${step}Desc`)}</p>
                </div>
                {step < 4 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-600 to-transparent"></div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" onClick={() => navigate('/register')}>
              Começar Agora
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">CambioExpress</span>
              </div>
              <p className="text-slate-400 text-sm">
                {t('footerAboutText')}
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4">{t('footerQuickLinks')}</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-slate-400 hover:text-white transition-colors">{t('home')}</Link></li>
                <li><Link to="/contact" className="text-slate-400 hover:text-white transition-colors">{t('contact')}</Link></li>
                <li><Link to="/register" className="text-slate-400 hover:text-white transition-colors">{t('register')}</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/terms" className="text-slate-400 hover:text-white transition-colors">{t('footerTerms')}</Link></li>
                <li><Link to="/privacy" className="text-slate-400 hover:text-white transition-colors">{t('footerPrivacy')}</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">{t('footerContact')}</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>📍 Ciudad del Este, Paraguay</li>
                <li>📧 contato@cambioexpress.com</li>
                <li>📱 +595 61 123 4567</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>© 2025 CambioExpress. {t('footerRights')}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

