import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Copy, TrendingUp, AlertCircle, ArrowLeft } from 'lucide-react';

// Componente ultra-simplificado para garantir que a página sempre carregue.
export default function PayToPix0189() {
  const navigate = useNavigate();
  // O transactionId ainda é pego da URL, mas será usado APENAS para o redirecionamento final.
  // Se ele não existir, a página ainda funciona.
  const { transactionId } = useParams();

  // O código PIX é fixo, como já estava.
  const [pixCode] = useState("SEU_CODIGO_PIX_FIXO_AQUI");
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Função para copiar o código PIX. Funciona de forma independente.
  const handleCopyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Função para confirmar o pagamento.
  // Apenas redireciona o usuário. Não interage com o banco de dados.
  const handlePaymentConfirmed = () => {
    setIsProcessing(true);
    // Simula um pequeno atraso para o usuário ver o feedback.
    setTimeout(() => {
      // Se o transactionId existir na URL, redireciona para a confirmação.
      // Se não, envia para o dashboard. Isso evita que a página quebre.
      if (transactionId) {
        navigate(`/confirmation/${transactionId}`);
      } else {
        navigate('/dashboard');
      }
    }, 1500);
  };

  // --- Renderização do Componente (Layout Idêntico, Lógica Removida) ---
  // Não há mais estado de 'loading' ou busca de 'transaction', então a página carrega instantaneamente.

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                CambioExpress
              </span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)} // Botão "Voltar" que funciona em qualquer caso
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              💳 Pagamento via PIX
            </h1>
            <p className="text-muted-foreground">
              Escaneie o QR Code ou copie o código PIX para pagar.
            </p>
          </div>

          {/* REMOVIDO: O sumário da transação foi removido para eliminar a dependência do Firebase. */}

          <Card className="shadow-lg border-0 mb-6">
            <CardHeader>
              <CardTitle>Código PIX para Pagamento</CardTitle>
              <CardDescription>Escaneie o QR Code ou copie o código abaixo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <img
                  src="/qrcodepg.png"
                  alt="QR Code de Pagamento"
                  className="mx-auto w-48 h-48 mb-4 border-2 border-gray-200 rounded-lg p-2 bg-white"
                />
                <p className="text-sm text-muted-foreground">Escaneie com o app do seu banco</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                <label className="text-sm font-medium">Código PIX Copia e Cola:</label>
                <div className="flex gap-2">
                  <input
                    value={pixCode}
                    readOnly
                    className="flex-1 font-mono text-xs border p-2 rounded-md bg-white"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyPixCode}
                    className="flex-shrink-0"
                  >
                    {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-900">
                    <p className="font-medium">Importante</p>
                    <p className="text-xs mt-1">Após pagar, clique no botão "Já Paguei" para que possamos confirmar sua transação.</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handlePaymentConfirmed}
                disabled={isProcessing}
                className="w-full bg-green-600 hover:bg-green-700 gap-2"
              >
                {isProcessing ? 'Processando...' : '✓ Já Paguei'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
