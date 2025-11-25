import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle } from 'lucide-react'

const countries = [
  'Brasil',
  'Paraguay',
  'Argentina',
  'Estados Unidos',
  'China',
  'Tailândia',
  'França',
  'Outro'
]

export default function RegisterStep2({ formData, onDataChange, onNext, onPrevious, loading }) {
  const [errors, setErrors] = useState({})

  const validateStep = () => {
    const newErrors = {}

    if (!formData.address?.trim()) {
      newErrors.address = 'Endereço é obrigatório'
    }

    if (!formData.nationality) {
      newErrors.nationality = 'Nacionalidade é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Informações Adicionais
        </h2>
        <p className="text-muted-foreground">
          Agora vamos coletar alguns dados complementares
        </p>
      </div>

      <Card className="shadow-lg border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Localização e Nacionalidade</CardTitle>
          <CardDescription>
            Esses dados nos ajudam a oferecer o melhor serviço para você
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Endereço */}
          <div className="space-y-2">
            <Label htmlFor="address" className="font-medium">
              Endereço Completo *
            </Label>
            <Input
              id="address"
              placeholder="Rua Exemplo, 123 - Apto 45 - Cidade, Estado"
              value={formData.address || ''}
              onChange={(e) => onDataChange('address', e.target.value)}
              className={`${errors.address ? 'border-red-500' : ''}`}
            />
            {errors.address && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.address}
              </p>
            )}
          </div>

          {/* Nacionalidade */}
          <div className="space-y-2">
            <Label htmlFor="nationality" className="font-medium">
              Nacionalidade *
            </Label>
            <Select
              value={formData.nationality || ''}
              onValueChange={(value) => onDataChange('nationality', value)}
            >
              <SelectTrigger className={`${errors.nationality ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Selecione sua nacionalidade" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.nationality && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.nationality}
              </p>
            )}
          </div>

          {/* Informação adicional */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-900">
              <strong>ℹ️ Informação:</strong> Os dados bancários serão solicitados apenas após a verificação de identidade, garantindo sua segurança.
            </p>
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
