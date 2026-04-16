────────────────────────────────────────────────────────────────────────────────────────────────╮
│ Server-Driven UI — gerar JSON da EtapaUI para a engine │
│ │
│ Context │
│ │
│ O nó SERVER_DRIVEN_UI hoje guarda items: { component, condicoes: { obrigatorio, visivel } } — │
│ um modelo de POC que não casa com o contrato real da engine C#. O contrato correto tem três │
│ entidades: │
│ │
│ - EtapaUI — o próprio nó (id, flowId, stageId, nome, campos[], regras[]) │
│ - CampoEtapa — cada componente renderizado (recursivo via filhos[], com props + propsJson, │
│ keyMapper, tipoComponente, tipoDado, obrigatorio, ordem) │
│ - RegraValidacao — regras separadas dos campos, cada uma com condicoes (árvore AND/OR com │
│ operadores) + condicoesJson + mensagemErroUI │
│ │
│ Objetivo desta iteração: refatorar o bloco server-driven-ui para produzir o JSON da EtapaUI │
│ exatamente nesse contrato, com UI para montar campos e um rule-builder aninhado para regras. │
│ │
│ Decisões já fechadas com o usuário: │
│ - Escopo: entregar contrato completo (EtapaUI + CampoEtapa + RegraValidacao) │
│ - Rule builder: árvore AND/OR com grupos aninhados + operadores completos │
│ - condicoesJson / propsJson = JSON.stringify do objeto correspondente (canonicalização no │
│ momento da serialização) │
│ - Campos referenciáveis nas regras: keyMapper dos CampoEtapa do próprio nó │
│ - tipoComponente: set fixo inicial (vsoft-text-input, vsoft-select, vsoft-date-picker) + │
│ editor de props genérico (key/value JSON) │
│ │
│ --- │
│ Arquivos principais │
│ │
│ Novos │
│ │
│ - src/shared/models/server-driven-ui.interface.ts — tipos EtapaUI, CampoEtapa, RegraValidacao, │
│ CondicaoNode (árvore), CondicaoOperador, TipoComponente │
│ - src/shared/utils/server-driven-ui.ts — helpers serializeEtapaUI(node), serializeCampo(c), │
│ serializeRegra(r), flattenKeyMappers(campos), createCampoEtapa(), createRegraValidacao(), │
│ createCondicaoGroup(), createCondicaoRule() │
│ - src/modules/service-flow/components/add/flow/node/server-driven-ui/FlowNodeServerDrivenCampo │
│ Modal.vue — modal de CampoEtapa (nomeCampo, tipoComponente, tipoDado, obrigatorio, ordem, │
│ keyMapper, props editor) │
│ - src/modules/service-flow/components/add/flow/node/server-driven-ui/FlowNodeServerDrivenRegra │
│ Modal.vue — modal de RegraValidacao (rule builder + mensagemErroUI) │
│ - src/modules/service-flow/components/add/flow/node/server-driven-ui/FlowNodeServerDrivenCondi │
│ tionBuilder.vue — componente recursivo que renderiza a árvore de condicoes (grupo AND/OR + │
│ regras + subgrupos) │
│ - src/modules/service-flow/components/add/flow/node/server-driven-ui/FlowNodeServerDrivenProps │
│ Editor.vue — editor key/value JSON para CampoEtapa.props │
│ - src/modules/service-flow/components/add/flow/node/server-driven-ui/FlowNodeServerDrivenRegra │
│ Item.vue — linha de RegraValidacao na listagem do nó │
│ │
│ Modificados │
│ │
│ - │
│ src/modules/service-flow/components/add/flow/node/server-driven-ui/FlowNodeServerDrivenUI.vue │
│ — duas seções ("Campos" e "Regras"), cada uma com seu add-button + lista + modal; botão "Ver │
│ JSON" para preview da EtapaUI serializada │
│ - src/modules/service-flow/components/add/flow/node/server-driven-ui/FlowNodeServerDrivenItem. │
│ vue — renderiza um CampoEtapa (label = nomeCampo, badge = tipoComponente); recursivo para │
│ exibir filhos como indentação │
│ - src/modules/service-flow/components/add/flow/node/server-driven-ui/FlowNodeServerDrivenButto │
│ nAdd.vue — aceita prop label para reuso entre "Adicionar campo" / "Adicionar regra" │
│ - src/shared/models/service-flow-nodes.interface.ts — estender PatchType com campos?: │
│ CampoEtapa[] e regras?: RegraValidacao[] (mantém items? por compat com outros nós) │
│ - src/shared/constants/service-flow-nodes.ts — │
│ NODE_FIELDS_TO_VALIDATE[PREVIEW_FLOW.SERVER_DRIVEN_UI] = ['campos'] │
│ │
│ Reuso do que já existe │
│ │
│ - useFlowBuilderNodes.updateNodeData() │
│ (src/modules/service-flow/hooks/useFlowBuilderNodes.ts:~329) — continua sendo o ponto único de │
│ atualização do nó; chamar com patch: { campos } e patch: { regras } │
│ - useFlowBuilderNodes.getValueByLanguage() — idem, para ler o patch da linguagem atual │
│ - useForm de vsoft-design-system + @vuelidate/validators — mesmo padrão do modal atual │
│ - motion-v AnimatePresence + v-click-outside — padrão visual dos modais existentes │
│ (FlowNodeServerDrivenModal.vue:1-80) │
│ - getLightColor (src/shared/utils/lightColor.ts) — cor secundária dos modais │
│ - uuidv4 (já importado em useFlowBuilderNodes.ts:6) — geração de id dos CampoEtapa / │
│ RegraValidacao │
│ │
│ --- │
│ Modelo de dados (novo contrato) │
│ │
│ // src/shared/models/server-driven-ui.interface.ts │
│ export type TipoComponente = │
│ | 'vsoft-text-input' │
│ | 'vsoft-select' │
│ | 'vsoft-date-picker'; │
│ │
│ export type TipoDado = 'string' | 'number' | 'boolean' | 'array'; │
│ │
│ export type CondicaoOperador = │
│ | '=' | '!=' │
│ | '>' | '>=' | '<' | '<=' │
│ | 'contains' | 'startsWith' │
│ | 'isEmpty' | 'isNotEmpty' │
│ | 'in'; │
│ │
│ export type CondicaoNode = │
│ | { type: 'group'; operador: 'AND' | 'OR'; children: CondicaoNode[] } │
│ | { type: 'rule'; field: string; operador: CondicaoOperador; value?: unknown }; │
│ │
│ export interface CampoEtapa { │
│ id: string; │
│ etapaUIId: string; │
│ paiId?: string | null; │
│ filhos: CampoEtapa[]; │
│ nomeCampo: string; │
│ tipoComponente: TipoComponente; │
│ tipoDado: TipoDado; │
│ obrigatorio: boolean; │
│ ordem: number; │
│ props: Record<string, any>; │
│ propsJson: string; │
│ keyMapper: string; │
│ } │
│ │
│ export interface RegraValidacao { │
│ id: string; │
│ etapaUIId: string; │
│ condicoes: CondicaoNode; // raiz sempre é um group │
│ condicoesJson: string; │
│ mensagemErroUI: string; │
│ } │
│ │
│ export interface EtapaUI { │
│ id: string; │
│ flowId: string; │
│ stageId: string; │
│ nome: string; │
│ campos: CampoEtapa[]; │
│ regras: RegraValidacao[]; │
│ } │
│ │
│ Nota sobre condicoes: Record<string, any> do contrato: mantemos CondicaoNode como forma tipada │
│ internamente, mas ela é estruturalmente Record<string, any>-compatível (nenhum campo │
│ exótico). Na assinatura final exportada para o payload podemos fazer um cast as Record<string, │
│ any> ou simplesmente estreitar o tipo de RegraValidacao.condicoes — mantendo compatibilidade │
│ com o contrato do backend. │
│ │
│ --- │
│ Serialização (src/shared/utils/server-driven-ui.ts) │
│ │
│ Núcleo: │
│ export function serializeCampo(c: CampoEtapa): CampoEtapa { │
│ return { │
│ ...c, │
│ propsJson: JSON.stringify(c.props ?? {}), │
│ filhos: (c.filhos ?? []).map(serializeCampo), │
│ }; │
│ } │
│ │
│ export function serializeRegra(r: RegraValidacao): RegraValidacao { │
│ return { ...r, condicoesJson: JSON.stringify(r.condicoes) }; │
│ } │
│ │
│ export function serializeEtapaUI(opts: { │
│ id: string; flowId: string; stageId: string; nome: string; │
│ campos: CampoEtapa[]; regras: RegraValidacao[]; │
│ }): EtapaUI { │
│ return { │
│ ...opts, │
│ campos: opts.campos.map(serializeCampo), │
│ regras: opts.regras.map(serializeRegra), │
│ }; │
│ } │
│ │
│ export function flattenKeyMappers(campos: CampoEtapa[]): Array<{ keyMapper: string; nomeCampo: │
│ string }> { │
│ // Recursivo em filhos — usado pelo picker de campo no rule builder │
│ } │
│ │
│ Filosofia: propsJson / condicoesJson não são guardados mutavelmente no estado (evita drift com │
│ props / condicoes). São materializados no momento de gerar o payload. No state do Vue, só │
│ props e condicoes são editáveis. │
│ │
│ --- │
│ UI — fluxo do usuário │
│ │
│ FlowNodeServerDrivenUI │
│ ├── FlowNodeContainer (título "Interface dinâmica") │
│ │ ├── Seção "Campos" │
│ │ │ ├── FlowNodeServerDrivenButtonAdd (label="Adicionar campo") → abre CampoModal │
│ │ │ └── FlowNodeServerDrivenItem[] (renderiza filhos recursivamente) │
│ │ ├── Seção "Regras" │
│ │ │ ├── FlowNodeServerDrivenButtonAdd (label="Adicionar regra") → abre RegraModal │
│ │ │ └── FlowNodeServerDrivenRegraItem[] │
│ │ └── Botão "Ver JSON" → abre mini-painel com EtapaUI serializada (copy-to-clipboard) │
│ ├── FlowNodeServerDrivenCampoModal (v-if=openCampoModal) │
│ └── FlowNodeServerDrivenRegraModal (v-if=openRegraModal) │
│ │
│ CampoModal │
│ │
│ Form: │
│ - nomeCampo (input, required) │
│ - tipoComponente (select, required, opções = TipoComponente[]) │
│ - tipoDado (select, required, opções = TipoDado[]) │
│ - keyMapper (input, required, placeholder dadosPessoais.cpf) │
│ - obrigatorio (checkbox) │
│ - ordem (number, auto-incrementado no createCampoEtapa()) │
│ - Props (FlowNodeServerDrivenPropsEditor): lista de { key, value } com botão "+" para novas │
│ entradas; value aceita string/number/boolean; internamente mantém Record<string, any> │
│ │
│ RegraModal │
│ │
│ Form: │
│ - mensagemErroUI (textarea, required) │
│ - Condições (FlowNodeServerDrivenConditionBuilder): componente recursivo começando com um │
│ group AND na raiz │
│ │
│ ConditionBuilder (recursivo) │
│ │
│ Para cada CondicaoNode: │
│ - Se group: toggle AND/OR + botões "+ Regra" / "+ Subgrupo" / "Remover grupo" + renderiza │
│ children (recursão) │
│ - Se rule: select de campo (populado por flattenKeyMappers(campos)), select de operador, input │
│ de valor (tipo dinâmico pelo tipoDado do campo escolhido), botão "Remover" │
│ │
│ Operadores isEmpty / isNotEmpty escondem o input de valor. │
│ Operador in transforma o input em lista separada por vírgula (serializado como array). │
│ │
│ PropsEditor │
│ │
│ Lista de pares key/value. Tipo do valor é detectado: │
│ - "true"/"false" → boolean │
│ - string numérica → number │
│ - senão → string │
│ │
│ Para POC, fica simples; estrutura aninhada pode vir depois. │
│ │
│ --- │
│ Atualização do nó (Pinia) │
│ │
│ FlowNodeServerDrivenUI.vue usa updateNodeData com chaves separadas: │
│ const handleAddCampo = (campo: CampoEtapa) => { │
│ dataNode.value.campos = [...(dataNode.value.campos ?? []), campo]; │
│ updateNodeData({ nodeId: props.id, key: props.data.key, patch: { campos: │
│ dataNode.value.campos } }); │
│ }; │
│ │
│ const handleAddRegra = (regra: RegraValidacao) => { │
│ dataNode.value.regras = [...(dataNode.value.regras ?? []), regra]; │
│ updateNodeData({ nodeId: props.id, key: props.data.key, patch: { regras: │
│ dataNode.value.regras } }); │
│ }; │
│ │
│ Edit/remove seguem o mesmo padrão (mutação por id). │
│ │
│ etapaUIId dos campos/regras = props.id do nó. id do próprio CampoEtapa/RegraValidacao = │
│ uuidv4() gerado no create\*(). │
│ │
│ --- │
│ Validação partial-fill │
│ │
│ Em src/shared/constants/service-flow-nodes.ts: │
│ [PREVIEW_FLOW.SERVER_DRIVEN_UI]: ['campos'], // era 'items' │
│ │
│ Efeito: um nó sem campos é considerado vazio (ícone de warning). Com campos e sem regras é │
│ válido (regras são opcionais). │
│ │
│ --- │
│ filhos (campos aninhados) │
│ │
│ Esta iteração inclui o shape completo (serialização recursiva + paiId/filhos no tipo), mas a │
│ UI do modal inicialmente não oferece botão "adicionar filho". Campos com filhos são │
│ lidos/renderizados corretamente se vierem da API, mas a edição visual via drag ou nested modal │
│ fica para iteração seguinte. Decisão para limitar complexidade do PR; o usuário pode reverter │
│ e pedir UI de filhos agora se quiser — flag para validar na revisão. │
│ │
│ --- │
│ Plano de execução (ordem sugerida) │
│ │
│ 0. Criar audit.md na pasta server-driven-ui │
│ (src/modules/service-flow/components/add/flow/node/server-driven-ui/audit.md) com o conteúdo │
│ deste plano — registro de decisão/arquitetura co-localizado com o código afetado │
│ 1. Tipos em server-driven-ui.interface.ts + atualização de PatchType e NODE_FIELDS_TO_VALIDATE │
│ 2. Utils de serialização + factories (createCampoEtapa, createRegraValidacao, │
│ createCondicaoGroup, createCondicaoRule) + flattenKeyMappers │
│ 3. FlowNodeServerDrivenPropsEditor.vue (isolado, fácil de testar) │
│ 4. FlowNodeServerDrivenConditionBuilder.vue (recursivo, componente mais complexo) │
│ 5. FlowNodeServerDrivenCampoModal.vue (reaproveita PropsEditor) │
│ 6. FlowNodeServerDrivenRegraModal.vue (reaproveita ConditionBuilder) │
│ 7. FlowNodeServerDrivenRegraItem.vue + ajuste de FlowNodeServerDrivenItem.vue │
│ 8. Refatorar FlowNodeServerDrivenUI.vue com as duas seções + botão "Ver JSON" │
│ 9. Remover tipos/legado antigos (ServerDrivenItem, ServerDrivenCondicoes do modal antigo — o │
│ modal antigo deixa de existir) │
│ │
│ --- │
│ Verificação end-to-end │
│ │
│ 1. yarn dev (ou script equivalente do projeto) e abrir a view de criação de flow │
│ 2. Arrastar um nó Interface dinâmica pro canvas │
│ 3. Seção "Campos": adicionar 2 campos │
│ - Campo A: nomeCampo=CPF, tipoComponente=vsoft-text-input, tipoDado=string, │
│ keyMapper=dadosPessoais.cpf, obrigatorio=true, props={ placeholder: "Digite o CPF", mask: │
│ "cpf" } │
│ - Campo B: nomeCampo=Idade, tipoComponente=vsoft-text-input, tipoDado=number, │
│ keyMapper=dadosPessoais.idade │
│ 4. Seção "Regras": adicionar 1 regra │
│ - condicoes: grupo AND com 2 regras → (dadosPessoais.cpf isNotEmpty) E (dadosPessoais.idade │
│ >= 18) │
│ - mensagemErroUI: "CPF obrigatório e idade mínima 18 anos" │
│ 5. Clicar Ver JSON e validar que o payload gerado tem: │
│ - campos[0].propsJson === JSON.stringify(campos[0].props) │
│ - regras[0].condicoesJson === JSON.stringify(regras[0].condicoes) │
│ - regras[0].condicoes.children[0].field === 'dadosPessoais.cpf' │
│ - filhos: [] e paiId: null em ambos os campos (sem aninhamento neste smoke test) │
│ 6. Editar um campo → props refletem mudanças no propsJson reserializado │
│ 7. Remover um campo que é referenciado numa regra → a regra mostra field como "(campo │
│ removido)" no picker; edição continua funcional (não deve quebrar a UI) │
│ 8. Tipagem: yarn tsc --noEmit (ou script lint:types) deve passar │
│ 9. Se houver suíte de testes existente para esses componentes, rodá-la; caso não haja, não │
│ criar testes nesta iteração (fora do escopo combinado). │
│ │
│ --- │
│ Riscos / pontos de atenção │
│ │
│ - condicoes: Record<string, any> vs. CondicaoNode tipado: mantemos tipagem forte internamente; │
│ ao exportar respeitamos o contrato declarado. Um cast controlado no ponto de serialização │
│ evita relaxar o tipo em todo o código. │
│ - Reatividade de array aninhado: o ConditionBuilder muta children[] recursivamente — usar │
│ [...array] ou splice de forma consistente para evitar perder reatividade do Pinia. │
│ - Edição de campo referenciado: se o usuário altera o keyMapper de um campo já usado em │
│ regras, as regras passam a apontar pra um field inválido. Detectar via flattenKeyMappers e │
│ mostrar badge de aviso na regra; não bloquear a edição. │
│ - Persistência por linguagem: o patch é por linguagem (DEFAULT_LANGUAGES). Campos e regras │
│ fazem sentido por linguagem? Provável não (keyMapper e tipoComponente não são traduzíveis). │
│ Por enquanto seguimos o mesmo padrão dos outros nós (replicar por linguagem); se for consenso │
│ que campos/regras devem ser globais por nó, é um follow-up pequeno.
