import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, TrendingUp, Clock, AlertCircle, MessageSquare, Phone } from 'lucide-react'
import { getTranslation } from '../utils/translations'
import { useAuth } from '../hooks/use-auth'
import { db } from '../firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

// Códigos de verificação fornecidos pelo usuário
const VALID_CODES = [
  '126650', '117154', '116772', '120273', 
  '125019', '120967', '125619', '131811', 
  '132468', '120349'
];

export default function WhatsAppVerifyPage({ language }) {
  const navigate = useNavigate()
  const { transactionId } = useParams()
  const { user, loading: authLoading } = useAuth()
  const t = (key) => getTranslation(language, key)

  const [transaction, setTransaction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [verificationCode, setVerificationCode] = useState('')
  
  // Mapeamento dos códigos para os nomes das páginas de pagamento
  const getPaymentPageName = (code) => {
    const index = VALID_CODES.indexOf(code);
    if (index !== -1) {
      const pageNumber = 189 + index;
      // **CORREÇÃO APLICADA AQUI** - Gera o nome da página com 'P' maiúsculo.
      return `Pay-to-Pix-${String(pageNumber).padStart(4, '0')}`;
    }
    return null;
  }

  // Buscar transação
  useEffect(() => {
    const fetchTransaction = async () => {
      if (!transactionId || !user) {
        navigate('/dashboard')
        return
      }

      try {
        const docRef = doc(db, 'transactions', transactionId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data.userId !== user.uid) {
            navigate('/dashboard')
            return
          }
          setTransaction({ id: docSnap.id, ...data })
        } else {
          navigate('/dashboard')
        }
      } catch (err) {
        console.error('Erro ao buscar transação:', err)
        setError('Erro ao carregar transação. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      fetchTransaction()
    }
  }, [transactionId, user, authLoading, navigate])

  const handleVerifyCode = async (e) => {
    e.preventDefault()

    const code = verificationCode.trim()

    if (!code || code.length !== 6) {
      setError('Por favor, insira o código de verificação de 6 dígitos.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const paymentPageName = getPaymentPageName(code)

      if (!paymentPageName) {
        setError('Código de verificação inválido. Tente novamente.')
        setSubmitting(false)
        return
      }

      const docRef = doc(db, 'transactions', transactionId)
      
      await updateDoc(docRef, {
        paymentMethod: 'pix',
        verificationCode: code,
        paymentPageId: paymentPageName, // Salva o nome da página no DB
        status: 'pending_payment',
        verifiedAt: new Date().toISOString(),
      })

      // **CORREÇÃO PRINCIPAL APLICADA AQUI**
      // Redireciona para a URL exata que o roteador espera, sem parâmetros extras.
      // Exemplo: /Pay-to-Pix-0189/ID_DA_TRANSACAO
      navigate(`/${paymentPageName}/${transactionId}`)

    } catch (err) {
      console.error('Erro ao verificar código:', err)
      setError('Erro ao verificar código. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  // O resto do componente permanece igual...
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-4xl">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              CambioExpress
            </span>
          </Link>

          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-blue-600">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="max-w-lg mx-auto">
          
          <Card className="shadow-2xl border-t-4 border-blue-600">
            <CardHeader className="text-center pt-8 pb-4">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-3xl font-extrabold text-gray-900">
                Verificação de WhatsApp
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Insira o código de 6 dígitos enviado para o seu WhatsApp para prosseguir com o pagamento.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8 p-6 sm:p-8">
              
              <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Label className="text-lg font-medium text-blue-800">
                  Transação: <span className="font-bold">{transaction.amount} {transaction.fromCurrency} para {transaction.convertedAmount} {transaction.toCurrency}</span>
                </Label>
              </div>

              <div className="space-y-6">
                <p className="text-center text-sm text-green-600 font-medium">
                  Código enviado! Verifique seu WhatsApp.
                </p>
                
                <form onSubmit={handleVerifyCode} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="verificationCode" className="text-base font-semibold text-gray-700">
                      Digite o código de 6 dígitos
                    </Label>
                    <Input
                      id="verificationCode"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="text-center text-3xl tracking-[0.5em] font-mono h-14 border-2 focus:border-blue-500 transition"
                      maxLength={6}
                      placeholder="• • • • • •"
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive" className="border-l-4 border-red-500">
                      <AlertCircle className="w-4 h-4" />
                      <AlertDescription className="text-sm">{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    disabled={submitting || verificationCode.length !== 6}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-150"
                  >
                    {submitting ? 'Verificando...' : 'Confirmar Código e Ir para Pagamento'}
                  </Button>
                </form>
              </div>

            </CardContent>
          </Card>

        </div>
      </section>
    </div>
  )
}
