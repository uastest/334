import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, CheckCircle, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function RegisterStep3({ formData, onDataChange, onNext, onPrevious, loading }) {
  const [errors, setErrors] = useState({})

  const handleFileChange = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      // Validar tamanho do arquivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          [type]: 'Arquivo muito grande. Máximo 5MB.'
        }))
        return
      }

      // Validar tipo de arquivo
      const validTypes = type === 'document' 
        ? ['image/jpeg', 'image/png', 'application/pdf']
        : ['image/jpeg', 'image/png']

      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          [type]: `Tipo de arquivo inválido. Use ${validTypes.join(', ')}`
        }))
        return
      }

      onDataChange(type === 'document' ? 'documentFile' : 'selfieFile', file)
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[type]
        return newErrors
      })
    }
  }

  const validateStep = () => {
    const newErrors = {}

    if (!formData.documentFile) {
      newErrors.document = 'Verso é obrigatório'
    }

    if (!formData.selfieFile) {
      newErrors.selfie = 'Verso é obrigatório'
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
          Verificação de Identidade
        </h2>
        <p className="text-muted-foreground">
          Precisamos verificar sua identidade para garantir segurança
        </p>
      </div>

      {/* Aviso de Segurança */}
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Seus documentos são protegidos com criptografia de ponta a ponta e armazenados em servidores seguros. Somente você pode acessá-los — nenhuma informação é compartilhada com terceiros, em nenhuma circunstância
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Documentos Necessários</CardTitle>
          <CardDescription>
            Faça upload de uma cópia clara de seus documentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Documento de Identidade */}
          <div className="space-y-2">
            <Label className="font-medium">
              Frente do seu documento *
            </Label>
            <p className="text-sm text-muted-foreground mb-3">
              RG, CNH, Passaporte ou outro documento oficial
            </p>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                errors.document
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              } cursor-pointer`}
            >
              <input
                id="document"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileChange(e, 'document')}
                className="hidden"
              />
              <label htmlFor="document" className="cursor-pointer block">
                {formData.documentFile ? (
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <CheckCircle className="w-8 h-8" />
                    <div className="text-left">
                      <p className="font-medium">{formData.documentFile.name}</p>
                      <p className="text-xs text-green-500">
                        {(formData.documentFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="font-medium text-foreground">
                      Clique para fazer upload
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      ou arraste o arquivo aqui
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Máximo 5MB • JPEG, PNG ou PDF
                    </p>
                  </>
                )}
              </label>
            </div>
            {errors.document && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.document}
              </p>
            )}
          </div>

          {/* Selfie com Documento */}
          <div className="space-y-2">
            <Label className="font-medium">
              Verso do documento *
            </Label>
            <p className="text-sm text-muted-foreground mb-3">
             RG, CNH, Passaporte ou outro documento oficial
            </p>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                errors.selfie
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              } cursor-pointer`}
            >
              <input
                id="selfie"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'selfie')}
                className="hidden"
              />
              <label htmlFor="selfie" className="cursor-pointer block">
                {formData.selfieFile ? (
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <CheckCircle className="w-8 h-8" />
                    <div className="text-left">
                      <p className="font-medium">{formData.selfieFile.name}</p>
                      <p className="text-xs text-green-500">
                        {(formData.selfieFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="font-medium text-foreground">
                      Clique para fazer upload
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      ou arraste o arquivo aqui
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Máximo 5MB • JPEG ou PNG
                    </p>
                  </>
                )}
              </label>
            </div>
            {errors.selfie && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.selfie}
              </p>
            )}
          </div>

          {/* Dicas */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="font-medium text-sm">💡 Dicas para melhor qualidade:</p>
            <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
              <li>Use boa iluminação e evite reflexos</li>
              <li>Certifique-se de que o documento está legível</li>
              <li>Arquivos claros e nítidos são processados mais rapidamente</li>
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
