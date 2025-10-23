import { useState, useEffect } from 'react'
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { TrendingUp, Users, CreditCard, CheckCircle, XCircle, Eye, Send, RefreshCw } from 'lucide-react'

export default function AdminPanel() {
  const [users, setUsers] = useState([])
  const [transactions, setTransactions] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [paymentLinkInput, setPaymentLinkInput] = useState('')
  const [paymentInfoInput, setPaymentInfoInput] = useState({
    type: 'pix',
    pixCode: '',
    bankName: '',
    agency: '',
    account: '',
    accountHolder: '',
    cnpj: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    // Listener para leads
    const unsubscribeLeads = onSnapshot(collection(db, "leads"), (snapshot) => {
      const leadsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(leadsData);
    });

    // Listener para transações
    const unsubscribeTransactions = onSnapshot(collection(db, "transactions"), (snapshot) => {
      const transactionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(transactionsData);
    });

    return () => {
      unsubscribeLeads();
      unsubscribeTransactions();
    };
  };

  const approveUser = async (userId) => {
    const userRef = doc(db, "leads", userId);
    await updateDoc(userRef, {
      status: 'approved',
      approvedAt: new Date().toISOString()
    });
  };

  const rejectUser = async (userId) => {
    const userRef = doc(db, "leads", userId);
    await updateDoc(userRef, {
      status: 'rejected',
      rejectedAt: new Date().toISOString()
    });
  };

  const toggleUserStatus = async (userId) => {
    const userRef = doc(db, "leads", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const currentStatus = userSnap.data().status;
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await updateDoc(userRef, { status: newStatus });
    }
  };

  const sendPaymentLink = async (transactionId) => {
    const transactionRef = doc(db, "transactions", transactionId);
    await updateDoc(transactionRef, {
      paymentLink: paymentLinkInput,
      status: 'awaiting_payment',
      paymentLinkSentAt: new Date().toISOString()
    });
    setPaymentLinkInput('');
  };

  const sendPaymentInfo = async (transactionId) => {
    const transactionRef = doc(db, "transactions", transactionId);
    await updateDoc(transactionRef, {
      paymentInfo: paymentInfoInput,
      status: 'awaiting_payment',
      paymentInfoSentAt: new Date().toISOString()
    });
    setPaymentInfoInput({
      type: 'pix',
      pixCode: '',
      bankName: '',
      agency: '',
      account: '',
      accountHolder: '',
      cnpj: '',
    });
  };

  const approveTransaction = async (transactionId) => {
    const transactionRef = doc(db, "transactions", transactionId);
    await updateDoc(transactionRef, {
      status: 'approved',
      approvedAt: new Date().toISOString()
    });
  };

  const rejectTransaction = async (transactionId) => {
    const transactionRef = doc(db, "transactions", transactionId);
    await updateDoc(transactionRef, {
      status: 'rejected',
      rejectedAt: new Date().toISOString()
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending_approval: { variant: 'secondary', label: 'Pendente' },
      approved: { variant: 'default', label: 'Aprovado' },
      rejected: { variant: 'destructive', label: 'Rejeitado' },
      verified: { variant: 'default', label: 'Verificado' },
      pending_payment: { variant: 'secondary', label: 'Aguardando Pagamento' },
      awaiting_payment: { variant: 'secondary', label: 'Aguardando Pagamento' },
      payment_confirmed: { variant: 'default', label: 'Pagamento Confirmado' },
      active: { variant: 'default', label: 'Ativo' },
      inactive: { variant: 'secondary', label: 'Inativo' },
    }
    const config = variants[status] || { variant: 'secondary', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
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
                CambioExpress Admin
              </span>
            </Link>
            <Button variant="outline" onClick={loadData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>
      </header>

      {/* Admin Panel Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Painel de Administração</h1>
          <p className="text-muted-foreground">
            Gerencie usuários, transações e aprovações
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Usuários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Usuários Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {users.filter(u => u.status === 'pending_approval').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Transações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Transações Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {transactions.filter(t => t.status === 'pending_payment' || t.status === 'payment_confirmed').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="transactions">
              <CreditCard className="w-4 h-4 mr-2" />
              Transações
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Usuários</CardTitle>
                <CardDescription>
                  Visualize e aprove cadastros de usuários
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhum usuário cadastrado
                    </p>
                  ) : (
                    users.map((user) => (
                      <div key={user.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{user.fullName}</h3>
                              {getStatusBadge(user.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <p className="text-sm text-muted-foreground">{user.phone}</p>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedUser(user)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Ver Detalhes
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Detalhes do Usuário</DialogTitle>
                                <DialogDescription>
                                  ID: {user.id}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <Label>Nome Completo</Label>
                                    <p className="font-medium">{user.fullName}</p>
                                  </div>
                                  <div>
                                    <Label>E-mail</Label>
                                    <p className="font-medium">{user.email}</p>
                                  </div>
                                  <div>
                                    <Label>Telefone</Label>
                                    <p className="font-medium">{user.phone}</p>
                                  </div>
                                  <div>
                                    <Label>Nacionalidade</Label>
                                    <p className="font-medium">{user.nationality}</p>
                                  </div>
                                </div>
                                <div>
                                  <Label>Endereço</Label>
                                  <p className="font-medium">{user.address}</p>
                                </div>
                                <div>
                                  <Label>Método de Entrega</Label>
                                  <p className="font-medium">
                                    {user.deliveryMethod === 'bank' ? 'Transferência Bancária' : 'Retirada na Sede'}
                                  </p>
                                </div>
                                {user.deliveryMethod === 'bank' && (
                                  <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                                    <h4 className="font-semibold">Dados Bancários</h4>
                                    <p className="text-sm"><span className="font-medium">Banco:</span> {user.bankName}</p>
                                    <p className="text-sm"><span className="font-medium">Agência:</span> {user.bankAgency}</p>
                                    <p className="text-sm"><span className="font-medium">Conta:</span> {user.bankAccount}</p>
                                    <p className="text-sm"><span className="font-medium">Titular:</span> {user.accountHolder}</p>
                                  </div>
                                )}
                                <div className="space-y-2">
                                  <Label>Documentos</Label>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="border rounded p-2 text-sm">
                                      <p className="font-medium">Documento:</p>
                                      <p className="text-muted-foreground">{user.documentFile || 'Não enviado'}</p>
                                    </div>
                                    <div className="border rounded p-2 text-sm">
                                      <p className="font-medium">Selfie:</p>
                                      <p className="text-muted-foreground">{user.selfieFile || 'Não enviado'}</p>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <Label>Status</Label>
                                  <div className="mt-1">{getStatusBadge(user.status)}</div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                        
                        <div className="flex gap-2">
                          {user.status === 'pending_approval' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => approveUser(user.id)}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Aprovar
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => rejectUser(user.id)}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Rejeitar
                              </Button>
                            </>
                          )}
                          {(user.status === 'approved' || user.status === 'active' || user.status === 'inactive') && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleUserStatus(user.id)}
                            >
                              {user.status === 'active' ? 'Desativar' : 'Ativar'}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Transações</CardTitle>
                <CardDescription>
                  Visualize, aprove e envie links de pagamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhuma transação registrada
                    </p>
                  ) : (
                    transactions.map((transaction) => (
                      <div key={transaction.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">
                                {transaction.amount} {transaction.fromCurrency} → {transaction.convertedAmount} {transaction.toCurrency}
                              </h3>
                              {getStatusBadge(transaction.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              ID: {transaction.id}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Criado em: {new Date(transaction.createdAt).toLocaleString('pt-BR')}
                            </p>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedTransaction(transaction)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Ver Detalhes
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Detalhes da Transação</DialogTitle>
                                <DialogDescription>
                                  ID: {transaction.id}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <Label>Valor Enviado</Label>
                                    <p className="font-medium">{transaction.amount} {transaction.fromCurrency}</p>
                                  </div>
                                  <div>
                                    <Label>Valor Recebido</Label>
                                    <p className="font-medium">{transaction.convertedAmount} {transaction.toCurrency}</p>
                                  </div>
                                  <div>
                                    <Label>Taxa de Câmbio</Label>
                                    <p className="font-medium">{transaction.exchangeRate?.toFixed(4)}</p>
                                  </div>
                                  <div>
                                    <Label>Status</Label>
                                    <div className="mt-1">{getStatusBadge(transaction.status)}</div>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>

                        {transaction.status === 'pending_payment' && !transaction.paymentLink && !transaction.paymentInfo && (
                          <div className="space-y-3 border-t pt-3">
                            <Label>Enviar Link/Informações de Pagamento</Label>
                            <div className="space-y-2">
                              <Input
                                placeholder="Cole o link de pagamento aqui"
                                value={paymentLinkInput}
                                onChange={(e) => setPaymentLinkInput(e.target.value)}
                              />
                              <Button
                                size="sm"
                                onClick={() => sendPaymentLink(transaction.id)}
                                disabled={!paymentLinkInput}
                              >
                                <Send className="w-4 h-4 mr-2" />
                                Enviar Link
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">ou</p>
                            <div className="space-y-2">
                              <select
                                className="w-full border rounded p-2"
                                value={paymentInfoInput.type}
                                onChange={(e) => setPaymentInfoInput({...paymentInfoInput, type: e.target.value})}
                              >
                                <option value="pix">PIX</option>
                                <option value="bank">Transferência Bancária</option>
                              </select>
                              {paymentInfoInput.type === 'pix' ? (
                                <Input
                                  placeholder="Código PIX"
                                  value={paymentInfoInput.pixCode}
                                  onChange={(e) => setPaymentInfoInput({...paymentInfoInput, pixCode: e.target.value})}
                                />
                              ) : (
                                <div className="grid grid-cols-2 gap-2">
                                  <Input
                                    placeholder="Banco"
                                    value={paymentInfoInput.bankName}
                                    onChange={(e) => setPaymentInfoInput({...paymentInfoInput, bankName: e.target.value})}
                                  />
                                  <Input
                                    placeholder="Agência"
                                    value={paymentInfoInput.agency}
                                    onChange={(e) => setPaymentInfoInput({...paymentInfoInput, agency: e.target.value})}
                                  />
                                  <Input
                                    placeholder="Conta"
                                    value={paymentInfoInput.account}
                                    onChange={(e) => setPaymentInfoInput({...paymentInfoInput, account: e.target.value})}
                                  />
                                  <Input
                                    placeholder="Titular"
                                    value={paymentInfoInput.accountHolder}
                                    onChange={(e) => setPaymentInfoInput({...paymentInfoInput, accountHolder: e.target.value})}
                                  />
                                </div>
                              )}
                              <Button
                                size="sm"
                                onClick={() => sendPaymentInfo(transaction.id)}
                              >
                                <Send className="w-4 h-4 mr-2" />
                                Enviar Informações
                              </Button>
                            </div>
                          </div>
                        )}

                        {transaction.status === 'payment_confirmed' && (
                          <div className="flex gap-2 border-t pt-3">
                            <Button
                              size="sm"
                              onClick={() => approveTransaction(transaction.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Aprovar Transação
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => rejectTransaction(transaction.id)}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Rejeitar
                            </Button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}

