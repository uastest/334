import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

const brazilianBanks = [
  'Banco do Brasil',
  'Caixa Econômica Federal',
  'Bradesco',
  'Itaú Unibanco',
  'Santander',
  'Banco Safra',
  'Banco Votorantim',
  'Inter',
  'Nubank',
  'C6 Bank',
  'Outro'
]

export default function RegisterStep5({ formData, onDataChange, onNext, onPrevious, loading }) {
  const [errors, setErrors] = useState({})

  const validateStep = () => {
    const newErrors = {}

    if (!formData.bankName?.trim()) {
      newErrors.bankName = 'Nome do banco é obrigatório'
    }

    if (!formData.bankAgency?.trim()) {
      newErrors.bankAgency = 'Agência é obrigatória'
    } else if (!/^\d{4,5}$/.test(formData.bankAgency.replace(/\D/g, ''))) {
      newErrors.bankAgency = 'Agência inválida (4-5 dígitos)'
    }

    if (!formData.bankAccount?.trim()) {
      newErrors.bankAccount = 'Número da conta é obrigatório'
    } else if (formData.bankAccount.replace(/\D/g, '').length < 5) {
      newErrors.bankAccount = 'Número da conta inválido'
    }

    if (!formData.accountHolder?.trim()) {
      newErrors.accountHolder = 'Nome do titular é obrigatório'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      onNext()
    }
  }

  const formatAgency = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 4) return numbers
    return numbers.slice(0, 5)
  }

  const formatAccount = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 5) return numbers
    if (numbers.length <= 8) return `${numbers.slice(0, 5)}-${numbers.slice(5)}`
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Dados Bancários
        </h2>
        <p className="text-muted-foreground">
          Informações para transferência segura
        </p>
      </div>

      {/* Aviso de Segurança */}
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Seus dados bancários são criptografados e protegidos. Nunca os compartilharemos com terceiros.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Informações da Conta Bancária</CardTitle>
          <CardDescription>
            Preencha com os dados da conta onde deseja receber a transferência
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nome do Banco */}
          <div className="space-y-2">
            <Label htmlFor="bankName" className="font-medium">
              Banco *
            </Label>
            <div className="relative">
              <Input
                id="bankName"
                list="banks"
                placeholder="Digite ou selecione seu banco"
                value={formData.bankName || ''}
                onChange={(e) => onDataChange('bankName', e.target.value)}
                className={`${errors.bankName ? 'border-red-500' : ''}`}
              />
              <datalist id="banks">
                {brazilianBanks.map((bank) => (
                  <option key={bank} value={bank} />
                ))}
              </datalist>
            </div>
            {errors.bankName && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.bankName}
              </p>
            )}
          </div>

          {/* Grid para Agência e Conta */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Agência */}
            <div className="space-y-2">
              <Label htmlFor="bankAgency" className="font-medium">
                Agência *
              </Label>
              <Input
                id="bankAgency"
                placeholder="0001"
                value={formData.bankAgency || ''}
                onChange={(e) => onDataChange('bankAgency', formatAgency(e.target.value))}
                maxLength="5"
                className={`${errors.bankAgency ? 'border-red-500' : ''}`}
              />
              {errors.bankAgency && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.bankAgency}
                </p>
              )}
            </div>

            {/* Número da Conta */}
            <div className="space-y-2">
              <Label htmlFor="bankAccount" className="font-medium">
                Número da Conta *
              </Label>
              <Input
                id="bankAccount"
                placeholder="12345-6"
                value={formData.bankAccount || ''}
                onChange={(e) => onDataChange('bankAccount', formatAccount(e.target.value))}
                className={`${errors.bankAccount ? 'border-red-500' : ''}`}
              />
              {errors.bankAccount && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.bankAccount}
                </p>
              )}
            </div>
          </div>

          {/* Titular da Conta */}
          <div className="space-y-2">
            <Label htmlFor="accountHolder" className="font-medium">
              Titular da Conta *
            </Label>
            <Input
              id="accountHolder"
              placeholder="Nome completo do titular"
              value={formData.accountHolder || ''}
              onChange={(e) => onDataChange('accountHolder', e.target.value)}
              className={`${errors.accountHolder ? 'border-red-500' : ''}`}
            />
            {errors.accountHolder && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.accountHolder}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Deve ser o mesmo nome registrado no banco
            </p>
          </div>

          {/* Checklist de Verificação */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="font-medium text-sm">✓ Verifique antes de continuar:</p>
            <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
              <li>Agência: 4-5 dígitos</li>
              <li>Conta: número correto com dígito verificador</li>
              <li>Titular: exatamente como aparece no banco</li>
              <li>Sem espaços ou caracteres especiais desnecessários</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Botões de Navegação */}
      <div className="flex gap-3">
        <Button
          onClick={onPrevious}
          variant="outline"
          size="lg"
          className="flex-1"
          disabled={loading}
        >
          Voltar
        </Button>
        <Button
          onClick={handleNext}
          disabled={loading}
          size="lg"
          className="flex-1"
        >
          {loading ? 'Processando...' : 'Próximo'}
        </Button>
      </div>
    </div>
  )
}
