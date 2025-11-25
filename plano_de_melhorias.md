# Plano de Melhorias e Redesenho do Site

**Objetivo:** Transformar o site atual em uma plataforma mais profissional, confiável e com um fluxo de usuário otimizado, atendendo a todas as solicitações do cliente.

**Stack Tecnológica Atual:** React (Vite), Tailwind CSS (v4), Shadcn/ui, Firebase, React Router DOM, React Hook Form/Zod.

## 1. Melhorias de Design e Layout (Frontend)

**Meta:** Transmitir confiança e profissionalismo, alinhado com plataformas financeiras de câmbio/criptomoedas.

| Área | Melhoria Proposta | Detalhes Técnicos |
| :--- | :--- | :--- |
| **Paleta de Cores** | Substituir cores atuais por uma paleta mais sóbria e profissional (ex: tons de azul escuro, cinza, branco, com um toque de cor de destaque para CTAs). | Ajustar `tailwind.config.js` e variáveis CSS para a nova paleta. |
| **Tipografia** | Selecionar uma fonte moderna e legível (ex: Inter, Roboto, ou outra fonte sem serifa limpa) para melhorar a clareza. | Importar e configurar a nova fonte no `index.css`. |
| **Layout Geral** | Estrutura de layout mais limpa, com espaçamento e hierarquia visual bem definidos. Uso de cartões (Cards) e sombras sutis para profundidade. | Revisar componentes principais (`App.jsx`, `HomePage.jsx`) e componentes de UI (`Card`, `Button`). |
| **Responsividade** | Garantir que o design seja impecável em todos os dispositivos (desktop, tablet, mobile). | Revisão e aplicação de classes responsivas do Tailwind CSS em todos os componentes. |
| **Imagens/Ícones** | Substituir quaisquer imagens ou ícones de baixa qualidade por SVGs ou ícones profissionais (usando Lucide-React). | Revisar o uso de ícones em todo o projeto. |

## 2. Aprimoramento do Fluxo de Cadastro (Funcionalidade Crítica)

**Meta:** Implementar um cadastro em etapas, seguro e com validações robustas, removendo a solicitação de dados bancários iniciais.

| Etapa | Ação Proposta | Detalhes Técnicos |
| :--- | :--- | :--- |
| **Etapa 1: Dados Pessoais e Senha** | Coletar nome, e-mail e **adicionar o campo de senha (com confirmação)**. | Criar um novo componente `RegisterStep1.jsx`. Implementar validação de senha (força, confirmação) com Zod/React Hook Form. |
| **Etapa 2: Verificação/Confirmação** | Envio de e-mail de verificação (se não estiver implementado) ou confirmação de dados. | Integrar com o serviço de autenticação do Firebase (`sendEmailVerification`) ou criar um mock para a fase de desenvolvimento. |
| **Etapa 3: Documentação (Opcional)** | Se necessário, incluir uma etapa para upload de documentos (KYC - Know Your Customer) ou dados complementares. | Opcionalmente, criar `RegisterStep3.jsx` para dados adicionais (endereço, CPF/CNPJ). **Remover a conta bancária desta fase.** |
| **Arquitetura** | Gerenciamento de estado do formulário de várias etapas. | Utilizar `useState` ou `useReducer` no componente pai (`RegisterPage.jsx`) ou uma biblioteca de gerenciamento de estado (se necessário, mas `useState` deve ser suficiente para este escopo). |

## 3. Correção de Erros e Aprimoramento de Funcionalidades

**Meta:** Identificar e corrigir todos os erros (front-end e back-end) e otimizar o código.

| Área | Ação Proposta | Detalhes Técnicos |
| :--- | :--- | :--- |
| **Identificação de Erros** | Realizar uma análise de código minuciosa, focando em: console logs, uso incorreto de hooks, erros de renderização e falhas de lógica de negócio. | Revisar o código em `src/` e testar rotas principais. |
| **Otimização de Código** | Refatorar código repetitivo, garantir o uso correto de chaves (`key`) em listas e otimizar o uso de hooks (ex: `useMemo`, `useCallback`). | Aplicar boas práticas de React/JavaScript. |
| **Integração Firebase** | Verificar e corrigir a comunicação com o Firebase (autenticação, banco de dados). | Garantir que as regras de segurança do Firebase sejam adequadas (se aplicável) e que as chamadas de API estejam corretas. |
| **Funcionalidades de Câmbio** | Se houver lógica de cotação/cálculo, garantir que ela seja precisa e utilize formatação monetária correta. | Revisar componentes como `PaymentGatewayPage.jsx` e `PaymentPage.jsx`. |

## 4. Próximas Fases do Projeto

1.  **Implementar novo design profissional e layout responsivo.** (Fase 3)
2.  **Desenvolver sistema de cadastro em etapas com validações.** (Fase 4)
3.  **Aprimorar funcionalidades existentes e corrigir erros.** (Fase 5)
4.  **Testar todas as funcionalidades e realizar ajustes finais.** (Fase 6)
5.  **Entregar site aprimorado com documentação.** (Fase 7)
