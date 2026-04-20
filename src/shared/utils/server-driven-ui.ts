import { v4 as uuidv4 } from 'uuid';
import type {
  CampoEtapa,
  CondicaoNode,
  EtapaUI,
  InicioEtapa,
  RegraValidacao,
} from 'shared/models/server-driven-ui.interface';

export function serializeCampo(c: CampoEtapa): CampoEtapa {
  return {
    ...c,
    propsJson: JSON.stringify(c.props ?? {}),
    filhos: (c.filhos ?? []).map(serializeCampo),
  };
}

export function serializeRegra(r: RegraValidacao): RegraValidacao {
  return { ...r, condicoesJson: JSON.stringify(r.condicoes) };
}

export function serializeEtapaUI(opts: {
  fluxoId: string;
  etapaId: string;
  nome: string;
  tipo: number;
  campos: CampoEtapa[];
  regras: RegraValidacao[];
}): EtapaUI {
  return {
    ...opts,
    campos: opts.campos.map(serializeCampo),
    regras: opts.regras.map(serializeRegra),
  };
}

export function serializeInicioEtapa(etapaId: string, tipo = 0): InicioEtapa {
  return { etapaId, tipo };
}

export function flattenKeyMappers(
  campos: CampoEtapa[]
): Array<{ keyMapper: string; nomeCampo: string }> {
  return campos.flatMap((c) => [
    { keyMapper: c.keyMapper, nomeCampo: c.nomeCampo },
    ...flattenKeyMappers(c.filhos ?? []),
  ]);
}

export function createCampoEtapa(etapaUIId: string, ordem: number): CampoEtapa {
  return {
    id: uuidv4(),
    etapaUIId,
    paiId: null,
    filhos: [],
    nomeCampo: '',
    tipoComponente: 'vsoft-text-input',
    tipoDado: 'string',
    obrigatorio: false,
    ordem,
    props: {},
    propsJson: '{}',
    keyMapper: '',
  };
}

export function createRegraValidacao(etapaUIId: string): RegraValidacao {
  return {
    id: uuidv4(),
    etapaUIId,
    condicoes: createCondicaoGroup(),
    condicoesJson: '',
    mensagemErroUI: '',
  };
}

export function createCondicaoGroup(): Extract<
  CondicaoNode,
  { type: 'group' }
> {
  return { type: 'group', operador: 'AND', children: [] };
}

export function createCondicaoRule(): Extract<CondicaoNode, { type: 'rule' }> {
  return { type: 'rule', field: '', operador: '=', value: '' };
}
