# Uso de Inteligência Artificial no Desenvolvimento

Este documento descreve como a IA foi usada na elaboração desta solução, conforme exigido pelo desafio.

## Ferramenta/modelo utilizado

Assistente de IA baseado no modelo **Claude (Sonnet)**, operando dentro de um ambiente de desenvolvimento com acesso a edição de arquivos, execução de comandos de terminal e navegação automatizada de browser para validação visual. A interação foi feita por texto, em modo de agente (a IA executou ações diretamente, sob minha revisão e aprovação em cada etapa).

## Partes do desafio em que a IA foi usada

- **Leitura e interpretação do enunciado** (extração do PDF do desafio para um plano de trabalho estruturado).
- **Planejamento da arquitetura**: definição da estrutura de pastas, do contrato de API (entidades, DTOs, enums, endpoints) e da separação de camadas do backend e do frontend.
- **Geração do código-base** do backend (NestJS) e do frontend (React + Vite + TypeScript + Tailwind), incluindo DTOs, validações, regras de negócio, repositório em memória, módulo de análise de IA mockada e componentes de UI.
- **Geração dos testes unitários** das regras de risco e de transição de status.
- **Geração da documentação** (Swagger via decorators, este `AI_USAGE.md` e o `README.md`).
- **Validação funcional**: subida real do backend e do frontend, testes via `curl` dos endpoints (incluindo cenários de erro: transição inválida, exclusão bloqueada, 404) e verificação visual do frontend integrado à API real por meio de automação de browser.
- **Revisão final**: varredura do repositório em busca de comentários desnecessários e de qualquer referência indevida a nomes de ferramentas ou empresas.
- **Melhorias adicionais** (após a entrega inicial, decisão minha de aprofundar o diferencial técnico): pipeline de CI no GitHub Actions, containerização com Docker/Docker Compose, substituição de `window.confirm`/`window.alert` por um modal de confirmação e um sistema de notificações (toasts) no frontend, e um `ARCHITECTURE.md` com diagramas do fluxo de status/risco/IA. Todas essas adições foram testadas manualmente (build, lint, `docker compose up` de ponta a ponta, navegação real no browser) antes de serem consideradas concluídas.

Eu não usei IA para tomar decisões de negócio — as regras de risco, de transição de status e o contrato de API vieram diretamente da leitura do enunciado do desafio; a IA foi usada para *implementar* essas regras, não para *defini-las*.

## Prompts principais utilizados

Os prompts abaixo são um resumo fiel dos principais direcionamentos dados durante o processo (não literais palavra por palavra, mas preservando o conteúdo técnico):

1. **Planejamento inicial**: pedido para ler o PDF do desafio na pasta do projeto e montar um plano de implementação que seguisse à risca o escopo descrito, evitando comentários no código e qualquer referência a nomes de ferramentas/empresas no repositório, usando uma análise de IA mockada (em vez de uma integração real, para não consumir tokens de uma API paga) desde que documentada, e cobrindo Swagger, README e um arquivo de uso de IA.
2. **Definição de decisões de arquitetura em aberto**: perguntas diretas sobre qual estratégia de persistência usar (optei por armazenamento em memória, por ser mais simples de rodar para quem for avaliar o projeto, sem exigir configuração de banco) e qual abordagem de estilização usar no frontend (Tailwind CSS).
3. **Implementação do backend**: prompt detalhado especificando o contrato de domínio (campos do `Project`, valores exatos dos enums de status e risco), o mapa de transições de status, a fórmula de cálculo de risco, a lista de endpoints com seus corpos de requisição/resposta, a estrutura de pastas esperada (`projects/`, `ai-analysis/`, `common/`), as regras de estilo (zero comentários narrativos, nenhuma referência a nomes proibidos) e a exigência de rodar `build`, `test` e subir o servidor para validar antes de finalizar.
4. **Implementação do frontend**: prompt equivalente ao do backend, com o mesmo contrato de domínio/API (para garantir compatibilidade entre as duas implementações feitas em paralelo), especificando as telas obrigatórias (listagem, formulário, detalhe, painel de análise de IA), os componentes esperados e as mesmas regras de estilo e de validação de build.
5. **Validação final**: pedido para subir backend e frontend juntos, testar manualmente o fluxo completo (criar projeto, avançar status, gerar análise de IA, tentar excluir um projeto bloqueado) e revisar o repositório em busca de comentários e nomes indevidos antes de escrever a documentação final.

