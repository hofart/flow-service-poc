╭────────────────────────────────────────────────────────────────────────────────────────────────╮
│ Server-Driven UI — audit & roadmap                                                             │
╰────────────────────────────────────────────────────────────────────────────────────────────────╯

## Iteração 1 — CONCLUÍDA: Contrato EtapaUI no nó SERVER_DRIVEN_UI

### O que foi feito
- Tipos em `src/shared/models/server-driven-ui.interface.ts`
  (EtapaUI, InicioEtapa, CampoEtapa, RegraValidacao, CondicaoNode, CondicaoOperador)
- Utils em `src/shared/utils/server-driven-ui.ts`
  (serializeEtapaUI, serializeInicioEtapa, serializeCampo, serializeRegra, flattenKeyMappers,
   createCampoEtapa, createRegraValidacao, createCondicaoGroup, createCondicaoRule)
- Novos componentes no nó:
  FlowNodeServerDrivenCampoModal, FlowNodeServerDrivenRegraModal,
  FlowNodeServerDrivenConditionBuilder (recursivo), FlowNodeServerDrivenPropsEditor,
  FlowNodeServerDrivenRegraItem
- Refactor de FlowNodeServerDrivenUI: seções Etapa / Campos / Regras + botão "Ver JSON"
- PatchType estendido com: campos, regras, fluxoId, etapaId, nomeEtapa, tipoEtapa

### Contrato gerado (JSON Mock)
O botão "Ver JSON" exibe dois payloads:

1. `GET /etapa → InicioEtapa`
```json
{
  "etapaId": "<uuid>",
  "tipo": 0
}
```

2. `GET /etapa/:etapaId → EtapaUI`
```json
{
  "fluxoId": "<string>",
  "etapaId": "<uuid>",
  "nome": "<string>",
  "tipo": 0,
  "campos": [ { "id", "paiId", "nomeCampo", "tipoComponente", "tipoDado", "obrigatorio", "ordem", "propsJson", "keyMapper" } ],
  "regras": [ { "id", "condicoesJson", "mensagemErroUI" } ]
}
```

---

## Iteração 2 — CONCLUÍDA: Seção Etapa via modal + estado inicial com mock

### O que foi feito

**Seção Etapa refatorada para padrão modal (igual Campos/Regras)**
- Criado `FlowNodeServerDrivenEtapaModal.vue` — modal animado com campos `fluxoId`, `etapaId`, `nomeEtapa` + validação via vuelidate
- Criado `FlowNodeServerDrivenEtapaItem.vue` — item de exibição com nome da etapa, fluxoId e botão editar
- `FlowNodeServerDrivenUI.vue` atualizado: botão "Configurar etapa" abre o modal; item aparece abaixo quando configurado
- Removidos os inputs inline da seção Etapa que existiam anteriormente

**Estado inicial do nó pré-populado com mock real**
- Criado `DEFAULT_SERVER_DRIVEN_UI_PATCH` em `src/shared/constants/service-flow-nodes.ts`
  com os dados do mock de `certfy-op-form-engine`:
  - Etapa: `fluxo-cpf-demo` / `Dados Pessoais` / etapaId fixo
  - Campo 1: `Nome Completo` (vsoft-text-input, obrigatório, keyMapper: dadosPessoais.nomeCompleto)
  - Campo 2: `Data de Nascimento` (vsoft-date-picker, obrigatório, keyMapper: dadosPessoais.dataNascimento)
  - Regra: validação de comprimento mínimo do nome (≥ 5 caracteres)
- `useFlowBuilderNodes.ts` / `createDataNode` atualizado: detecta `key === 'server-driven-ui'`
  e injeta o patch mock em vez do `DEFAULT_LANGUAGES` vazio

**Correções de build (TypeScript)**
- `FlowNodeServerDrivenConditionBuilder.vue`: `selectedField` / `selectedOperator` retornavam
  `undefined`; adicionado fallback `?? { label, key }` para satisfazer o tipo `Item`
- `FlowNodeServerDrivenUI.vue`: propriedade `ordem` duplicada no objeto literal de novo campo;
  movida para depois do spread `...payload`

