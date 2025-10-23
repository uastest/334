import { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom' // ← Aqui trocamos BrowserRouter por HashRouter
import './App.css'

// 🏠 Páginas
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import VerifyPage from './pages/VerifyPage'
import PaymentPage from './pages/PaymentPage'
import ConfirmationPage from './pages/ConfirmationPage'
import PendingRegistrationPage from './pages/PendingRegistrationPage'
import PaymentGatewayPage from './pages/PaymentGatewayPage'
import AdminPanel from './pages/AdminPanel'
import ContactPage from './pages/ContactPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'

// 🌐 Componentes
import LanguageModal from './components/LanguageModal'

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
    <Router>
      {/* Modal de idioma */}
      <LanguageModal
        isOpen={showLanguageModal}
        onSelect={handleLanguageSelect}
      />

      {/* Rotas principais */}
      <Routes>
        <Route path="/" element={<HomePage language={selectedLanguage} />} />
        <Route path="/register" element={<RegisterPage language={selectedLanguage} />} />
        <Route path="/verify/:userId" element={<VerifyPage language={selectedLanguage} />} />
        <Route path="/payment/:transactionId" element={<PaymentPage language={selectedLanguage} />} />
        <Route path="/confirmation/:transactionId" element={<ConfirmationPage language={selectedLanguage} />} />
        <Route path="/admin-panel-secret" element={<AdminPanel language={selectedLanguage} />} />
        <Route path="/contact" element={<ContactPage language={selectedLanguage} />} />
        <Route path="/terms" element={<TermsPage language={selectedLanguage} />} />
        <Route path="/privacy" element={<PrivacyPage language={selectedLanguage} />} />
        <Route path="/cadastro-pendente" element={<PendingRegistrationPage />} />
        <Route path="/payment/:pageId.html" element={<PaymentGatewayPage />} />
      </Routes>
    </Router>
  )
}

export default App
