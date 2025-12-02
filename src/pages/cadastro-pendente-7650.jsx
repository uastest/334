
Home.tsx
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  CreditCard,
  ShieldCheck,
  Zap,
  AlertCircle,
  Mail,
} from "lucide-react";
import { useState } from "react";

/**
 * Design Philosophy: Premium Fintech + Clean White
 * - White background matching site standard
 * - Dark cards for Nox Pay and Exchange (IMMUTABLE)
 * - Spinning clock animation from original
 * - Comprehensive informative section below
 */

export default function Home() {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerification = () => {
    setIsVerifying(true);
    window.open(
      "https://www.youtube.com/watch?v=UX6-hMRPmXs"
    );
    setTimeout(() => setIsVerifying(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-500/30">
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-4xl mx-auto w-full"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full mb-6 border border-blue-200">
              <Clock className="w-6 h-6 text-blue-600 mr-2 animate-spin-slow" />
              <span className="text-blue-700 font-medium tracking-wide text-sm uppercase">
                Análise em Andamento
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-gray-900">
              Quase Lá! Seu Cadastro Está em Análise
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Obrigado por se juntar a nós. Seu pedido de registro foi recebido
              com sucesso e está sendo revisado pela nossa equipe.
            </p>
          </motion.div>

          {/* Cards Grid - IMMUTABLE SECTION */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Card 1: Nox Pay (Action Required) */}
            <motion.div
              variants={itemVariants}
              className="group relative bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-8 hover:border-slate-600 transition-all duration-500 hover:shadow-xl hover:shadow-slate-900/20"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Zap className="w-24 h-24 text-slate-700" />
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-600 p-2 overflow-hidden">
                  <img
                    src="/noxpay-logo.jpg"
                    alt="Nox Pay"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Nox Pay</h3>
                  <p className="text-sm text-slate-300 font-medium">
                    Intermediadora Oficial
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-emerald-500/20 rounded-full mt-0.5">
                    <Zap className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-slate-100 font-medium">
                      Aprovação Instantânea
                    </p>
                    <p className="text-slate-400 text-sm mt-1">
                      Verificação automática de identidade em segundos.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-indigo-500/20 rounded-full mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-slate-100 font-medium">Crucial para Operar</p>
                    <p className="text-slate-400 text-sm mt-1">
                      Obrigatório para processar seus pagamentos.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleVerification}
                disabled={isVerifying}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-6 rounded-xl shadow-lg shadow-indigo-900/30 border-0 transition-all duration-300 transform group-hover:translate-y-[-2px]"
              >
                {isVerifying ? (
                  <span className="flex items-center gap-2">
                    <Clock className="w-5 h-5 animate-spin" />
                    Processando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-lg">
                    Verificar Agora
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </motion.div>

            {/* Card 2: Exchange House (Waiting) */}
            <motion.div
              variants={itemVariants}
              className="relative bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-3xl p-8 flex flex-col hover:border-slate-500 transition-all duration-500 hover:shadow-xl hover:shadow-slate-900/20"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-700 flex items-center justify-center border border-slate-600">
                  <CreditCard className="w-7 h-7 text-slate-300" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Casa de Câmbio
                  </h3>
                  <p className="text-sm text-slate-400 font-medium">
                    Análise de Compliance
                  </p>
                </div>
              </div>

              <div className="space-y-6 flex-grow">
                <div className="flex items-start gap-3 opacity-75">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mt-0.5" />
                  <div>
                    <p className="text-slate-100 font-medium">Cadastro Recebido</p>
                    <p className="text-slate-400 text-sm mt-1">
                      Seus dados já estão conosco.
                    </p>
                  </div>
                </div>

                <div className="relative pl-3 ml-2.5 border-l-2 border-slate-600 pb-2">
                  {/* Timeline connector */}
                </div>

                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-orange-500/20 rounded-full animate-ping" />
                    <Clock className="w-6 h-6 text-orange-500 relative z-10" />
                  </div>
                  <div>
                    <p className="text-orange-400 font-medium">Em Análise Manual</p>
                    <p className="text-slate-400 text-sm mt-1">
                      Nosso time está revisando seus documentos.
                    </p>
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 rounded-lg border border-orange-500/20">
                      <Clock className="w-3.5 h-3.5 text-orange-500" />
                      <span className="text-xs font-semibold text-orange-400 uppercase tracking-wide">
                        Prazo: 24 Horas
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-600">
                <p className="text-slate-400 text-sm text-center">
                  Você será notificado via WhatsApp assim que aprovado.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Informative Section */}
          <motion.div variants={itemVariants} className="space-y-8">
            {/* Main Info Block */}
            <div className="bg-blue-50 p-8 rounded-2xl border-2 border-blue-200">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-8 h-8 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold text-blue-900 mb-4">
                    O que você precisa saber
                  </h3>
                  <div className="space-y-4 text-blue-800">
                    <p className="leading-relaxed">
                      Seu cadastro na <strong>casa de câmbio já foi realizado</strong> e
                      está sendo analisado pelo nosso time especializado. Este é um passo
                      importante para garantir conformidade regulatória e segurança em
                      suas operações.
                    </p>
                    <p className="leading-relaxed">
                      Para que você possa utilizar plenamente os{" "}
                      <strong>serviços de câmbio</strong>, é <strong>crucial</strong> que
                      você também seja <strong>aprovado pela Nox Pay</strong>, nossa
                      intermediadora oficial de pagamentos. Esta aprovação será verificada
                      durante nossa avaliação do seu cadastro.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Section */}
            <div className="bg-gray-50 p-8 rounded-2xl border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Cronograma de Aprovação
              </h3>
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <div className="w-1 h-12 bg-gray-300 mt-2" />
                  </div>
                  <div className="pb-6">
                    <p className="font-bold text-gray-900">Nox Pay - Verificação</p>
                    <p className="text-gray-600 text-sm mt-1">
                      <strong>Tempo:</strong> Instantâneo (segundos)
                    </p>
                    <p className="text-gray-600 text-sm mt-2">
                      Você será redirecionado para o portal de verificação da Nox Pay.
                      A aprovação é automática e ocorre em tempo real.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">
                      ⏱
                    </div>
                    <div className="w-1 h-12 bg-gray-300 mt-2" />
                  </div>
                  <div className="pb-6">
                    <p className="font-bold text-gray-900">
                      Casa de Câmbio - Análise Manual
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      <strong>Tempo:</strong> Até 24 horas
                    </p>
                    <p className="text-gray-600 text-sm mt-2">
                      Nosso time de compliance revisará seus documentos e informações
                      cadastrais. Este processo é manual e garante a máxima segurança.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                      ✓
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Conta Ativada</p>
                    <p className="text-gray-600 text-sm mt-1">
                      <strong>Notificação:</strong> Via WhatsApp
                    </p>
                    <p className="text-gray-600 text-sm mt-2">
                      Assim que sua conta for aprovada, você receberá uma notificação
                      via WhatsApp confirmando que está pronto para operar.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Both Are Required */}
            <div className="bg-indigo-50 p-8 rounded-2xl border-2 border-indigo-200">
              <h3 className="text-2xl font-bold text-indigo-900 mb-4">
                Por que ambas as aprovações são necessárias?
              </h3>
              <div className="space-y-4 text-indigo-800">
                <div className="flex gap-3">
                  <ShieldCheck className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Nox Pay (Intermediadora)</p>
                    <p className="text-sm mt-1">
                      Valida sua identidade e aprova você para processar pagamentos.
                      Esta é uma verificação rápida e automática.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <ShieldCheck className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Casa de Câmbio (Compliance)</p>
                    <p className="text-sm mt-1">
                      Realiza uma análise mais profunda de conformidade regulatória e
                      anti-fraude. Este processo é manual e leva até 24 horas.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Section */}
            <div className="bg-green-50 p-8 rounded-2xl border-2 border-green-200">
              <div className="flex items-start gap-4">
                <Mail className="w-8 h-8 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-green-900 mb-2">
                    Próximos Passos
                  </h3>
                  <ul className="space-y-2 text-green-800 text-sm">
                    <li className="flex gap-2">
                      <span className="font-bold">1.</span>
                      <span>Clique em "Verificar Agora" para acessar a Nox Pay</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">2.</span>
                      <span>
                        Complete a verificação de identidade (leva menos de 1 minuto)
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">3.</span>
                      <span>
                        Aguarde a análise da casa de câmbio (até 24 horas)
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">4.</span>
                      <span>
                        Receba confirmação via WhatsApp quando estiver aprovado
                      </span>
                    </li>
                  </ul>
                  <p className="text-green-700 font-medium mt-4">
                    ⏰ Não feche esta página. Você pode voltar aqui a qualquer momento
                    para acompanhar o status.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div variants={itemVariants} className="text-center mt-12">
            <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Ambiente seguro e criptografado
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Styles */}
      <style>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
      `}</style>
    </div>
  );
}