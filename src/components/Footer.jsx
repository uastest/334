import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Sobre */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">CambioExpress</h3>
            <p className="text-sm text-gray-400 mb-4">
              Casa de câmbio profissional com sede no Paraguai, oferecendo serviços seguros e confiáveis.
            </p>
            <div className="flex gap-3">
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="text-white font-bold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-blue-400 transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-blue-400 transition-colors">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-white font-bold mb-4">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:contato@cambioexpress.com" className="hover:text-blue-400 transition-colors">
                  contato@cambioexpress.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href="tel:+595961234567" className="hover:text-blue-400 transition-colors">
                  +595 961 234 567
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Assunção, Paraguai</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-4">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-3">
              Receba as melhores taxas de câmbio direto no seu email.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Seu email"
                className="flex-1 px-3 py-2 rounded bg-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition-colors">
                Inscrever
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-400">
            <div>
              <p className="font-semibold text-white mb-2">Segurança</p>
              <p>✓ Transações criptografadas</p>
              <p>✓ Dados protegidos</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Velocidade</p>
              <p>✓ Processamento em até 12h</p>
              <p>✓ Suporte 24/7</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Confiabilidade</p>
              <p>✓ Regulamentado</p>
              <p>✓ +10.000 clientes</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; {currentYear} CambioExpress. Todos os direitos reservados.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-blue-400 transition-colors">
              Política de Cookies
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Mapa do Site
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