### Estrutura de arquivos atual
```
src/shared/
  constants/service-flow-nodes.ts       ← DEFAULT_SERVER_DRIVEN_UI_PATCH
  models/server-driven-ui.interface.ts  ← EtapaUI, InicioEtapa, CampoEtapa, RegraValidacao
  models/service-flow-nodes.interface.ts ← PatchType (fluxoId, etapaId, nomeEtapa, tipoEtapa)
  utils/server-driven-ui.ts             ← serialize*, create* helpers

src/modules/service-flow/
  hooks/useFlowBuilderNodes.ts          ← createDataNode com default por tipo de nó
  components/add/flow/node/server-driven-ui/
    FlowNodeServerDrivenUI.vue          ← orchestrador principal
    FlowNodeServerDrivenEtapaModal.vue  ← modal configuração de etapa
    FlowNodeServerDrivenEtapaItem.vue   ← exibição da etapa configurada
    FlowNodeServerDrivenCampoModal.vue  ← modal campo
    FlowNodeServerDrivenRegraModal.vue  ← modal regra
    FlowNodeServerDrivenConditionBuilder.vue ← builder recursivo de condições
    FlowNodeServerDrivenPropsEditor.vue ← editor key/value de props
    FlowNodeServerDrivenItem.vue        ← item campo (com filhos recursivos)
    FlowNodeServerDrivenRegraItem.vue   ← item regra
    FlowNodeServerDrivenButtonAdd.vue   ← botão de adicionar genérico
```

---

## Iteração 3 — PRÓXIMA: MSW mock no certfy-op-form-engine

### Objetivo
Usar o JSON gerado pelo flow-service-poc (botão "Ver JSON") para criar handlers MSW no projeto
`certfy-op-form-engine`, simulando os dois endpoints que o `useFormEngineApi.ts` consome.

### Endpoints a mockar
```ts
// certfy-op-form-engine/src/mocks/handlers.ts

// 1. Início de atendimento
http.get('/api/etapa', () =>
  HttpResponse.json({
    etapaId: '8f3b2d1e-9c4a-4b7d-a1e2-5f6c8b9a0d1e',
    tipo: 0,
  })
),

// 2. Dados da etapa (tipo 0 = SERVER_DRIVEN_UI)
http.get('/api/etapa/:etapaId', ({ params }) =>
  HttpResponse.json({
    fluxoId: 'fluxo-cpf-demo',
    etapaId: params.etapaId,
    nome: 'Dados Pessoais',
    tipo: 0,
    campos: [ /* colar campos do "Ver JSON" */ ],
    regras: [ /* colar regras do "Ver JSON" */ ],
  })
),
```

### Arquivos afetados no certfy-op-form-engine
- `src/mocks/handlers.ts` — adicionar os dois handlers acima
- `src/hooks/useFormEngineApi.ts` — verificar se já chama os dois endpoints ou se precisa ajuste
- `src/components/FormEngine.vue` — verificar se renderiza campos via `<component :is="tipoComponente">`

### Fluxo end-to-end esperado
1. Usuário clica "Iniciar Atendimento" no certfy-op-form-engine
2. `useFormEngineApi` chama `GET /api/etapa` → recebe `{ etapaId, tipo: 0 }`
3. Com `tipo === 0`, chama `GET /api/etapa/:etapaId` → recebe campos + regras
4. `FormEngine.vue` renderiza cada campo via `<component :is="campo.tipoComponente" v-bind="JSON.parse(campo.propsJson)" />`
5. Validação: ao submeter, aplica as regras (condicoesJson) e exibe `mensagemErroUI` se falhar

---

## Iteração 4 — FUTURA: Campos aninhados (filhos)

### Objetivo
Permitir criar campos pai/filho na UI (grupos, seções).

### O que falta
- Botão "Adicionar filho" no FlowNodeServerDrivenItem (ou no CampoModal)
- Seletor de `paiId` no CampoModal (dropdown dos campos existentes)
- Renderização em árvore no nó (já implementado via recursão em FlowNodeServerDrivenItem)
- Serialização recursiva já está pronta em `serializeCampo`

---

## Iteração 5 — FUTURA: Múltiplos tipos de etapa

### Objetivo
Suportar `tipo !== 0` (ex: etapa de upload, etapa de assinatura).

### O que falta
- Adicionar select de `tipo` no `FlowNodeServerDrivenEtapaModal` (hoje fixo em 0)
- Criar outros nós ou sub-renderers no certfy-op-form-engine para tipos 1, 2, etc.

---

## Riscos em aberto
- `etapaUIId` e `props` aparecem nos campos serializados mas o backend ignora campos extras — OK para mock
- Persistência por linguagem: campos/regras são replicados por language no PatchType; se isso não fizer sentido, extrair para dados globais do nó (follow-up pequeno)
- Campo referenciado em regra com keyMapper alterado: regra fica com field inválido sem aviso visual (badge de warning ainda não implementado)
- Mock inicial hardcoded em `DEFAULT_SERVER_DRIVEN_UI_PATCH`: ao evoluir o contrato, lembrar de atualizar junto
