export interface ParamsUpdateConsentItem {
  nodeId: string;
  index: number;
  patch: Partial<any>;
}

export interface ItemPatch {
  name: string;
  description: string;
  required: boolean;
  initialActive: boolean;
}

export interface ParamsUpdateNode<T> {
  nodeId: string;
  key: string;
  patch: Record<string, T>;
}

export interface PatchType {
  language: string;
  description?: string;
  name?: string;
  items?: ItemPatch[];
  campos?: import('./server-driven-ui.interface').CampoEtapa[];
  regras?: import('./server-driven-ui.interface').RegraValidacao[];
  fluxoId?: string;
  etapaId?: string;
  nomeEtapa?: string;
  tipoEtapa?: number;
  partialFilled?: boolean;
  empty?: boolean;
}

export interface InputPatch {
  currentPatch: PatchType[];
  patch: Partial<PatchType>;
  key: string;
}
