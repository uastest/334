import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function RegisterStep1({ formData, onDataChange, onNext, loading }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [errors, setErrors] = useState({})

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const calculatePasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z\d]/.test(password)) strength++
    return strength
  }

  const handlePasswordChange = (e) => {
    const password = e.target.value
    onDataChange('password', password)
    setPasswordStrength(calculatePasswordStrength(password))
  }

  const validateStep = () => {
    const newErrors = {}

    if (!formData.fullName?.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório'
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = 'Telefone é obrigatório'
    }

    if (!formData.password?.trim()) {
      newErrors.password = 'Senha é obrigatória'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Senha deve ter no mínimo 8 caracteres'
    }

    if (!formData.confirmPassword?.trim()) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      onNext()
    }
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500'
    if (passwordStrength <= 2) return 'bg-orange-500'
    if (passwordStrength <= 3) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Fraca'
    if (passwordStrength <= 2) return 'Média'
    if (passwordStrength <= 3) return 'Boa'
    return 'Forte'
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Informações Pessoais
        </h2>
        <p className="text-muted-foreground">
          Comece criando sua conta com seus dados básicos
        </p>
      </div>

      <Card className="shadow-lg border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Dados Básicos</CardTitle>
          <CardDescription>
            Preencha seus dados pessoais para criar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nome Completo */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="font-medium">
              Nome Completo *
            </Label>
            <Input
              id="fullName"
              placeholder="João Silva Santos"
              value={formData.fullName || ''}
              onChange={(e) => onDataChange('fullName', e.target.value)}
              className={`${errors.fullName ? 'border-red-500' : ''}`}
            />
            {errors.fullName && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="font-medium">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu.email@exemplo.com"
              value={formData.email || ''}
              onChange={(e) => onDataChange('email', e.target.value)}
              className={`${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="font-medium">
              Telefone *
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+55 11 99999-9999"
              value={formData.phone || ''}
              onChange={(e) => onDataChange('phone', e.target.value)}
              className={`${errors.phone ? 'border-red-500' : ''}`}
            />
            {errors.phone && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.phone}
              </p>
            )}
          </div>

          {/* Divisor */}
          <div className="border-t pt-6 mt-6">
            <h3 className="font-semibold mb-4">Segurança da Conta</h3>
          </div>

          {/* Senha */}
          <div className="space-y-2">
            <Label htmlFor="password" className="font-medium">
              Senha *
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Crie uma senha segura"
                value={formData.password || ''}
                onChange={handlePasswordChange}
                className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Indicador de força da senha */}
            {formData.password && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getPasswordStrengthColor()} transition-all`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use letras maiúsculas, minúsculas, números e símbolos para uma senha mais forte
                </p>
              </div>
            )}

            {errors.password && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirmar Senha */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="font-medium">
              Confirmar Senha *
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Repita sua senha"
                value={formData.confirmPassword || ''}
                onChange={(e) => onDataChange('confirmPassword', e.target.value)}
                className={`pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Senhas coincidem
              </p>
            )}

            {errors.confirmPassword && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Aviso de Segurança */}
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Sua senha é armazenada com segurança e nunca será compartilhada. Use uma senha única e forte.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Botão de Próximo */}
      <Button
        onClick={handleNext}
        disabled={loading}
        size="lg"
        className="w-full"
      >
        {loading ? 'Processando...' : 'Próximo'}
      </Button>
    </div>
  )
}
