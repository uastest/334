import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const VALID_CODES = [
  '126650', '117154', '116772', '120273', 
  '125019', '120967', '125619', '131811', 
  '132468', '120349'
];

import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, TrendingUp, MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { getTranslation } from '../utils/translations';

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

      if (transactionId) {
        const transactionDocRef = doc(db, 'transactions', transactionId);

        await updateDoc(transactionDocRef, {
          status: 'pending_approval'
        });

        navigate('/cadastro-pendente');

      } else {
        const userDocRef = doc(db, 'leads', userId);

        await updateDoc(userDocRef, {
          status: 'pending_approval',
          phoneVerifiedAt: new Date().toISOString()
        });

        navigate('/cadastro-pendente');
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
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-blue-700">
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

      <section className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">

          <div className="text-center mb-8">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Verificação via WhatsApp</h1>
            <p className="text-muted-foreground">
              Enviaremos um código para seu número cadastrado
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Confirme seu número</CardTitle>
              <CardDescription>
                Número: <span className="font-medium">{user.phone}</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {!tokenSent ? (
                <Button onClick={sendToken} disabled={loading} size="lg" className="w-full">
                  {loading ? 'Enviando...' : 'Enviar Código'}
                </Button>
              ) : (
                <>
                  <Input
                    value={token}
                    onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="text-center text-2xl tracking-widest"
                    maxLength={6}
                    placeholder="000000"
                  />

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    onClick={verifyToken}
                    disabled={loading || token.length !== 6}
                    className="w-full"
                  >
                    {loading ? 'Verificando...' : 'Confirmar Código'}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
