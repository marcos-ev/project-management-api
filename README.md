# Gestão de Projetos

Aplicação web para gerenciamento simplificado de projetos: cadastro, consulta, edição, remoção, controle de status e cálculo automático de risco, com uma análise textual assistida por IA para cada projeto.

O sistema é dividido em dois projetos independentes:

- [`backend/`](backend) — API REST em Node.js com NestJS.
- [`frontend/`](frontend) — aplicação em React + TypeScript.

Consulte também o [`AI_USAGE.md`](AI_USAGE.md) para o detalhamento do uso de IA na elaboração desta solução, e o [`ARCHITECTURE.md`](ARCHITECTURE.md) para diagramas do fluxo de status, risco e análise de IA.

## Stack

| Camada    | Tecnologias |
|-----------|-------------|
| Backend   | Node.js, NestJS, TypeScript, class-validator, Swagger (`@nestjs/swagger`), Jest |
| Frontend  | React 19, TypeScript, Vite, Tailwind CSS, React Hook Form, Zod |
| Dados     | Repositório em memória (sem banco de dados externo) |
| IA        | Implementação mockada, com interface pronta para uma integração real |

## Como rodar

Pré-requisitos: Node.js 20+ e npm.

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run start:dev
```

A API sobe em `http://localhost:3000` (porta configurável via `PORT` no `.env`).

Documentação interativa (Swagger/OpenAPI) em `http://localhost:3000/docs`.

Para rodar os testes unitários:

```bash
npm run test
```

### Frontend

Em outro terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

A aplicação sobe em `http://localhost:5173` e consome a API através da variável `VITE_API_URL` (default `http://localhost:3000`, definida em `frontend/.env.example`).

> O backend precisa estar rodando para o frontend funcionar por completo — sem ele, a listagem exibe o estado de erro com opção de tentar novamente.

### Alternativa: Docker Compose

Para rodar backend e frontend juntos com um único comando, sem instalar Node localmente:

```bash
docker compose up --build
```

- API em `http://localhost:3000` (Swagger em `http://localhost:3000/docs`).
- Frontend em `http://localhost:5173` (servido via Nginx, já buildado apontando para a API acima).

Para derrubar: `docker compose down`.

## Continuous Integration

O repositório possui um workflow de CI (`.github/workflows/ci.yml`) que, a cada push/PR na branch `main`, roda lint, testes unitários e build tanto do backend quanto do frontend, garantindo que o projeto sempre compila e passa nos testes.

## Estrutura do repositório

```
backend/
  src/
    projects/        # entidade, DTOs, regras de risco/status, controller, service, repositório
    ai-analysis/      # serviço de análise assistida por IA e sua estrutura de camadas
    common/           # exceções de domínio e filtro global de erros
  src/**/*.spec.ts    # testes unitários das regras principais
frontend/
  src/
    api/              # client HTTP e chamadas à API
    types/            # tipos TypeScript compartilhando o formato dos DTOs do backend
    components/       # componentes de UI (listagem, formulário, detalhe, badges, estados)
    pages/            # composição das telas
    hooks/            # hooks de acesso a dados (useProjects, useProject, useAiAnalysis)
```

## Regras de negócio implementadas

### Status do projeto

Todo projeto é criado com status `EM_ANALISE`. As transições permitidas são:

```
EM_ANALISE   -> APROVADO | CANCELADO
APROVADO     -> EM_ANDAMENTO | CANCELADO
EM_ANDAMENTO -> ENCERRADO | CANCELADO
ENCERRADO    -> (nenhuma)
CANCELADO    -> (nenhuma)
```

Qualquer transição fora dessa sequência é rejeitada pela API com `409 Conflict`. Projetos com status `EM_ANDAMENTO` ou `ENCERRADO` não podem ser removidos (`409 Conflict` no `DELETE`); o frontend já desabilita essa ação nesses casos.

### Cálculo automático de risco

Recalculado sempre que orçamento, data de início ou previsão de término são criados/alterados, considerando o maior risco entre orçamento e prazo (em meses, calculado a partir da diferença de calendário entre as duas datas):

| Risco | Orçamento | Prazo |
|-------|-----------|-------|
| Baixo | até R$ 100.000 | até 3 meses |
| Médio | R$ 100.001 a R$ 500.000 | mais de 3 e até 6 meses |
| Alto  | acima de R$ 500.000 | mais de 6 meses |

