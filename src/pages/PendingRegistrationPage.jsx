import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function PendingRegistrationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
      <div className="text-center space-y-6 p-8 bg-white rounded-lg shadow-xl max-w-md mx-auto">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
        <h1 className="text-3xl font-bold text-gray-900">Cadastro Pendente de Aprovação</h1>
        <p className="text-gray-600">
          Seu cadastro foi enviado com sucesso e está aguardando a aprovação da nossa equipe.
          Você será notificado assim que sua conta for ativada.
        </p>
        <Link to="/" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Voltar para a Página Inicial
        </Link>
      </div>
    </div>
  );
}

