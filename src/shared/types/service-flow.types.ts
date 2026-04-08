export enum ELanguageType {
  PtBr = 'PT_BR',
  En = 'EN',
  Es = 'ES',
}

export enum NodeType {
  Home = 'home',
  InitAttendance = 'init-attendance',
  TermsOfUse = 'terms-of-use',
  Consent = 'consents',
  Signature = 'signature',
}

// --- List ---

export type ServiceFlowTag = {
  oid: string;
  name: string;
  isActive: boolean;
};

export type ServiceFlowItem = {
  oid: string;
  name: string;
  isActive: boolean;
  tags: ServiceFlowTag[];
  createdAt: string;
  modifiedAt: string;
  deletedAt?: string;
};

export type ServiceFlowsListResponse = {
  items: ServiceFlowItem[];
  hasMore: boolean;
  totalRecords: number;
};

export type ServiceFlowsListRequest = {
  offSet: number;
  limit: number;
  search?: string;
};

// --- Configuration ---

export type LanguageResponse = {
  key: ELanguageType;
  selected: boolean;
};

export type ServiceFlowConfigurationResponse = {
  oid: string;
  name: string;
  isActive: boolean;
  languages: LanguageResponse[];
};

export type CreateServiceFlowConfigurationRequest = {
  name: string;
  languages: ELanguageType[];
};

export type UpdateServiceFlowConfigurationRequest = {
  id: string;
  name: string;
  languages: ELanguageType[];
};

// --- Nodes ---

export type NodePosition = {
  x: number;
  y: number;
};

export type NodeDataPatch = {
  language: string;
  name?: string;
  description?: string;
  items?: Array<{
    name: string;
    description: string;
    required: boolean;
    initialActive: boolean;
  }>;
  partialFilled?: boolean;
  empty?: boolean;
};

export type FlowNodeData = {
  key: string;
  label: string;
  description?: string;
  patch?: NodeDataPatch[];
};

export type FlowNode = {
  id: string;
  type: NodeType;
  data: FlowNodeData;
  position: NodePosition;
  connectable?: boolean;
  selected?: boolean;
};

export type FlowEdge = {
  id: string;
  source: string;
  target: string;
};

export type ServiceFlowNodesResponse = {
  nodes: FlowNode[];
  edges: FlowEdge[];
};

export type CreateServiceFlowNodesRequest = {
  id: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
};

export type UpdateServiceFlowNodesRequest = {
  id: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
};

// --- Side Menu ---

export type ServiceFlowSideMenuItem = {
  label: string;
  value: string;
  items: ServiceFlowSideMenuItem[];
};

// --- Status ---

export type ChangeServiceFlowStatusRequest = {
  oid: string;
  isActive: boolean;
};
