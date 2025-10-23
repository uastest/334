import { Link } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'

export default function TermsPage() {
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
          <h1>Termos de Uso</h1>
          <p className="text-muted-foreground">Última atualização: 13 de outubro de 2025</p>

          <h2>1. Aceitação dos Termos</h2>
          <p>
            Ao acessar e usar os serviços da CambioExpress, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso. Se você não concordar com qualquer parte destes termos, não deverá usar nossos serviços.
          </p>

          <h2>2. Descrição dos Serviços</h2>
          <p>
            A CambioExpress é uma casa de câmbio profissional com sede no Paraguai, oferecendo serviços de câmbio de moedas estrangeiras, incluindo:
          </p>
          <ul>
            <li>Compra e venda de moedas estrangeiras</li>
            <li>Transferências internacionais</li>
            <li>Serviços de câmbio online</li>
            <li>Retirada em espécie ou transferência bancária</li>
          </ul>

          <h2>3. Cadastro e Verificação</h2>
          <p>
            Para utilizar nossos serviços, você deve:
          </p>
          <ul>
            <li>Fornecer informações precisas e completas durante o cadastro</li>
            <li>Manter suas informações atualizadas</li>
            <li>Completar o processo de verificação de identidade</li>
            <li>Ser maior de 18 anos</li>
          </ul>

          <h2>4. Taxas e Tarifas</h2>
          <p>
            Todas as transações estão sujeitas a uma taxa de serviço de 0.4% sobre o valor da transação. As taxas de câmbio são atualizadas em tempo real e podem variar de acordo com o mercado.
          </p>

          <h2>5. Política de Pagamento</h2>
          <p>
            Os pagamentos podem ser realizados via:
          </p>
          <ul>
            <li>PIX (para clientes no Brasil)</li>
            <li>Transferência bancária internacional</li>
          </ul>
          <p>
            Após a confirmação do pagamento, o prazo de entrega é de até 12 horas.
          </p>

          <h2>6. Cancelamento e Reembolso</h2>
          <p>
            Transações podem ser canceladas antes da confirmação do pagamento. Após a confirmação, o cancelamento está sujeito à análise e pode incorrer em taxas administrativas.
          </p>

          <h2>7. Segurança e Privacidade</h2>
          <p>
            Levamos a segurança de suas informações a sério. Todos os dados são criptografados e armazenados de forma segura. Consulte nossa Política de Privacidade para mais detalhes.
          </p>

          <h2>8. Limitação de Responsabilidade</h2>
          <p>
            A CambioExpress não se responsabiliza por:
          </p>
          <ul>
            <li>Flutuações nas taxas de câmbio após a confirmação da transação</li>
            <li>Atrasos causados por instituições bancárias terceiras</li>
            <li>Informações incorretas fornecidas pelo usuário</li>
          </ul>

          <h2>9. Modificações dos Termos</h2>
          <p>
            Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação no site.
          </p>

          <h2>10. Lei Aplicável</h2>
          <p>
            Estes termos são regidos pelas leis do Paraguai. Qualquer disputa será resolvida nos tribunais competentes de Ciudad del Este, Paraguay.
          </p>

          <h2>11. Contato</h2>
          <p>
            Para dúvidas sobre estes termos, entre em contato conosco:
          </p>
          <ul>
            <li>E-mail: contato@cambioexpress.com</li>
            <li>Telefone: +595 61 123 4567</li>
            <li>Endereço: Av. Principal, 1234 - Ciudad del Este, Paraguay</li>
          </ul>
        </div>
      </section>
    </div>
  )
}

