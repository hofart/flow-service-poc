import { PatchType } from 'shared/models/service-flow-nodes.interface';
import {
  CampoEtapa,
  RegraValidacao,
} from 'shared/models/server-driven-ui.interface';
import { PREVIEW_FLOW } from 'shared/models/service-flow.interface';

export const GAP = 60;

export const DEFAULT_WIDTH = 180;

export const DEFAULT_Y = 328;

export const DEFAULT_LANGUAGES: PatchType[] = [
  {
    language: 'PORTUGUESE',
    description: '',
    name: '',
    items: [],
    partialFilled: false,
    empty: true,
  },
  {
    language: 'ENGLISH',
    description: '',
    name: '',
    items: [],
    partialFilled: false,
    empty: true,
  },
  {
    language: 'SPANISH',
    description: '',
    name: '',
    items: [],
    partialFilled: false,
    empty: true,
  },
];

const ETAPA_ID_MOCK = '8f3b2d1e-9c4a-4b7d-a1e2-5f6c8b9a0d1e';

const CAMPOS_MOCK: CampoEtapa[] = [
  {
    id: 'c1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c',
    etapaUIId: ETAPA_ID_MOCK,
    paiId: null,
    filhos: [],
    nomeCampo: 'Nome Completo',
    tipoComponente: 'vsoft-text-input',
    tipoDado: 'string',
    obrigatorio: true,
    ordem: 1,
    propsJson: '{"placeholder":"Digite seu nome completo","maxLength":100}',
    props: { placeholder: 'Digite seu nome completo', maxLength: 100 },
    keyMapper: 'dadosPessoais.nomeCompleto',
  },
  {
    id: 'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b',
    etapaUIId: ETAPA_ID_MOCK,
    paiId: null,
    filhos: [],
    nomeCampo: 'Data de Nascimento',
    tipoComponente: 'vsoft-date-picker',
    tipoDado: 'string',
    obrigatorio: true,
    ordem: 2,
    propsJson: '{"format":"DD/MM/YYYY","minDate":"1900-01-01"}',
    props: { format: 'DD/MM/YYYY', minDate: '1900-01-01' },
    keyMapper: 'dadosPessoais.dataNascimento',
  },
];

const REGRAS_MOCK: RegraValidacao[] = [
  {
    id: 'f1e2d3c4-b5a6-9f8e-7d6c-5b4a3f2e1d0c',
    etapaUIId: ETAPA_ID_MOCK,
    condicoes: {
      type: 'group',
      operador: 'AND',
      children: [
        {
          type: 'rule',
          field: 'dadosPessoais.nomeCompleto',
          operador: '>=',
          value: 5,
        },
      ],
    },
    condicoesJson:
      '{"type":"group","operador":"AND","children":[{"type":"rule","field":"dadosPessoais.nomeCompleto","operador":">=","value":5}]}',
    mensagemErroUI: 'O nome completo deve ter pelo menos 5 caracteres.',
  },
];

export const DEFAULT_SERVER_DRIVEN_UI_PATCH: PatchType[] =
  DEFAULT_LANGUAGES.map((lang) => ({
    ...lang,
    fluxoId: 'fluxo-cpf-demo',
    etapaId: ETAPA_ID_MOCK,
    nomeEtapa: 'Dados Pessoais',
    tipoEtapa: 0,
    campos: CAMPOS_MOCK,
    regras: REGRAS_MOCK,
  }));

export const NODE_FIELDS_TO_VALIDATE: Record<string, string[]> = {
  [PREVIEW_FLOW.INIT_ATTENDANCE]: ['description'],
  [PREVIEW_FLOW.TERMS_OF_USE]: ['name', 'description'],
  [PREVIEW_FLOW.CONSENT]: ['name', 'description', 'items'],
  [PREVIEW_FLOW.SIGNATURE]: ['name', 'description'],
  [PREVIEW_FLOW.SERVER_DRIVEN_UI]: ['campos'],
};
