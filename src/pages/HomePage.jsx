import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Shield, Clock, DollarSign, CheckCircle, TrendingUp, Globe, Lock, Zap, Users, ArrowLeftRight, Star } from 'lucide-react'
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
    <div className="min-h-screen bg-gray-50">
      <section className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="inline-block mb-6">
          <span className="badge-green">
            <Star className="w-4 h-4 text-green-600" />
            Melhores Taxas do Mercado
          </span>
        </div>

        <h1 className="text-5xl font-bold mb-4">{t('heroTitle')}</h1>
        <p className="text-xl text-gray-600 mb-8">{t('heroSubtitle')}</p>

        <Card className="shadow-xl border-t-4 border-blue-600">
          <CardHeader>
            <CardTitle>{t('converterTitle')}</CardTitle>
            <CardDescription>Taxa de câmbio atualizada</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

            <div className="flex gap-3">
              <Input value={amount} onChange={e => setAmount(e.target.value)} />
            </div>

            <Button onClick={handleConvert} disabled={loading}>
              {loading ? 'Processando...' : 'Iniciar Transação'}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  )
}
