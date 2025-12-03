import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Copy, TrendingUp, AlertCircle, ArrowLeft, Loader2, Banknote, MailCheck } from 'lucide-react';

// Componente com design aprimorado e fluxo de etapas de pagamento.
export default function PayToPix0189() {
  const navigate = useNavigate();

  const [pixCode] = useState("00020126580014br.gov.bcb.pix0136a8e5b8a3-4b9c-4b9c-8b1a-3e4c5f6g7h8i5204000053039865802BR5925CambioExpress Servicos Fina6009SAO PAULO62070503***6304E4B2");
  const [copied, setCopied] = useState(false);
  const [showSteps, setShowSteps] = useState(false); // Controla a visibilidade das etapas

  const handleCopyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // ==================================================================
  // **CORREÇÃO PRINCIPAL APLICADA AQUI**
  // A função agora apenas ativa a exibição das etapas.
  // Não há mais 'setTimeout' para avançar automaticamente.
  // ==================================================================
  const handlePaymentConfirmed = () => {
    setShowSteps(true); // Apenas mostra a seção de etapas, com a primeira já ativa.
  };

  // Definição das etapas para fácil visualização
  const steps = [
    { icon: <Loader2 className="animate-spin" />, text: "Estamos conferindo o pagamento..." },
    { icon: <Banknote />, text: "Seu pagamento está sendo processado." },
    { icon: <CheckCircle />, text: "Pagamento concluído com sucesso!" },
    { icon: <MailCheck />, text: "Depósito realizado e comprovante enviado." }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-md">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-800">
              CambioExpress
            </span>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-slate-600 hover:text-blue-600">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 sm:py-16">
        <div className="max-w-2xl mx-auto">
          
          <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-r-lg mb-8 shadow-sm">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
              <p className="text-sm font-medium">
                O pagamento só será aceito se for feito no nome do mesmo titular do cadastro.
              </p>
            </div>
          </div>

          <Card className="shadow-xl border-t-4 border-blue-600 overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b p-6">
              <CardTitle className="text-2xl font-bold text-slate-900">Pagamento via PIX</CardTitle>
              <CardDescription className="text-slate-600">Copie o código ou escaneie a imagem para pagar.</CardDescription>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="text-center flex-shrink-0">
                  <img
                    src="/qrcodepg.png"
                    alt="QR Code de Pagamento"
                    className="mx-auto w-40 h-40 rounded-lg border-2 p-1 bg-white shadow-md"
                  />
                  <p className="text-xs text-slate-500 mt-2">Escaneie com o app do seu banco</p>
                </div>

                <div className="w-full bg-slate-100 p-4 rounded-lg space-y-2 border border-slate-200">
                  <label className="text-sm font-semibold text-slate-700">PIX Copia e Cola:</label>
                  <div className="flex gap-2">
                    <input
                      value={pixCode}
                      readOnly
                      className="w-full font-mono text-xs bg-white border border-slate-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button
                      variant={copied ? "secondary" : "outline"}
                      size="icon"
                      onClick={handleCopyPixCode}
                      className="flex-shrink-0 transition-all duration-200"
                    >
                      {copied ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>
              </div>

              {/* O botão de confirmação só é visível se as etapas não estiverem sendo mostradas */}
              {!showSteps && (
                <Button onClick={handlePaymentConfirmed} className="w-full bg-green-600 hover:bg-green-700 text-lg font-semibold py-6 rounded-lg shadow-lg transition-transform hover:scale-105">
                  ✓ Já Paguei
                </Button>
              )}
            </CardContent>

            {/* Seção de Etapas de Progresso */}
            {showSteps && (
              <div className="bg-slate-50 p-6 border-t">
                <h3 className="text-lg font-semibold text-center mb-4 text-slate-800">Status do Pagamento</h3>
                <div className="space-y-4">
                  {/* Etapa 1: Sempre ativa após o clique */}
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-green-100 text-green-900">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-green-600 text-white">
                      <Loader2 className="animate-spin" />
                    </div>
                    <p className="text-sm font-medium">{steps[0].text}</p>
                  </div>

                  {/* Etapas 2, 3 e 4: Sempre pendentes */}
                  {steps.slice(1).map((step, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-slate-100 text-slate-500">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-300 text-slate-500">
                        {step.icon}
                      </div>
                      <p className="text-sm font-medium">{step.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
