# Peso Tracker

Aplicativo mobile para acompanhamento de peso corporal, desenvolvido com React Native e Expo. Permite registrar, visualizar e monitorar a evolução do peso ao longo do tempo, com suporte a metas pessoais.

## Funcionalidades

- **Autenticação de usuários**: Cadastro e login com sessões persistentes
- **Registro de peso**: Adicionar, editar e excluir registros de peso com data e hora
- **Histórico completo**: Visualização em tabela de todos os registros
- **Gráfico de evolução**: Acompanhamento visual do progresso
- **Cartões de resumo**: Peso atual, variação, menor, maior e meta
- **Meta de peso**: Definição de peso objetivo com notificação ao atingir
- **Internacionalização**: Interface disponível em Português e Inglês
- **Tema claro/escuro**: Suporte automático baseado no sistema

## Tecnologias

### Frontend (Mobile)

- React Native 0.81
- Expo SDK 54
- React Navigation (navegação nativa)
- TanStack Query (gerenciamento de estado/cache)
- React Native Reanimated (animações)
- Expo Image, Haptics, Blur

### Backend

- Node.js com Express
- PostgreSQL com Drizzle ORM
- Autenticação baseada em sessão (express-session)
- Hash de senhas com scrypt

### Ferramentas de Desenvolvimento

- TypeScript
- ESLint + Prettier
- Drizzle Kit (migrações)

## Estrutura de Pastas

```
├── client/                  # Código do app mobile
│   ├── components/          # Componentes reutilizáveis
│   ├── screens/             # Telas do app
│   ├── navigation/          # Configuração de navegação
│   ├── hooks/               # Hooks customizados
│   ├── lib/                 # Utilitários e contextos
│   │   ├── auth/            # Contexto de autenticação
│   │   └── i18n/            # Traduções e contexto de idioma
│   ├── constants/           # Constantes do app
│   └── types/               # Tipos TypeScript
├── server/                  # Código do backend
│   ├── index.ts             # Ponto de entrada do servidor
│   ├── routes.ts            # Rotas da API
│   ├── auth.ts              # Funções de autenticação
│   ├── storage.ts           # Camada de acesso ao banco
│   ├── db.ts                # Configuração do banco
│   └── templates/           # Templates HTML
├── shared/                  # Código compartilhado
│   └── schema.ts            # Schema do banco e validações Zod
├── scripts/                 # Scripts de build
│   └── build.js             # Build estático para Expo
└── assets/                  # Recursos estáticos (ícones, splash)
```

## Instalação

### Pré-requisitos

- Node.js (versão compatível com Expo SDK 54)
- PostgreSQL

### Passos

1. Clone o repositório

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente (veja seção abaixo)

4. Execute as migrações do banco de dados:

```bash
npm run db:push
```

## Configuração

### Variáveis de Ambiente

- `DATABASE_URL` - URL de conexão com o PostgreSQL
- `SESSION_SECRET` - Chave secreta para sessões (opcional, possui valor padrão)
- `PORT` - Porta do servidor (padrão: 5000)
- `NODE_ENV` - Ambiente de execução (development/production)

## Execução

### Desenvolvimento

Inicie o servidor backend:

```bash
npm run server:dev
```

Em outro terminal, inicie o Expo:

```bash
npm run expo:dev
```

### Produção

Build do servidor:

```bash
npm run server:build
```

Build estático do Expo:

```bash
npm run expo:static:build
```

Executar servidor em produção:

```bash
npm run server:prod
```

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run server:dev` | Servidor de desenvolvimento |
| `npm run server:build` | Build do servidor para produção |
| `npm run server:prod` | Executa servidor em produção |
| `npm run expo:dev` | Inicia Expo em modo desenvolvimento |
| `npm run expo:static:build` | Build estático do app |
| `npm run db:push` | Aplica schema ao banco de dados |
| `npm run lint` | Executa verificação de lint |
| `npm run lint:fix` | Corrige problemas de lint |
| `npm run check:types` | Verifica tipos TypeScript |
| `npm run check:format` | Verifica formatação |
| `npm run format` | Formata código com Prettier |

## API

O servidor expõe as seguintes rotas:

### Autenticação

- `POST /api/auth/register` - Criar conta
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/logout` - Fazer logout
- `GET /api/auth/me` - Obter usuário atual
- `PUT /api/auth/me` - Atualizar dados do usuário

### Registros de Peso

- `GET /api/weights` - Listar registros
- `POST /api/weights` - Criar registro
- `PUT /api/weights/:id` - Atualizar registro
- `DELETE /api/weights/:id` - Excluir registro
