# Guia de Testes - CambioExpress v2.0

**Objetivo:** Validar todas as funcionalidades e garantir que o site funciona corretamente em todos os cenários.

---

## 🧪 Testes da HomePage

### 1. Carregamento da Página
- [ ] A página carrega sem erros
- [ ] Header é exibido corretamente
- [ ] Logo e navegação estão visíveis
- [ ] Hero section é renderizada

### 2. Conversor de Moedas
- [ ] Inserir valor e verificar se o cálculo está correto
- [ ] Testar com valores diferentes (1, 1000, 999999999)
- [ ] Testar com valores inválidos (0, negativos, letras)
- [ ] Trocar moedas de origem e destino
- [ ] Botão "Inverter moedas" funciona corretamente
- [ ] Taxa de câmbio é exibida corretamente
- [ ] Taxa de 0.4% é aplicada

### 3. Navegação
- [ ] Link "Home" funciona
- [ ] Link "Contato" funciona
- [ ] Botão "Login" funciona
- [ ] Botão "Cadastro" redireciona para /register
- [ ] Scroll suave para conversor funciona

### 4. Responsividade
- [ ] Página se adapta em mobile (320px)
- [ ] Página se adapta em tablet (768px)
- [ ] Página se adapta em desktop (1024px+)
- [ ] Nenhum elemento fica cortado

### 5. Footer
- [ ] Footer é exibido
- [ ] Links do footer funcionam
- [ ] Informações de contato estão corretas

---

## 📝 Testes do Cadastro (RegisterPage)

### Etapa 1: Dados Pessoais e Senha

#### Validações
- [ ] Campo "Nome Completo" é obrigatório
- [ ] Campo "Email" valida formato de email
- [ ] Campo "Telefone" é obrigatório
- [ ] Campo "Senha" requer mínimo 8 caracteres
- [ ] Indicador de força da senha funciona:
  - [ ] Fraca (vermelho) - até 1 ponto
  - [ ] Média (laranja) - até 2 pontos
  - [ ] Boa (amarelo) - até 3 pontos
  - [ ] Forte (verde) - 4+ pontos
- [ ] Campo "Confirmar Senha" valida correspondência
- [ ] Botão de mostrar/ocultar senha funciona

#### Navegação
- [ ] Botão "Próximo" avança para etapa 2
- [ ] Botão "Próximo" é desabilitado se há erros
- [ ] Dados são preservados ao voltar

### Etapa 2: Informações Adicionais

#### Validações
- [ ] Campo "Endereço" é obrigatório
- [ ] Campo "Nacionalidade" é obrigatório
- [ ] Dropdown de nacionalidade funciona

#### Navegação
- [ ] Botão "Voltar" retorna para etapa 1
- [ ] Botão "Próximo" avança para etapa 3
- [ ] Dados da etapa 1 são preservados

### Etapa 3: Verificação de Identidade

#### Upload de Documentos
- [ ] Upload de documento funciona
- [ ] Upload de selfie funciona
- [ ] Validação de tipo de arquivo funciona
- [ ] Validação de tamanho (máximo 5MB) funciona
- [ ] Nomes de arquivo são exibidos corretamente
- [ ] Ícone de sucesso (checkmark) aparece após upload

#### Navegação
- [ ] Botão "Voltar" retorna para etapa 2
- [ ] Botão "Próximo" avança para etapa 4
- [ ] Dados anteriores são preservados

### Etapa 4: Método de Entrega

#### Seleção de Método
- [ ] Opção "Transferência Bancária" pode ser selecionada
- [ ] Opção "Retirada Presencial" pode ser selecionada
- [ ] Apenas uma opção pode ser selecionada por vez
- [ ] Descrições das opções são claras

#### Fluxo Condicional
- [ ] Se "Transferência Bancária" é selecionada:
  - [ ] Avança para etapa 5 (Dados Bancários)
- [ ] Se "Retirada Presencial" é selecionada:
  - [ ] Pula etapa 5 e vai direto para etapa 6 (Revisão)

#### Navegação
- [ ] Botão "Voltar" retorna para etapa 3
- [ ] Botão "Próximo" avança corretamente

### Etapa 5: Dados Bancários (Apenas se Banco)

#### Validações
- [ ] Campo "Banco" é obrigatório
- [ ] Campo "Agência" valida 4-5 dígitos
- [ ] Campo "Conta" valida formato
- [ ] Campo "Titular" é obrigatório
- [ ] Autocomplete de bancos funciona

#### Formatação
- [ ] Agência é formatada corretamente
- [ ] Conta é formatada com hífen (ex: 12345-6)

