import { useState, useEffect } from 'react'
import { db } from '../firebase';
import { collection, doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, TrendingUp, Clock, CheckCircle, CreditCard, Building2, Copy, ExternalLink } from 'lucide-react'
import { getTranslation } from '../utils/translations'

export default function PaymentPage({ language }) {
  const navigate = useNavigate()
  const { transactionId } = useParams()
  const t = (key) => getTranslation(language, key)
  
  const [transaction, setTransaction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paymentLink, setPaymentLink] = useState(null)
  const [paymentInfo, setPaymentInfo] = useState(null)
  const [copied, setCopied] = useState(false)
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!transactionId) {
        navigate("/register");
        return;
      }

      const docRef = doc(db, "transactions", transactionId);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTransaction({ id: docSnap.id, ...data });
          if (data.paymentLink) {
            setPaymentLink(data.paymentLink);
            setLoading(false);
          }
          if (data.paymentInfo) {
            setPaymentInfo(data.paymentInfo);
            setLoading(false);
          }
          if (data.status === 'payment_confirmed') {
            setPaymentConfirmed(true);
          }
        } else {
          console.log("Nenhuma transação encontrada!");
          navigate("/register");
        }
        setLoading(false);
      }, (error) => {
        console.error("Erro ao buscar transação: ", error);
        setLoading(false);
        navigate("/register");
      });

      return () => unsubscribe();
    };

    fetchTransaction();
  }, [transactionId, navigate]);

  const handleCopyPixCode = () => {
    if (paymentInfo?.pixCode) {
      navigator.clipboard.writeText(paymentInfo.pixCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleConfirmPayment = async () => {
    if (!transactionId) return;

    try {
      const docRef = doc(db, "transactions", transactionId);
      await updateDoc(docRef, {
        status: "payment_confirmed",
        paymentConfirmedAt: new Date().toISOString(),
      });
      setPaymentConfirmed(true);
      // A navegação será tratada pelo onSnapshot quando o status for atualizado
    } catch (error) {
      console.error("Erro ao confirmar pagamento no Firebase: ", error);
      alert("Erro ao confirmar pagamento. Tente novamente.");
    }
  }

  if (!transaction) {
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
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                CambioExpress
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Payment Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Pagamento
            </h1>
            <p className="text-muted-foreground">
              Transação #{transactionId.slice(0, 8)}
            </p>
          </div>

          {/* Transaction Summary */}
          <Card className="shadow-lg mb-6">
            <CardHeader>
              <CardTitle>Resumo da Transação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Você envia:</span>
                  <span className="font-semibold">
                    {transaction.amount} {transaction.fromCurrency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Você recebe:</span>
                  <span className="font-semibold">
                    {transaction.convertedAmount} {transaction.toCurrency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxa de câmbio:</span>
                  <span className="font-semibold">
                    1 {transaction.fromCurrency} = {transaction.exchangeRate?.toFixed(4)} {transaction.toCurrency}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="text-muted-foreground">Taxa (0.4%):</span>
                  <span className="font-semibold text-green-600">
                    Incluída
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Instructions */}
          {loading ? (
            <Card className="shadow-lg">
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <Clock className="w-16 h-16 mx-auto text-blue-600 animate-spin" />
                  <h3 className="text-xl font-semibold">
                    Aguardando aprovação...
                  </h3>
                  <p className="text-muted-foreground">
                    Nossa equipe está processando sua solicitação.
                    <br />
                    Em breve você receberá as instruções de pagamento.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    <span>Isso pode levar alguns minutos...</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : paymentConfirmed ? (
            <Card className="shadow-lg border-green-200 bg-green-50">
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
                  <h3 className="text-xl font-semibold text-green-800">
                    Pagamento Confirmado!
                  </h3>
                  <p className="text-green-700">
                    Redirecionando...
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : paymentLink ? (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  Link de Pagamento
                </CardTitle>
                <CardDescription>
                  Clique no botão abaixo para realizar o pagamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription className="text-blue-800">
                    Você será redirecionado para a página de pagamento segura.
                  </AlertDescription>
                </Alert>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => window.open(paymentLink, '_blank')}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Ir para Pagamento
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={handleConfirmPayment}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Já realizei o pagamento
                </Button>
              </CardContent>
            </Card>
          ) : paymentInfo ? (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {paymentInfo.type === 'pix' ? (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Pagamento via PIX
                    </>
                  ) : (
                    <>
                      <Building2 className="w-5 h-5" />
                      Transferência Bancária
                    </>
                  )}
                </CardTitle>
                <CardDescription>
                  Siga as instruções abaixo para completar o pagamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentInfo.type === 'pix' ? (
                  <>
                    <Alert className="bg-blue-50 border-blue-200">
                      <AlertDescription className="text-blue-800">
                        Use o código PIX abaixo para realizar o pagamento
                      </AlertDescription>
                    </Alert>

                    <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                      <Label className="text-sm font-medium">Código PIX:</Label>
                      <div className="flex gap-2">
                        <Input
                          value={paymentInfo.pixCode || '00020126580014br.gov.bcb.pix...'}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleCopyPixCode}
                        >
                          {copied ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {paymentInfo.qrCode && (
                      <div className="text-center">
                        <img
                          src={paymentInfo.qrCode}
                          alt="QR Code PIX"
                          className="mx-auto w-64 h-64 border rounded-lg"
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                          Escaneie o QR Code com seu app bancário
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Banco:</Label>
                      <p className="font-semibold">{paymentInfo.bankName || 'Banco Exemplo'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Agência:</Label>
                      <p className="font-semibold">{paymentInfo.agency || '0001'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Conta:</Label>
                      <p className="font-semibold">{paymentInfo.account || '12345-6'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Titular:</Label>
                      <p className="font-semibold">{paymentInfo.accountHolder || 'CambioExpress LTDA'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">CNPJ:</Label>
                      <p className="font-semibold">{paymentInfo.cnpj || '00.000.000/0001-00'}</p>
                    </div>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={handleConfirmPayment}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirmar Pagamento Realizado
                </Button>

                <Alert>
                  <AlertDescription className="text-sm">
                    Após realizar o pagamento, clique no botão acima para confirmar.
                    Nossa equipe verificará o recebimento e liberará sua transação.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg border-yellow-200 bg-yellow-50">
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <Clock className="w-16 h-16 mx-auto text-yellow-600" />
                  <h3 className="text-xl font-semibold text-yellow-800">
                    Tempo de espera excedido
                  </h3>
                  <p className="text-yellow-700">
                    Entre em contato com nossa equipe para obter as instruções de pagamento.
                  </p>
                  <Button onClick={() => navigate('/contact')}>
                    Falar com Suporte
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}

