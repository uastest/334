import { Link } from 'react-router-dom';
import { Clock, Mail } from 'lucide-react';

export default function PendingRegistrationPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-3xl">
        <div className="p-8 sm:p-10 lg:p-12 text-center">
          
          {/* Icone de Status - Mais moderno e com foco na espera */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full badge-yellow mb-6">
            <Clock className="h-10 w-10 text-yellow-600 animate-spin-slow" />
          </div>

          {/* Título Principal */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Quase Lá! Seu Cadastro Está em Análise
          </h1>

          {/* Mensagem Detalhada */}
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Obrigado por se juntar a nós. Seu pedido de registro foi recebido com sucesso e está sendo revisado pela nossa equipe.
          </p>

          {/* Bloco de Informação Adicional */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 text-left mb-8">
            <div className="flex items-start">
              <Mail className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-blue-800 mb-2">O que acontece agora?</h3>
                <p className="text-blue-700">
                  Você será notificado por whatsapp assim que sua conta for aprovada e ativada. Isso geralmente leva até **24 horas**.
                </p>
                <p className="text-blue-700 mt-2">
                  Por favor, acompanhe pelo WhatsApp. Não envie mensagens, apenas aguarde a confirmação.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action - Botão Principal */}
          <Link 
            to="/" 
            className="w-full inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-lg shadow-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out transform hover:scale-[1.02]"
          >
            Voltar para a Página Inicial
          </Link>
          
          {/* Nota de Rodapé */}
          <p className="mt-6 text-sm text-gray-400">
            Agradecemos a sua paciência.
          </p>
        </div>
      </div>
      
      {/* Estilo para a animação de rotação lenta (necessário se o Tailwind não tiver um utilitário nativo para isso) */}
      <style jsx>{`
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
        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  );
}
