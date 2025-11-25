import { Link } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              CambioExpress
            </span>
          </Link>
        </div>
      </header>

      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto prose prose-slate">
          <h1>Política de Privacidade</h1>
          <p className="text-muted-foreground">Última atualização: 13 de outubro de 2025</p>

          <h2>1. Introdução</h2>
          <p>
            A CambioExpress ("nós", "nosso" ou "empresa") está comprometida em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações pessoais quando você utiliza nossos serviços.
          </p>

          <h2>2. Informações que Coletamos</h2>
          <h3>2.1 Informações Fornecidas por Você</h3>
          <ul>
            <li>Nome completo</li>
            <li>Endereço de e-mail</li>
            <li>Número de telefone</li>
            <li>Endereço residencial</li>
            <li>Nacionalidade</li>
            <li>Documentos de identificação (RG, CNH, Passaporte)</li>
            <li>Selfie para verificação de identidade</li>
            <li>Informações bancárias (para transferências)</li>
          </ul>

          <h3>2.2 Informações Coletadas Automaticamente</h3>
          <ul>
            <li>Endereço IP</li>
            <li>Tipo de navegador</li>
            <li>Páginas visitadas</li>
            <li>Data e hora de acesso</li>
            <li>Cookies e tecnologias similares</li>
          </ul>

          <h2>3. Como Usamos Suas Informações</h2>
          <p>
            Utilizamos suas informações pessoais para:
          </p>
          <ul>
            <li>Processar suas transações de câmbio</li>
            <li>Verificar sua identidade e prevenir fraudes</li>
            <li>Cumprir obrigações legais e regulatórias</li>
            <li>Enviar notificações sobre suas transações</li>
            <li>Melhorar nossos serviços</li>
            <li>Responder às suas solicitações de suporte</li>
          </ul>

          <h2>4. Compartilhamento de Informações</h2>
          <p>
            Não vendemos suas informações pessoais. Podemos compartilhar suas informações com:
          </p>
          <ul>
            <li>Instituições financeiras para processar pagamentos</li>
            <li>Autoridades governamentais quando exigido por lei</li>
            <li>Prestadores de serviços terceirizados (sob acordos de confidencialidade)</li>
          </ul>

          <h2>5. Segurança dos Dados</h2>
          <p>
            Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações, incluindo:
          </p>
          <ul>
            <li>Criptografia de dados em trânsito e em repouso</li>
            <li>Autenticação multifator</li>
            <li>Controles de acesso rigorosos</li>
            <li>Monitoramento contínuo de segurança</li>
            <li>Auditorias regulares de segurança</li>
          </ul>

          <h2>6. Retenção de Dados</h2>
          <p>
            Mantemos suas informações pessoais pelo tempo necessário para:
          </p>
          <ul>
            <li>Cumprir obrigações legais e regulatórias</li>
            <li>Resolver disputas</li>
            <li>Fazer cumprir nossos acordos</li>
          </ul>
          <p>
            Após esse período, suas informações serão excluídas ou anonimizadas de forma segura.
          </p>

          <h2>7. Seus Direitos</h2>
          <p>
            Você tem o direito de:
          </p>
          <ul>
            <li>Acessar suas informações pessoais</li>
            <li>Corrigir informações incorretas</li>
            <li>Solicitar a exclusão de suas informações</li>
            <li>Opor-se ao processamento de suas informações</li>
            <li>Solicitar a portabilidade de seus dados</li>
            <li>Retirar seu consentimento a qualquer momento</li>
          </ul>

          <h2>8. Cookies</h2>
          <p>
            Utilizamos cookies para melhorar sua experiência em nosso site. Você pode configurar seu navegador para recusar cookies, mas isso pode afetar a funcionalidade do site.
          </p>

          <h2>9. Transferências Internacionais</h2>
          <p>
            Suas informações podem ser transferidas e processadas em países diferentes do seu país de residência. Garantimos que essas transferências sejam realizadas de acordo com as leis de proteção de dados aplicáveis.
          </p>

          <h2>10. Menores de Idade</h2>
          <p>
            Nossos serviços não são destinados a menores de 18 anos. Não coletamos intencionalmente informações de menores.
          </p>

          <h2>11. Alterações nesta Política</h2>
          <p>
            Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre alterações significativas por e-mail ou através de um aviso em nosso site.
          </p>

          <h2>12. Contato</h2>
          <p>
            Para questões sobre esta Política de Privacidade ou para exercer seus direitos, entre em contato conosco:
          </p>
          <ul>
            <li>E-mail: privacidade@cambioexpress.com</li>
            <li>Telefone: +595 61 123 4567</li>
            <li>Endereço: Av. Principal, 1234 - Ciudad del Este, Paraguay</li>
          </ul>

          <h2>13. Conformidade com LGPD e GDPR</h2>
          <p>
            Estamos comprometidos em cumprir a Lei Geral de Proteção de Dados (LGPD) do Brasil e o Regulamento Geral sobre a Proteção de Dados (GDPR) da União Europeia, quando aplicável.
          </p>
        </div>
      </section>
    </div>
  )
}

