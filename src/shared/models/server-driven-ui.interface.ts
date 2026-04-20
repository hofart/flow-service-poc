export type TipoComponente =
  | 'vsoft-text-input'
  | 'vsoft-select'
  | 'vsoft-date-picker';

export type TipoDado = 'string' | 'number' | 'boolean' | 'array';

export type CondicaoOperador =
  | '='
  | '!='
  | '>'
  | '>='
  | '<'
  | '<='
  | 'contains'
  | 'startsWith'
  | 'isEmpty'
  | 'isNotEmpty'
  | 'in';

export type CondicaoNode =
  | { type: 'group'; operador: 'AND' | 'OR'; children: CondicaoNode[] }
  | {
      type: 'rule';
      field: string;
      operador: CondicaoOperador;
      value?: unknown;
    };

export interface CampoEtapa {
  id: string;
  etapaUIId: string;
  paiId?: string | null;
  filhos: CampoEtapa[];
  nomeCampo: string;
  tipoComponente: TipoComponente;
  tipoDado: TipoDado;
  obrigatorio: boolean;
  ordem: number;
  props: Record<string, unknown>;
  propsJson: string;
  keyMapper: string;
}

export interface RegraValidacao {
  id: string;
  etapaUIId: string;
  condicoes: CondicaoNode;
  condicoesJson: string;
  mensagemErroUI: string;
}

export interface EtapaUI {
  fluxoId: string;
  etapaId: string;
  nome: string;
  tipo: number;
  campos: CampoEtapa[];
  regras: RegraValidacao[];
}

export interface InicioEtapa {
  etapaId: string;
  tipo: number;
}
