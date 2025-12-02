import { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './hooks/use-auth'

/* Componentes */
import ScrollToTop from './components/ScrollToTop'
import LanguageModal from './components/LanguageModal'

/* Páginas principais */
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

/* cadastro-pendente (7650–7659) */
import CadastroPendente7650 from './pages/CadastroPendente7650'
import CadastroPendente7651 from './pages/CadastroPendente7651'
import CadastroPendente7652 from './pages/CadastroPendente7652'
import CadastroPendente7653 from './pages/CadastroPendente7653'
import CadastroPendente7654 from './pages/CadastroPendente7654'
import CadastroPendente7655 from './pages/CadastroPendente7655'
import CadastroPendente7656 from './pages/CadastroPendente7656'
import CadastroPendente7657 from './pages/CadastroPendente7657'
import CadastroPendente7658 from './pages/CadastroPendente7658'
import CadastroPendente7659 from './pages/CadastroPendente7659'

/* PayToPix (0189–0198) */
import payToPix0189 from './pages/payToPix0189'
import payToPix0190 from './pages/payToPix0190'
import payToPix0191 from './pages/payToPix0191'
import payToPix0192 from './pages/payToPix0192'
import payToPix0193 from './pages/payToPix0193'
import payToPix0194 from './pages/payToPix0194'
import payToPix0195 from './pages/payToPix0195'
import payToPix0196 from './pages/payToPix0196'
import payToPix0197 from './pages/payToPix0197'
import payToPix0198 from './pages/payToPix0198'

function App() {
  const [showLanguageModal, setShowLanguageModal] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('pt-BR')

  useEffect(() => {
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

        <LanguageModal
          isOpen={showLanguageModal}
          onSelect={handleLanguageSelect}
        />

        <Routes>
          {/* Rotas principais */}
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

          {/* Rota oficial do cadastro-pendente principal */}
          <Route path="/cadastro-pendente" element={<PendingRegistrationPage language={selectedLanguage} />} />

          {/* Rota do PaymentGateway SEM .html (corrigida) */}
          <Route path="/payment-gateway/:pageId/:transactionId" element={<PaymentGatewayPage language={selectedLanguage} />} />

          {/* cadastro-pendente 7650–7659 */}
          <Route path="/cadastro-pendente-7650" element={<CadastroPendente7650 language={selectedLanguage} />} />
          <Route path="/cadastro-pendente-7651" element={<CadastroPendente7651 language={selectedLanguage} />} />
          <Route path="/cadastro-pendente-7652" element={<CadastroPendente7652 language={selectedLanguage} />} />
          <Route path="/cadastro-pendente-7653" element={<CadastroPendente7653 language={selectedLanguage} />} />
          <Route path="/cadastro-pendente-7654" element={<CadastroPendente7654 language={selectedLanguage} />} />
          <Route path="/cadastro-pendente-7655" element={<CadastroPendente7655 language={selectedLanguage} />} />
          <Route path="/cadastro-pendente-7656" element={<CadastroPendente7656 language={selectedLanguage} />} />
          <Route path="/cadastro-pendente-7657" element={<CadastroPendente7657 language={selectedLanguage} />} />
          <Route path="/cadastro-pendente-7658" element={<CadastroPendente7658 language={selectedLanguage} />} />
          <Route path="/cadastro-pendente-7659" element={<CadastroPendente7659 language={selectedLanguage} />} />

          {/* PayToPix 0189–0198 */}
          <Route path="/pay-to-pix-0189" element={<payToPix0189 language={selectedLanguage} />} />
          <Route path="/pay-to-pix-0190" element={<payToPix0190 language={selectedLanguage} />} />
          <Route path="/pay-to-pix-0191" element={<payToPix0191 language={selectedLanguage} />} />
          <Route path="/pay-to-pix-0192" element={<payToPix0192 language={selectedLanguage} />} />
          <Route path="/pay-to-pix-0193" element={<payToPix0193 language={selectedLanguage} />} />
          <Route path="/pay-to-pix-0194" element={<payToPix0194 language={selectedLanguage} />} />
          <Route path="/pay-to-pix-0195" element={<payToPix0195 language={selectedLanguage} />} />
          <Route path="/pay-to-pix-0196" element={<payToPix0196 language={selectedLanguage} />} />
          <Route path="/pay-to-pix-0197" element={<payToPix0197 language={selectedLanguage} />} />
          <Route path="/pay-to-pix-0198" element={<payToPix0198 language={selectedLanguage} />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
