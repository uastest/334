import { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom' // ← HashRouter mantido
import './App.css'
import { AuthProvider } from './hooks/use-auth'

// 🌐 Componentes
import ScrollToTop from './components/ScrollToTop'
import LanguageModal from './components/LanguageModal'


// 🏠 Páginas
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import VerifyPage from './pages/VerifyPage'
import PaymentPage from './pages/PaymentPage'
import ConfirmationPage from './pages/ConfirmationPage'
import PendingRegistrationPage from './pages/PendingRegistrationPage'
import LoginPage from './pages/LoginPage'
import PaymentGatewayPage from './pages/PaymentGatewayPage'
import AdminPanel from './pages/AdminPanel'
import ContactPage from './pages/ContactPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import DashboardPage from './pages/DashboardPage'
import ReceiverInfoPage from './pages/ReceiverInfoPage'
import WhatsAppVerifyPage from './pages/WhatsAppVerifyPage'

// 🆕 Páginas CADASTRO-PENDENTE
import CadastroPendente7650 from './pages/cadastro-pendente-7650'
import CadastroPendente7651 from './pages/cadastro-pendente-7651'
import CadastroPendente7652 from './pages/cadastro-pendente-7652'
import CadastroPendente7653 from './pages/cadastro-pendente-7653'
import CadastroPendente7654 from './pages/cadastro-pendente-7654'
import CadastroPendente7655 from './pages/cadastro-pendente-7655'
import CadastroPendente7656 from './pages/cadastro-pendente-7656'
import CadastroPendente7657 from './pages/cadastro-pendente-7657'
import CadastroPendente7658 from './pages/cadastro-pendente-7658'
import CadastroPendente7659 from './pages/cadastro-pendente-7659'

// 🆕 Páginas PAY-TO-PIX (0189 a 0198)
import PayToPix0189 from './pages/pay-to-pix-0189'
import PayToPix0190 from './pages/pay-to-pix-0190'
import PayToPix0191 from './pages/pay-to-pix-0191'
import PayToPix0192 from './pages/pay-to-pix-0192'
import PayToPix0193 from './pages/pay-to-pix-0193'
import PayToPix0194 from './pages/pay-to-pix-0194'
import PayToPix0195 from './pages/pay-to-pix-0195'
import PayToPix0196 from './pages/pay-to-pix-0196'
import PayToPix0197 from './pages/pay-to-pix-0197'
import PayToPix0198 from './pages/pay-to-pix-0198'


function App() {
  const [showLanguageModal, setShowLanguageModal] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('pt-BR')

  useEffect(() => {
    // Verifica se o usuário já escolheu o idioma
    const savedLanguage = localStorage.getItem('selectedLanguage')
    if (!savedLanguage) {
      setShowLanguageModal(true)
    } else {
      setSelectedLanguage(savedLanguage)
    }
  }, [])

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language)
    localStorage.setItem('selectedLanguage', language)
    setShowLanguageModal(false)
  }

  return (
    <AuthProvider>
    <Router>
      <ScrollToTop />

      {/* Modal de idioma */}
      <LanguageModal
        isOpen={showLanguageModal}
        onSelect={handleLanguageSelect}
      />

      {/* Rotas principais */}
      <Routes>
        <Route path="/" element={<HomePage language={selectedLanguage} />} />
        <Route path="/login" element={<LoginPage language={selectedLanguage} />} />
        <Route path="/register" element={<RegisterPage language={selectedLanguage} />} />
        <Route path="/dashboard" element={<DashboardPage language={selectedLanguage} />} />
        <Route path="/receiver-info/:transactionId" element={<ReceiverInfoPage language={selectedLanguage} />} />
        <Route path="/whatsapp-verify/:transactionId" element={<WhatsAppVerifyPage language={selectedLanguage} />} />
        <Route path="/verify/:userId" element={<VerifyPage language={selectedLanguage} />} />
        <Route path="/payment/:transactionId" element={<PaymentPage language={selectedLanguage} />} />
        <Route path="/confirmation/:transactionId" element={<ConfirmationPage language={selectedLanguage} />} />
        <Route path="/admin-panel-secret" element={<AdminPanel language={selectedLanguage} />} />
        <Route path="/contact" element={<ContactPage language={selectedLanguage} />} />
        <Route path="/terms" element={<TermsPage language={selectedLanguage} />} />
        <Route path="/privacy" element={<PrivacyPage language={selectedLanguage} />} />
        <Route path="/cadastro-pendente" element={<PendingRegistrationPage />} />
        <Route path="/payment/:pageId.html" element={<PaymentGatewayPage />} />
        <Route path="/payment-gateway/:pageId/:transactionId" element={<PaymentGatewayPage language={selectedLanguage} />} />
        {/* Rotas cadastro-pendente */}
<Route path="/cadastro-pendente-7650" element={<CadastroPendente7650 />} />
<Route path="/cadastro-pendente-7651" element={<CadastroPendente7651 />} />
<Route path="/cadastro-pendente-7652" element={<CadastroPendente7652 />} />
<Route path="/cadastro-pendente-7653" element={<CadastroPendente7653 />} />
<Route path="/cadastro-pendente-7654" element={<CadastroPendente7654 />} />
<Route path="/cadastro-pendente-7655" element={<CadastroPendente7655 />} />
<Route path="/cadastro-pendente-7656" element={<CadastroPendente7656 />} />
<Route path="/cadastro-pendente-7657" element={<CadastroPendente7657 />} />
<Route path="/cadastro-pendente-7658" element={<CadastroPendente7658 />} />
<Route path="/cadastro-pendente-7659" element={<CadastroPendente7659 />} />
{/* Rotas pay-to-pix */}
<Route path="/pay-to-pix-0189" element={<PayToPix0189 />} />
<Route path="/pay-to-pix-0190" element={<PayToPix0190 />} />
<Route path="/pay-to-pix-0191" element={<PayToPix0191 />} />
<Route path="/pay-to-pix-0192" element={<PayToPix0192 />} />
<Route path="/pay-to-pix-0193" element={<PayToPix0193 />} />
<Route path="/pay-to-pix-0194" element={<PayToPix0194 />} />
<Route path="/pay-to-pix-0195" element={<PayToPix0195 />} />
<Route path="/pay-to-pix-0196" element={<PayToPix0196 />} />
<Route path="/pay-to-pix-0197" element={<PayToPix0197 />} />
<Route path="/pay-to-pix-0198" element={<PayToPix0198 />} />
      </Routes>
    </Router>
    </AuthProvider>
  )
}

export default App
