import { useState } from 'react'
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ArrowLeft, TrendingUp, Upload, CheckCircle } from 'lucide-react'
import { getTranslation } from '../utils/translations'

const countries = [
  'Brasil', 'Paraguay', 'Argentina', 'Estados Unidos', 'China', 'Tailândia', 'França', 'Outro'
]

export default function RegisterPage({ language }) {
  const navigate = useNavigate()
  const t = (key) => getTranslation(language, key)
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    nationality: '',
    deliveryMethod: 'bank', // 'bank' or 'pickup'
    bankName: '',
    bankAccount: '',
    bankAgency: '',
    accountHolder: '',
  })
  
  const [documentFile, setDocumentFile] = useState(null)
  const [selfieFile, setSelfieFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      if (type === 'document') {
        setDocumentFile(file)
      } else {
        setSelfieFile(file)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const docRef = await addDoc(collection(db, "leads"), {
        ...formData,
        documentFileName: documentFile?.name || null,
        selfieFileName: selfieFile?.name || null,
        status: 'pending_approval',
        createdAt: new Date().toISOString(),
      });
      alert("Cadastro enviado com sucesso para o Firebase! Aguarde a verificação.");
      navigate(`/verify/${docRef.id}`);
    } catch (error) {
      console.error("Erro ao adicionar documento ao Firebase: ", error);
      alert("Erro ao enviar cadastro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                CambioExpress
              </span>
            </Link>
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </header>

      {/* Registration Form */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Cadastro de Usuário
            </h1>
            <p className="text-muted-foreground">
              Preencha seus dados para criar sua conta
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Todos os campos são obrigatórios para garantir a segurança da transação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">{t('fullName')} *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      placeholder="João Silva"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t('email')} *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="joao@exemplo.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('phone')} *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+55 11 99999-9999"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nationality">{t('nationality')} *</Label>
                    <Select
                      value={formData.nationality}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, nationality: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">{t('address')} *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="Rua Exemplo, 123 - Cidade, Estado"
                  />
                </div>

                {/* Delivery Method */}
                <div className="space-y-4 pt-4 border-t">
                  <Label className="text-lg font-semibold">
                    {t('deliveryTitle')}
                  </Label>
                  <RadioGroup
                    value={formData.deliveryMethod}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, deliveryMethod: value }))}
                  >
                    <div className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-slate-50 cursor-pointer">
                      <RadioGroupItem value="bank" id="bank" />
                      <Label htmlFor="bank" className="cursor-pointer flex-1">
                        <div className="font-medium">{t('deliveryBank')}</div>
                        <div className="text-sm text-muted-foreground">
                          Receba o valor diretamente em sua conta bancária
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-slate-50 cursor-pointer">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="cursor-pointer flex-1">
                        <div className="font-medium">{t('deliveryPickup')}</div>
                        <div className="text-sm text-muted-foreground">
                          Retire o dinheiro em espécie em nossa sede
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Bank Information (only if bank delivery selected) */}
                {formData.deliveryMethod === 'bank' && (
                  <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold">Dados Bancários</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bankName">Banco *</Label>
                        <Input
                          id="bankName"
                          name="bankName"
                          value={formData.bankName}
                          onChange={handleInputChange}
                          required
                          placeholder="Nome do Banco"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountHolder">Titular da Conta *</Label>
                        <Input
                          id="accountHolder"
                          name="accountHolder"
                          value={formData.accountHolder}
                          onChange={handleInputChange}
                          required
                          placeholder="Nome do Titular"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bankAgency">Agência *</Label>
                        <Input
                          id="bankAgency"
                          name="bankAgency"
                          value={formData.bankAgency}
                          onChange={handleInputChange}
                          required
                          placeholder="0001"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bankAccount">Conta *</Label>
                        <Input
                          id="bankAccount"
                          name="bankAccount"
                          value={formData.bankAccount}
                          onChange={handleInputChange}
                          required
                          placeholder="12345-6"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Document Upload */}
                <div className="space-y-4 pt-4 border-t">
                  <Label className="text-lg font-semibold">
                    Verificação de Identidade
                  </Label>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="document">{t('document')} *</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-slate-50 cursor-pointer">
                        <input
                          id="document"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange(e, 'document')}
                          className="hidden"
                          required
                        />
                        <label htmlFor="document" className="cursor-pointer">
                          {documentFile ? (
                            <div className="flex items-center justify-center gap-2 text-green-600">
                              <CheckCircle className="w-5 h-5" />
                              <span className="text-sm">{documentFile.name}</span>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                Clique para fazer upload
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                RG, CNH ou Passaporte
                              </p>
                            </>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="selfie">{t('selfie')} *</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-slate-50 cursor-pointer">
                        <input
                          id="selfie"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'selfie')}
                          className="hidden"
                          required
                        />
                        <label htmlFor="selfie" className="cursor-pointer">
                          {selfieFile ? (
                            <div className="flex items-center justify-center gap-2 text-green-600">
                              <CheckCircle className="w-5 h-5" />
                              <span className="text-sm">{selfieFile.name}</span>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                Clique para fazer upload
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Foto segurando o documento
                              </p>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 'Processando...' : 'Continuar para Verificação'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