## O que foi aceito, ajustado ou descartado

**Aceito sem alterações:**
- A estrutura de camadas proposta para a análise de IA (`AiClient` como interface, `MockAiClient` como implementação, `ProjectAnalysisPromptBuilder` para montar o prompt).
- O uso de `class-validator`/`class-transformer` para validação de DTOs e do `ValidationPipe` global do NestJS.
- O uso de React Hook Form + Zod para validação de formulário no frontend.

**Ajustado após revisão:**
- O cálculo do prazo em meses (usado no cálculo de risco) foi revisado para usar diferença de calendário (ano × 12 + mês, com fração de dias) em vez de uma aproximação simples por dias/30, tornando os limites de "exatamente 3 meses" e "exatamente 6 meses" determinísticos e testáveis.
- A dependência circular entre `ProjectsModule` e `AiAnalysisModule` (o endpoint de análise vive no `ProjectsController`, mas o serviço de análise depende do `ProjectsService`) foi resolvida com `forwardRef()` nos dois módulos, um padrão recomendado pelo próprio NestJS para esse tipo de caso.
- Removi arquivos de boilerplate padrão gerados pelo `@nestjs/cli` e pelo template do Vite que não faziam parte do escopo pedido (ex.: `app.controller.ts`/`app.service.ts` de exemplo do Nest, um `README.md` de template, uma imagem de exemplo não utilizada no frontend e a pasta `dist/` gerada durante a validação do build).
- No formulário de projeto, o campo de orçamento usa `valueAsNumber` do React Hook Form em vez de `z.coerce.number()` do Zod, para evitar um conflito de tipos entre o schema de entrada e saída do `zodResolver`.

**Descartado:**
- A opção de usar um banco de dados real (SQLite com TypeORM ou Prisma) para persistência, em favor do repositório em memória — decisão consciente para reduzir a superfície de configuração necessária para rodar o projeto, mantendo a interface do repositório pronta para uma futura substituição.
- A ideia de usar roteamento (React Router) no frontend, por não agregar valor dentro do escopo de uma única tela com modais.

## Decisões técnicas tomadas por mim (candidato)

- Persistência em memória via interface de repositório, priorizando facilidade de execução para quem for avaliar o projeto.
- Análise de IA mockada (Opção B do desafio), com estrutura desacoplada o suficiente para permitir uma integração real futura sem tocar em controller ou service.
- Tailwind CSS para estilização do frontend, por permitir um resultado limpo e consistente rapidamente, dentro do escopo de "sem design visual elaborado".
- Nomenclatura dos campos de domínio em português (`nome`, `orcamentoTotal`, `dataInicio`, etc.), por refletir a linguagem do domínio de negócio descrito no desafio.
- Formato de erro padronizado (`statusCode`, `message`, `error`, `timestamp`, `path`) centralizado em um filtro global de exceções, com exceções de domínio específicas para cada regra de negócio violada (transição inválida, exclusão bloqueada, projeto não encontrado).
- Divisão do trabalho de implementação entre backend e frontend usando o mesmo contrato de API definido previamente, para permitir que as duas partes fossem construídas em paralelo sem inconsistências.
- Validação funcional manual (via terminal e automação de browser) antes de considerar qualquer parte concluída, em vez de confiar apenas na compilação sem erros.

## Limitações da entrega

- Os dados não persistem entre reinícios do backend, por usar armazenamento em memória.
- A análise de IA é gerada por regras determinísticas (mock), não por um modelo de linguagem real — a integração real é um diferencial não obrigatório, e foi documentada como próximo passo possível.
- O cálculo de "meses" entre duas datas usa uma aproximação de calendário; casos extremos de calendário (ex.: anos bissextos em fronteiras exatas) podem gerar arredondamentos discutíveis, embora os limites de 3 e 6 meses estejam cobertos por testes.
- Não há testes automatizados no frontend, apenas verificação manual/visual, conforme o escopo do desafio não exigir cobertura mínima de testes.
- Não há autenticação, controle de permissões, paginação avançada ou filtros complexos, por estarem explicitamente fora do escopo do desafio.
- O repositório em memória não é seguro para uso concorrente em múltiplas instâncias do servidor (não é um requisito do desafio, mas vale registrar como limitação).
