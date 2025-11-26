import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  doc, getDoc, updateDoc, collection, 
  addDoc, query, where, getDocs, setDoc 
} from 'firebase/firestore';

import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, TrendingUp, MessageSquare, CheckCircle, Clock, AlertCircle, Phone } from 'lucide-react'; // Adicionado Phone
import { getTranslation } from '../utils/translations';

const VALID_CODES = [
  '126650', '117154', '116772', '120273', 
  '125019', '120967', '125619', '131811', 
  '132468', '120349'
];

export default function VerifyPage({ language }) {
  const navigate = useNavigate();
  const { userId } = useParams();
  const t = (key) => getTranslation(language, key);

  const [user, setUser] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [token, setToken] = useState('');
  const [generatedToken, setGeneratedToken] = useState('');
  const [tokenSent, setTokenSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  const maxAttempts = 5;

  // --- FUNÇÕES DE BACKEND MANTIDAS INTACTAS ---
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        navigate('/register');
        return;
      }

      const leadRef = doc(db, 'leads', userId);
      const leadSnap = await getDoc(leadRef);

      if (leadSnap.exists()) {
        setUser({ id: leadSnap.id, ...leadSnap.data() });

        const q = query(
          collection(db, 'transactions'),
          where('userId', '==', userId),
          where('status', '==', 'pending_verification')
        );

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

    const newToken = VALID_CODES[Math.floor(Math.random() * VALID_CODES.length)];
    setGeneratedToken(newToken);

    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      await addDoc(collection(db, 'otps'), {
        userId,
        token: newToken,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        attempts: 0,
        used: false,
        type: transactionId ? 'transaction' : 'registration',
        relatedId: transactionId || userId
      });

      setTokenSent(true);
      console.log(`Token enviado para ${user?.phone}: ${newToken}`);

    } catch (e) {
      console.error("Erro ao enviar token:", e);
      setError("Erro ao enviar token. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const verifyToken = async () => {
    setLoading(true);
    setError('');

    if (attempts >= maxAttempts) {
      setError('Número máximo de tentativas excedido. Solicite um novo código.');
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, 'otps'),
        where('relatedId', '==', transactionId || userId),
        where('used', '==', false)
      );

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
        setError('Token expirado ou inválido. Solicite um novo.');
        setLoading(false);
        return;
      }

      if (token !== validOtp.token) {
        setAttempts(prev => prev + 1);
        setError(`Token inválido. Tentativa ${attempts + 1} de ${maxAttempts}`);
        setLoading(false);
        return;
      }

      const otpDocRef = doc(db, 'otps', validOtp.id);
      await updateDoc(otpDocRef, { used: true });

      const now = new Date().toISOString();

      // Atualiza LEAD
      const leadRef = doc(db, 'leads', userId);
      await updateDoc(leadRef, {
        status: 'pending_approval',
        phoneVerifiedAt: now
      });

      // CRIA / ATUALIZA USER
      const userRef = doc(db, 'users', userId);

      await setDoc(userRef, {
        ...user,
        leadId: userId,
        status: 'pending_approval',
        phoneVerifiedAt: now,
        createdFromLead: true,
        updatedAt: now
      }, { merge: true });

      // Se for transação
      if (transactionId) {
        const transactionRef = doc(db, 'transactions', transactionId);

        await updateDoc(transactionRef, {
          status: 'pending_approval',
          verifiedAt: now
        });
      }

      navigate('/cadastro-pendente');

    } catch (e) {
      console.error("Erro ao verificar token:", e);
      setError("Erro ao verificar token. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };
  // --- FIM DAS FUNÇÕES DE BACKEND MANTIDAS INTACTAS ---

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Clock className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
          <p className="text-gray-600">Carregando dados do usuário...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header com design mais limpo e moderno */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-4xl">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              CambioExpress
            </span>
          </Link>

          <Button variant="ghost" onClick={() => navigate(-1)} className="text-gray-600 hover:text-blue-600">
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
                Verificação de Segurança
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Precisamos confirmar seu número de telefone para prosseguir com seu cadastro.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8 p-6 sm:p-8">
              
              {/* Bloco de Informação do Usuário */}
              <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Label className="text-lg font-medium text-blue-800">
                  Número a ser verificado: <span className="font-bold">{user.phone}</span>
                </Label>
              </div>

              {!tokenSent ? (
                // Estado 1: Aguardando envio do código
                <div className="space-y-4">
                  <p className="text-center text-gray-700">
                    Clique no botão abaixo para receber o código de 6 dígitos via WhatsApp.
                  </p>
                  <Button 
                    onClick={sendToken} 
                    disabled={loading} 
                    size="lg" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-150"
                  >
                    {loading ? 'Enviando Código...' : (
                      <>
                        <MessageSquare className="w-5 h-5 mr-2" />
                        Enviar Código via WhatsApp
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                // Estado 2: Código enviado, aguardando verificação
                <div className="space-y-6">
                  <p className="text-center text-sm text-green-600 font-medium">
                    Código enviado! Verifique seu WhatsApp.
                  </p>
                  
                  <div className="space-y-2">
                    <Label htmlFor="token" className="text-base font-semibold text-gray-700">
                      Digite o código de 6 dígitos
                    </Label>
                    <Input
                      id="token"
                      value={token}
                      onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
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
                    onClick={verifyToken}
                    disabled={loading || token.length !== 6 || attempts >= maxAttempts}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-150"
                  >
                    {loading ? 'Verificando...' : 'Confirmar Código'}
                  </Button>

                  <div className="text-center text-sm text-gray-500">
                    Tentativas restantes: <span className="font-bold text-gray-700">{maxAttempts - attempts}</span>
                  </div>
                  
                  {/* Opção de Reenviar Código (adicionada no redesenho) */}
                  <div className="text-center pt-4 border-t border-gray-100">
                    <Button 
                      variant="link" 
                      onClick={sendToken} 
                      disabled={loading} 
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Reenviar Código
                    </Button>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>

        </div>
      </section>
    </div>
  );
}
