
Footer.jsx
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, TrendingUp } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-12">
          
          {/* Coluna 1: Logo e Social */}
          <div className="col-span-2 md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">
                CambioExpress
              </span>
            </Link>
            <p className="text-sm text-gray-400">
              Casa de câmbio profissional com sede no Paraguai, oferecendo serviços seguros e confiáveis.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Coluna 2: Links Rápidos */}
          <div className="space-y-4">
            <h4 className="text-white font-bold mb-4 border-b border-gray-700 pb-2">Links Rápidos</h4>
            <ul className="space-y-3 text-sm">
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
                <Link to="/dashboard" className="hover:text-blue-400 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-400 transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Legal */}
          <div className="space-y-4">
            <h4 className="text-white font-bold mb-4 border-b border-gray-700 pb-2">Legal</h4>
            <ul className="space-y-3 text-sm">
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
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Política de Cookies
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Mapa do Site
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Contato */}
          <div className="space-y-4">
            <h4 className="text-white font-bold mb-4 border-b border-gray-700 pb-2">Fale Conosco</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <a href="mailto:contato@cambioexpress.com" className="hover:text-blue-400 transition-colors">
                  contato@cambioexpress.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <a href="tel:+595961234567" className="hover:text-blue-400 transition-colors">
                  +595 961 234 567
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5" />
                <span>Assunção, Paraguai</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {currentYear} CambioExpress. Todos os direitos reservados.</p>
          <p className="mt-4 md:mt-0">Desenvolvido com <span className="text-red-500">♥</span> e tecnologia.</p>
        </div>
      </div>
    </footer>
  )
}