#### Navegação
- [ ] Botão "Voltar" retorna para etapa 4
- [ ] Botão "Próximo" avança para etapa 6

### Etapa 6: Revisão Final

#### Exibição de Dados
- [ ] Todos os dados são exibidos corretamente
- [ ] Dados sensíveis são mascarados:
  - [ ] Email mascarado (ex: jo***@exemplo.com)
  - [ ] Telefone mascarado (ex: (11) 9999-***)
  - [ ] Conta bancária mascarada
- [ ] Método de entrega é exibido corretamente
- [ ] Se banco: dados bancários são exibidos
- [ ] Se retirada: não há dados bancários

#### Botões de Ação
- [ ] Botão "Voltar" retorna para etapa anterior
- [ ] Botão "Confirmar Cadastro" submete o formulário
- [ ] Após submissão, redireciona para página de verificação

---

## 🔄 Testes de Fluxo Completo

### Fluxo 1: Cadastro com Transferência Bancária
1. [ ] Preencher etapa 1 com dados válidos
2. [ ] Preencher etapa 2 com dados válidos
3. [ ] Fazer upload de documentos na etapa 3
4. [ ] Selecionar "Transferência Bancária" na etapa 4
5. [ ] Preencher dados bancários na etapa 5
6. [ ] Revisar e confirmar na etapa 6
7. [ ] Verificar se foi criado registro no Firebase

### Fluxo 2: Cadastro com Retirada Presencial
1. [ ] Preencher etapa 1 com dados válidos
2. [ ] Preencher etapa 2 com dados válidos
3. [ ] Fazer upload de documentos na etapa 3
4. [ ] Selecionar "Retirada Presencial" na etapa 4
5. [ ] Pular etapa 5 (dados bancários)
6. [ ] Revisar e confirmar na etapa 6
7. [ ] Verificar se foi criado registro no Firebase

### Fluxo 3: Conversor + Cadastro
1. [ ] Na HomePage, inserir valores no conversor
2. [ ] Clicar em "Converter"
3. [ ] Ser redirecionado para /register com transactionId
4. [ ] Completar cadastro
5. [ ] Verificar se transação foi criada no Firebase

---

## 🎨 Testes de Design e UX

### Responsividade
- [ ] Mobile (320px): Todos os elementos visíveis e funcionais
- [ ] Tablet (768px): Layout se adapta corretamente
- [ ] Desktop (1024px+): Layout ótimo

### Acessibilidade
- [ ] Todos os inputs têm labels
- [ ] Cores têm contraste suficiente
- [ ] Navegação por teclado funciona
- [ ] Mensagens de erro são claras

### Performance
- [ ] Página carrega em menos de 3 segundos
- [ ] Sem erros no console
- [ ] Sem memory leaks

---

## 🔐 Testes de Segurança

### Validação de Entrada
- [ ] Injeção de HTML é prevenida
- [ ] Injeção de JavaScript é prevenida
- [ ] Caracteres especiais são tratados corretamente

### Proteção de Dados
- [ ] Senhas não são exibidas em texto plano
- [ ] Dados sensíveis são mascarados
- [ ] Arquivos são validados antes do upload

### Firebase
- [ ] Dados são salvos corretamente no Firestore
- [ ] Regras de segurança do Firebase estão configuradas

---

## 📱 Testes em Diferentes Navegadores

- [ ] Chrome (versão mais recente)
- [ ] Firefox (versão mais recente)
- [ ] Safari (versão mais recente)
- [ ] Edge (versão mais recente)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

---

## 🐛 Testes de Casos Extremos

### Entrada de Dados
- [ ] Valores muito grandes (999999999)
- [ ] Valores muito pequenos (0.01)
- [ ] Caracteres especiais em nomes
- [ ] Emails com subdomínios
- [ ] Telefones em diferentes formatos

### Ações do Usuário
- [ ] Clicar rapidamente em botões (debounce)
- [ ] Voltar e avançar rapidamente entre etapas
- [ ] Atualizar página durante cadastro
- [ ] Fechar abas e reabrir

### Erros de Rede
- [ ] Simular conexão lenta
- [ ] Simular perda de conexão
- [ ] Simular erro do Firebase

---

## ✅ Checklist de Pré-Lançamento

- [ ] Todos os testes acima foram executados
- [ ] Nenhum erro no console
- [ ] Nenhum aviso de performance
- [ ] Dados são salvos corretamente no Firebase
- [ ] Redirecionamentos funcionam
- [ ] Responsividade está perfeita
- [ ] Acessibilidade está OK
- [ ] Documentação está atualizada
- [ ] Código foi revisado
- [ ] Build foi testado

---

**Nota:** Executar todos os testes antes de fazer deploy em produção.
