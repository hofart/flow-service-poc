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
  partialFilled?: boolean;
  empty?: boolean;
}

export interface InputPatch {
  currentPatch: PatchType[];
  patch: Partial<PatchType>;
  key: string;
}
