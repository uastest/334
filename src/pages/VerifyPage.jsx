import { useState, useEffect } from 'react'
import { db } from '../firebase';
import { doc, getDoc, updateDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const VALID_CODES = ['126650', '117154', '116772', '120273', '125019', '120967', '125619', '131811', '132468', '120349']; // Códigos gerados aleatoriamente
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, TrendingUp, MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { getTranslation } from '../utils/translations'

export default function VerifyPage({ language }) {
  const navigate = useNavigate()
  const { userId } = useParams()
  const t = (key) => getTranslation(language, key)
  
  const [user, setUser] = useState(null)
  const [transactionId, setTransactionId] = useState(null); // Para verificação de ordem de compra
  const [token, setToken] = useState('')
  const [generatedToken, setGeneratedToken] = useState('')
  const [tokenSent, setTokenSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const maxAttempts = 5

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        navigate('/register');
        return;
      }
      const userDocRef = doc(db, 'leads', userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        setUser({ id: userDocSnap.id, ...userDocSnap.data() });
        // Verificar se é uma verificação de ordem de compra
        const q = query(collection(db, 'transactions'), where('userId', '==', userId), where('status', '==', 'pending_verification'));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setTransactionId(querySnapshot.docs[0].id);
        }
      } else {
        navigate('/register');
      }
    };
    fetchUser();
  }, [userId, navigate]);

  const sendToken = async () => {
    setLoading(true);
    setError('');

    // Gerar token de 6 dígitos da lista de códigos válidos
    const newToken = VALID_CODES[Math.floor(Math.random() * VALID_CODES.length)];
    setGeneratedToken(newToken);

    // Simular envio via WhatsApp (em produção, usar API do WhatsApp/Twilio)
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      await addDoc(collection(db, 'otps'), {
        userId,
        token: newToken, // Em produção, salvar apenas o hash
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutos
        attempts: 0,
        used: false,
        type: transactionId ? 'transaction' : 'registration',
        relatedId: transactionId || userId,
      });
      setTokenSent(true);
      console.log(`Token enviado para ${user?.phone}: ${newToken}`);
    } catch (e) {
      console.error("Erro ao enviar token: ", e);
      setError("Erro ao enviar token. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const verifyToken = async () => {
    setLoading(true);
    setError('');

    if (attempts >= maxAttempts) {
      setError('Número máximo de tentativas excedido. Por favor, solicite um novo token.');
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, 'otps'), where('relatedId', '==', transactionId || userId), where('used', '==', false));
      const querySnapshot = await getDocs(q);
      let validOtp = null;
      querySnapshot.forEach((doc) => {
        const otpData = doc.data();
        if (new Date(otpData.expiresAt) > new Date()) {
          validOtp = { id: doc.id, ...otpData };
        }
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!validOtp) {
        setError('Token expirado ou não encontrado. Por favor, solicite um novo token.');
        setLoading(false);
        return;
      }

      if (token !== validOtp.token) {
        setAttempts(prev => prev + 1);
        setError(`Token inválido. Tentativa ${attempts + 1} de ${maxAttempts}`);
        setLoading(false);
        return;
      }

      // Marcar OTP como usado
      const otpDocRef = doc(db, 'otps', validOtp.id);
      await updateDoc(otpDocRef, { used: true });

      if (transactionId) {
        // Verificação de ordem de compra
        const transactionDocRef = doc(db, 'transactions', transactionId);
        await updateDoc(transactionDocRef, {
          status: 'verified',
          verifiedAt: new Date().toISOString(),
        });
        // Redirecionar para a página de pagamento conforme o código
        // Redirecionar para a página de pagamento conforme o código verificado
        navigate(`/payment/${token}.html`);
      } else {
        // Verificação de cadastro
        const userDocRef = doc(db, 'leads', userId);
        await updateDoc(userDocRef, {
          status: 'verified',
          verifiedAt: new Date().toISOString(),
        });
        navigate('/cadastro-pendente'); // Página de cadastro pendente após verificação
      }
    } catch (e) {
      console.error("Erro ao verificar token: ", e);
      setError("Erro ao verificar token. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
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
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </header>

      {/* Verification Form */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Verificação via WhatsApp
            </h1>
            <p className="text-muted-foreground">
              Enviaremos um código de verificação para o número cadastrado
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Confirme seu número</CardTitle>
              <CardDescription>
                Número cadastrado: <span className="font-medium text-foreground">{user.phone}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!tokenSent ? (
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    Clique no botão abaixo para receber o código de verificação via WhatsApp
                  </p>
                  <Button
                    onClick={sendToken}
                    disabled={loading}
                    size="lg"
                    className="w-full"
                  >
                    {loading ? (
                      'Enviando...'
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Enviar Código via WhatsApp
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Código enviado com sucesso! Verifique seu WhatsApp.
                      <br />
                      <span className="text-xs text-green-600">
                        (Para demonstração: {generatedToken})
                      </span>
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="token">Digite o código de 6 dígitos</Label>
                    <Input
                      id="token"
                      type="text"
                      value={token}
                      onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      maxLength={6}
                      className="text-center text-2xl tracking-widest"
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="w-4 h-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    onClick={verifyToken}
                    disabled={loading || token.length !== 6 || attempts >= maxAttempts}
                    size="lg"
                    className="w-full"
                  >
                    {loading ? 'Verificando...' : 'Verificar Código'}
                  </Button>

                  <div className="text-center">
                    <Button
                      variant="link"
                      onClick={() => {
                        setTokenSent(false)
                        setToken('')
                        setError('')
                        setAttempts(0)
                      }}
                      disabled={loading}
                    >
                      Não recebeu o código? Enviar novamente
                    </Button>
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    <p>Tentativas restantes: {maxAttempts - attempts}</p>
                    <p className="text-xs mt-1">O código expira em 5 minutos</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              Por que verificamos seu número?
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Garantir a segurança da sua transação</li>
              <li>• Prevenir fraudes e uso indevido</li>
              <li>• Confirmar sua identidade</li>
              <li>• Manter você informado sobre o status da operação</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}

