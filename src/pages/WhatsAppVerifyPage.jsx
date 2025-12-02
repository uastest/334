import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, TrendingUp, Clock, AlertCircle, Phone } from 'lucide-react';
import { useAuth } from '../hooks/use-auth';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

// Lista de códigos válidos e sua lógica de mapeamento
const VALID_CODES = [
  '126650', '117154', '116772', '120273', 
  '125019', '120967', '125619', '131811', 
  '132468', '120349'
];

export default function WhatsAppVerifyPage() {
  const navigate = useNavigate();
  const { transactionId } = useParams();
  const { user, loading: authLoading } = useAuth();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');

  // Função que encontra o nome da página de pagamento com base no código
  const getPaymentPageName = (code) => {
    const index = VALID_CODES.indexOf(code);
    if (index !== -1) {
      const pageNumber = 189 + index;
      return `Pay-to-Pix-${String(pageNumber).padStart(4, '0')}`;
    }
    return null;
  };

  // Busca os dados da transação apenas para exibir o resumo na tela
  useEffect(() => {
    const fetchTransaction = async () => {
      if (!transactionId || !user) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'transactions', transactionId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().userId === user.uid) {
          setTransaction({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error('Erro ao buscar transação:', err);
        setError('Não foi possível carregar os detalhes da transação.');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchTransaction();
    }
  }, [transactionId, user, authLoading]);

  // Função principal que lida com a verificação e o redirecionamento
  const handleVerifyAndRedirect = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const code = verificationCode.trim();

    if (code.length !== 6) {
      setError('Por favor, insira o código de 6 dígitos.');
      setSubmitting(false);
      return;
    }

    const paymentPageName = getPaymentPageName(code);

    if (!paymentPageName) {
      setError('Código de verificação inválido. Tente novamente.');
      setSubmitting(false);
      return;
    }

    // ==================================================================
    // **CORREÇÃO PRINCIPAL APLICADA AQUI**
    // O redirecionamento agora é feito SEM o transactionId no final.
    // Exemplo de URL: /Pay-to-Pix-0189
    // ==================================================================
    navigate(`/${paymentPageName}`);
  };

  // --- O restante do componente permanece exatamente igual ---

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-spin" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
          <p className="text-red-600 font-medium">Transação não encontrada ou acesso negado.</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">Voltar ao Início</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-4xl">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">CambioExpress</span>
          </Link>
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-blue-600">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="max-w-lg mx-auto">
          <Card className="shadow-2xl border-t-4 border-blue-600">
            <CardHeader className="text-center pt-8 pb-4">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-3xl font-extrabold text-gray-900">Verificação de WhatsApp</CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Insira o código de 6 dígitos enviado para o seu WhatsApp para prosseguir.
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
                
                <form onSubmit={handleVerifyAndRedirect} className="space-y-6">
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
                      autoFocus
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
                    {submitting ? 'Verificando...' : 'Confirmar e Continuar'}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
