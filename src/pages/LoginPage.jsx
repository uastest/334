import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowRight, TrendingUp, Mail, Lock, Eye, EyeOff, LogIn, UserPlus, ArrowLeft } from 'lucide-react'
import { getTranslation } from '../utils/translations'
import { useAuth } from '../hooks/use-auth'

// ===============================
// LOGIN FORM
// ===============================
const LoginForm = ({ t, navigate, toggleForm }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const user = await login(email, password)
      if (user) {
        navigate('/dashboard')
      }
    } catch (err) {
      if (err.message === 'pending_approval') {
        setError(t('pendingApprovalMessage'))
      } else if (err.message === 'rejected') {
        setError(t('rejectedMessage'))
      } else if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password'
      ) {
        setError(t('invalidCredentials'))
      } else {
        setError(t('loginError') + err.message)
      }

      const emailEl = document.getElementById('email-input')
      const passEl = document.getElementById('password-input')

      emailEl?.classList.add('shake')
      passEl?.classList.add('shake')

      setTimeout(() => {
        emailEl?.classList.remove('shake')
        passEl?.classList.remove('shake')
      }, 500)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-bold text-gray-800">{t('email')}</Label>
        <div className="relative" id="email-input">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="seu.email@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-12 py-6 border-2 border-gray-200 focus:border-blue-500 focus:ring-0 rounded-lg font-medium text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 transition-all"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-bold text-gray-800">{t('password')}</Label>
        <div className="relative" id="password-input">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-12 pr-12 py-6 border-2 border-gray-200 focus:border-blue-500 focus:ring-0 rounded-lg font-medium text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 transition-all"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="remember-me" className="border-2 border-gray-300" />
          <Label htmlFor="remember-me" className="text-sm font-medium text-gray-700 cursor-pointer">
            {t('rememberMe')}
          </Label>
        </div>
        <Link to="/contact" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
          {t('forgotPassword')}
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-bold py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 gap-2 uppercase tracking-wider border-0 text-base"
      >
        <LogIn className="w-5 h-5" />
        {isSubmitting ? t('loggingIn') : t('login')}
      </Button>

      <div className="text-center text-sm text-gray-700 pt-2">
        {t('noAccount')}
        <button
          type="button"
          onClick={() => navigate('/#/register')}
          className="ml-2 font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          {t('register')}
        </button>
      </div>
    </form>
  )
}

// ===============================
// REGISTER FORM
// ===============================
const RegisterForm = ({ t, navigate, toggleForm }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const user = await register(email, password)
      if (user) {
        // Redireciona para RegisterPage com dados
        navigate('/register', { state: { email, password } })
      }
    } catch (err) {
      setError(t('registrationError') + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="reg-email" className="text-sm font-bold text-gray-800">{t('email')}</Label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="reg-email"
            type="email"
            placeholder="seu.email@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-12 py-6 border-2 border-gray-200 focus:border-blue-500 focus:ring-0 rounded-lg font-medium text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 transition-all"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-password" className="text-sm font-bold text-gray-800">{t('password')}</Label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="reg-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-12 pr-12 py-6 border-2 border-gray-200 focus:border-blue-500 focus:ring-0 rounded-lg font-medium text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 transition-all"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-bold py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 gap-2 uppercase tracking-wider border-0 text-base"
      >
        <UserPlus className="w-5 h-5" />
        {isSubmitting ? t('registering') : t('createAccount')}
      </Button>

      <div className="text-center text-sm text-gray-700 pt-2">
        {t('alreadyHaveAccount')}
        <button
          type="button"
          onClick={toggleForm}
          className="ml-2 font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          {t('login')}
        </button>
      </div>
    </form>
  )
}

// ===============================
// LOGIN PAGE
// ===============================
export default function LoginPage({ language }) {
  const navigate = useNavigate()
  const t = (key) => getTranslation(language, key)
  const [isLoginView, setIsLoginView] = useState(true)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4">
      <style>
        {`
          .form-enter {
            opacity: 0;
            transform: translateY(20px);
          }
          .form-enter-active {
            opacity: 1;
            transform: translateY(0);
            transition: opacity 400ms ease-out, transform 400ms ease-out;
          }
          .shake {
            animation: shake 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) both;
          }
          @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(+2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(+4px, 0, 0); }
          }
        `}
      </style>

      <div className="w-full max-w-md">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity mb-6">
                <div className="bg-white p-2 rounded-lg shadow-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600 font-bold" />
                </div>
                <span className="text-2xl font-black">CambioExpress</span>
              </Link>

              <h1 className="text-3xl font-black mb-2">
                {isLoginView ? t('welcomeBack') : t('createAccount')}
              </h1>
              <p className="text-blue-100 font-semibold">
                {isLoginView ? t('loginToContinue') : t('registerToStart')}
              </p>
            </div>
          </div>

          {/* FORM */}
          <div className="p-8">
            <div className={`form-enter ${isLoginView && 'form-enter-active'}`}>
              {isLoginView ? (
                <LoginForm t={t} navigate={navigate} toggleForm={() => setIsLoginView(false)} />
              ) : (
                <RegisterForm t={t} navigate={navigate} toggleForm={() => setIsLoginView(true)} />
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 text-center text-sm text-gray-600">
            &copy; {new Date().getFullYear()} CambioExpress. Todos os direitos reservados.
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-700 hover:text-blue-600 font-semibold transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar para Home
          </Link>
        </div>
      </div>
    </div>
  )
}
