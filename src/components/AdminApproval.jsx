import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { getTranslation } from '../utils/translations'
import { Check, X, Loader2 } from 'lucide-react'

// Este componente simula a interface de administração para aprovação de usuários.
// A lógica de backend (Cloud Functions/Admin SDK) para desativar/reativar o usuário no Firebase Auth
// não pode ser implementada no frontend, mas a alteração do status no Firestore é o gatilho
// para que o frontend (useAuth) gerencie o acesso.

export default function AdminApproval({ language }) {
  const t = (key) => getTranslation(language, key)
  const [pendingUsers, setPendingUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState({}) // { uid: boolean }

  useEffect(() => {
    fetchPendingUsers()
  }, [])

  const fetchPendingUsers = async () => {
    setLoading(true)
    try {
      const usersRef = collection(db, 'users')
      // Busca usuários com status 'pending_approval'
      const q = query(usersRef, where('status', '==', 'pending_approval'))
      const querySnapshot = await getDocs(q)
      
      const users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toLocaleString() || 'N/A'
      }))
      setPendingUsers(users)
    } catch (error) {
      console.error('Erro ao buscar usuários pendentes:', error)
      // Em um ambiente real, exibiria um erro para o administrador
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (uid, newStatus) => {
    setActionLoading(prev => ({ ...prev, [uid]: true }))
    try {
      const userDocRef = doc(db, 'users', uid)
      await updateDoc(userDocRef, {
        status: newStatus,
        approvedAt: newStatus === 'approved' ? new Date() : null,
        rejectedAt: newStatus === 'rejected' ? new Date() : null,
      })

      // Atualiza a lista localmente
      setPendingUsers(prev => prev.filter(user => user.id !== uid))

      // Em um ambiente real, aqui seria o local para chamar uma Cloud Function
      // que usaria o Admin SDK para (re)ativar o usuário no Firebase Auth,
      // se ele tivesse sido desativado no registro.
      
    } catch (error) {
      console.error(`Erro ao ${newStatus} usuário ${uid}:`, error)
      // Em um ambiente real, exibiria um erro para o administrador
    } finally {
      setActionLoading(prev => ({ ...prev, [uid]: false }))
    }
  }

  if (loading) {
    return <div className="text-center py-10">{t('loading')}</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('userApprovalTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        {pendingUsers.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            {t('noPendingUsers')}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('emailAddress')}</TableHead>
                <TableHead>{t('createdAt')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead className="text-right">{t('action')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{t('pending')}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(user.id, 'rejected')}
                      disabled={actionLoading[user.id]}
                    >
                      {actionLoading[user.id] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
                      {t('reject')}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(user.id, 'approved')}
                      disabled={actionLoading[user.id]}
                    >
                      {actionLoading[user.id] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                      {t('approve')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
