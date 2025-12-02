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
  const [currentStep, setCurrentStep] = useState(0); // Controla a etapa atual (0 a 3)

  const handleCopyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Inicia a simulação das etapas de progresso
  const handlePaymentConfirmed = () => {
    setShowSteps(true); // Mostra a seção de etapas

    // Simula o progresso das etapas com intervalos de tempo
    setTimeout(() => setCurrentStep(1), 2000); // Etapa 1: Processando
    setTimeout(() => setCurrentStep(2), 5000); // Etapa 2: Concluído
    setTimeout(() => setCurrentStep(3), 8000); // Etapa 3: Depósito e Comprovante
  };

  // Definição das etapas para fácil visualização
  const steps = [
    { icon: <Loader2 className="animate-spin" />, text: "Estamos conferindo o pagamento..." },
    { icon: <Banknote />, text: "Seu pagamento está sendo processado." },
    { icon: <CheckCircle />, text: "Pagamento concluído com sucesso!" },
    { icon: <MailCheck />, text: "Acabamos de fazer o depósito para a conta que você indicou. Em 24 a 48 horas o valor estará disponível. Enviamos seu comprovante cambial no WhatsApp." }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header com design limpo */}
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
          
          {/* Mensagem de Alerta sobre Titularidade */}
          <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-r-lg mb-8 shadow-sm">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
              <p className="text-sm font-medium">
                O pagamento só será aceito se for feito no nome do mesmo titular do cadastro.
              </p>
            </div>
          </div>

          {/* Card Principal de Pagamento */}
          <Card className="shadow-xl border-t-4 border-blue-600 overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b p-6">
              <CardTitle className="text-2xl font-bold text-slate-900">Pagamento via PIX</CardTitle>
              <CardDescription className="text-slate-600">Copie o código ou escaneie a imagem para pagar.</CardDescription>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* QR Code */}
                <div className="text-center flex-shrink-0">
                  <img
                    src="/qrcodepg.png"
                    alt="QR Code de Pagamento"
                    className="mx-auto w-40 h-40 rounded-lg border-2 p-1 bg-white shadow-md"
                  />
                  <p className="text-xs text-slate-500 mt-2">Escaneie com o app do seu banco</p>
                </div>

                {/* Código Copia e Cola */}
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

              {/* Botão de Confirmação */}
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
                  {steps.map((step, index) => (
                    <div key={index} className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-500 ${index <= currentStep ? 'bg-blue-100 text-blue-900' : 'bg-slate-100 text-slate-500'}`}>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${index <= currentStep ? 'bg-blue-600 text-white' : 'bg-slate-300'}`}>
                        {index < currentStep ? <CheckCircle /> : step.icon}
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