Implementado em `backend/src/projects/risk-calculator.service.ts` como função pura, coberta por testes unitários (`risk-calculator.service.spec.ts`), incluindo os casos de borda (limites exatos e conflito entre a regra de orçamento e a de prazo).

### Análise assistida por IA

A análise (`GET /projects/:id/ai-analysis`) segue a separação em camadas pedida no desafio:

```
ProjectsController → AiAnalysisService → ProjectAnalysisPromptBuilder → AiClient (interface) → MockAiClient
```

- `ProjectAnalysisPromptBuilder` monta um prompt textual a partir dos dados do projeto.
- `AiClient` é uma interface (`analyze(prompt: string): Promise<AiAnalysisResult>`); a implementação atual, `MockAiClient`, gera resumo, pontos de atenção e recomendação executiva a partir de regras determinísticas (risco, prazo restante até a previsão de término, orçamento e status), sem chamar nenhuma API externa.
- Para plugar uma IA real no futuro, basta criar uma nova implementação de `AiClient` (ex.: um client para uma API de LLM) e trocar o provider registrado em `ai-analysis.module.ts` sob o token `AI_CLIENT` — nenhuma outra camada precisa mudar.
- Detalhes da decisão de usar IA mockada em vez de uma integração real estão no [`AI_USAGE.md`](AI_USAGE.md).

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST   | `/projects` | Cria um projeto (status inicial sempre `EM_ANALISE`, risco calculado) |
| GET    | `/projects` | Lista todos os projetos |
| GET    | `/projects/:id` | Busca um projeto por id |
| PATCH  | `/projects/:id` | Atualiza dados do projeto (recalcula risco quando necessário) |
| DELETE | `/projects/:id` | Remove um projeto (bloqueado por status) |
| PATCH  | `/projects/:id/status` | Altera o status do projeto (valida a transição) |
| GET    | `/projects/:id/ai-analysis` | Gera a análise assistida por IA do projeto |

Todos os endpoints, DTOs e respostas de erro estão documentados no Swagger (`/docs`).

Formato padrão de erro:

```json
{
  "statusCode": 409,
  "message": "Transicao de status invalida: \"EM_ANALISE\" -> \"EM_ANDAMENTO\"",
  "error": "Conflict",
  "timestamp": "2026-07-03T17:02:39.231Z",
  "path": "/projects/6227f129-9c87-48b1-add3-44baddf76f04/status"
}
```

## Decisões de arquitetura

- **Persistência em memória**: o `ProjectsRepository` é uma interface implementada por `InMemoryProjectsRepository`. Essa escolha elimina qualquer setup de banco de dados para quem for rodar o projeto (sem containers, sem migrations), mantendo o desacoplamento necessário para no futuro trocar por uma implementação com um banco real (ex.: PostgreSQL via TypeORM/Prisma) sem alterar `ProjectsService` nem o controller. A limitação é que os dados são perdidos a cada reinício do servidor.
- **IA mockada**: optei pela Opção B do desafio (integração simulada), documentada em detalhe no `AI_USAGE.md`, com a estrutura em camadas (`AiClient`/`MockAiClient`/`ProjectAnalysisPromptBuilder`) pronta para receber uma integração real.
- **Sem autenticação, paginação avançada, filtros complexos ou deploy**, conforme o escopo definido como não obrigatório.

## Testes

O backend possui testes unitários das regras de negócio principais:

- `risk-calculator.service.spec.ts` — os três níveis de risco, casos de borda e prevalência do maior risco.
- `status-transition.service.spec.ts` — transições válidas, inválidas e cancelamento a partir de qualquer status não-final.
- `projects.service.spec.ts` — criação, bloqueio de exclusão por status e recálculo de risco na atualização.

```bash
cd backend
npm run test
```

Não há cobertura mínima de testes exigida pelo escopo do desafio; o frontend não possui testes automatizados.

## Limitações conhecidas

- Dados não persistem entre reinícios do backend (armazenamento em memória).
- A análise de IA é simulada por regras determinísticas, não por um modelo de linguagem real.
- Sem autenticação/autorização, paginação avançada ou filtros complexos, por estarem fora do escopo do desafio.
- Sem testes end-to-end automatizados (apenas unitários no backend).
