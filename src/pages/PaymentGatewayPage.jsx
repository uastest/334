import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, CreditCard, Copy } from 'lucide-react';

export default function PaymentGatewayPage() {
  const { pageId } = useParams();
  const [pixCode, setPixCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Simula a injeção de um link de PIX. Em um cenário real, isso viria de uma API.
    const generatePixCode = () => {
      // Exemplo de PIX Copia e Cola (fictício)
      const code = `00020126580014br.gov.bcb.pix0136${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}520400005303986540510.005802BR5925NOME DO TITULAR DA CONTA6008BRASILIA62070503***6304C74A`;
      setPixCode(code);
    };
    generatePixCode();
  }, [pageId]);

  const handleCopyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
      <div className="max-w-md mx-auto p-4">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CreditCard className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold">Página de Pagamento: {pageId}</CardTitle>
            <CardDescription className="text-red-600 font-semibold">
              ATENÇÃO: O pagamento deve ser feito no nome do titular da conta da casa de câmbio para ser aprovado.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <img src="/qrcodepg.png" alt="QR Code de Pagamento" className="mx-auto w-48 h-48 mb-4" />
              <p className="text-muted-foreground">Escaneie o QR Code ou use o código PIX Copia e Cola abaixo.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg space-y-2">
              <label className="text-sm font-medium">Código PIX Copia e Cola:</label>
              <div className="flex gap-2">
                <input
                  value={pixCode}
                  readOnly
                  className="flex-1 font-mono text-sm border p-2 rounded-md bg-white"
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

            <div className="text-center">
              <Link to="/" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Voltar para a Página Inicial
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
