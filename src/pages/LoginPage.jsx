import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowRight, TrendingUp, Mail, Lock, Eye, EyeOff, LogIn, UserPlus, Chrome, Facebook, Github } from 'lucide-react'
import { getTranslation } from '../utils/translations'
import { cn } from '@/lib/utils'
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
      // Se o login for bem-sucedido, redireciona para o dashboard
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
    <form onSubmit={handleSubmit} className="space-y-6">

      <div className="space-y-2">
        <Label htmlFor="email">{t('email')}</Label>
        <div className="relative" id="email-input">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="seu.email@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t('password')}</Label>
        <div className="relative" id="password-input">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox id="remember-me" />
          <Label htmlFor="remember-me" className="text-sm font-normal">
            {t('rememberMe')}
          </Label>
        </div>
        <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          {t('forgotPassword')}
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full gap-2 transition-transform hover:scale-[1.005]" disabled={isSubmitting}>
        <LogIn className="w-4 h-4" />
        {isSubmitting ? t('loggingIn') : t('login')}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">
            {t('orContinueWith')}
          </span>
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <Button variant="outline" className="w-full gap-2">
          <Chrome className="w-4 h-4" />
          {t('loginWithGoogle')}
        </Button>
        <Button variant="outline" className="w-full gap-2">
          <Facebook className="w-4 h-4" />
          {t('loginWithFacebook')}
        </Button>
        <Button variant="outline" className="w-full gap-2">
          <Github className="w-4 h-4" />
          {t('loginWithGithub')}
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        {t('noAccount')}
        <button
          type="button"
          onClick={toggleForm}
          className="ml-1 font-medium text-blue-600 hover:text-blue-700 transition-colors"
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
        navigate('/cadastro-pendente')
      }
    } catch (err) {
      setError(t('registrationError') + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <div className="space-y-2">
        <Label htmlFor="reg-email">{t('email')}</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="reg-email"
            type="email"
            placeholder="seu.email@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-password">{t('password')}</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="reg-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full gap-2 transition-transform hover:scale-[1.005]" disabled={isSubmitting}>
        <UserPlus className="w-4 h-4" />
        {isSubmitting ? t('registering') : t('createAccount')}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        {t('alreadyHaveAccount')}
        <button
          type="button"
          onClick={toggleForm}
          className="ml-1 font-medium text-blue-600 hover:text-blue-700 transition-colors"
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">

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

      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-xl overflow-hidden grid md:grid-cols-2">

        <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-white p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold">CambioExpress</span>
          </Link>

          <div>
            <h2 className="text-3xl font-bold leading-snug">
              {t('loginMarketingTitle')}
            </h2>
            <p className="text-blue-200">
              {t('loginMarketingSubtitle')}
            </p>
          </div>

          <div className="text-sm text-blue-200">
            &copy; {new Date().getFullYear()} CambioExpress.
          </div>
        </div>

        <div className={cn("p-8 md:p-12 form-enter", isLoginView && 'form-enter-active')}>
          <Card className="border-none shadow-none">
            <CardHeader className="text-center p-0 mb-6">
              <CardTitle className="text-3xl font-bold">
                {isLoginView ? t('welcomeBack') : t('createAccount')}
              </CardTitle>
              <CardDescription>
                {isLoginView ? t('loginToContinue') : t('registerToStart')}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              {isLoginView ? (
                <LoginForm t={t} navigate={navigate} toggleForm={() => setIsLoginView(false)} />
              ) : (
                <RegisterForm t={t} navigate={navigate} toggleForm={() => setIsLoginView(true)} />
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
