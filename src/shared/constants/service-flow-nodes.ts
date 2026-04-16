import { PatchType } from 'shared/models/service-flow-nodes.interface';
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

export const NODE_FIELDS_TO_VALIDATE: Record<string, string[]> = {
  [PREVIEW_FLOW.INIT_ATTENDANCE]: ['description'],
  [PREVIEW_FLOW.TERMS_OF_USE]: ['name', 'description'],
  [PREVIEW_FLOW.CONSENT]: ['name', 'description', 'items'],
  [PREVIEW_FLOW.SIGNATURE]: ['name', 'description'],
  [PREVIEW_FLOW.SERVER_DRIVEN_UI]: ['items'],
};
