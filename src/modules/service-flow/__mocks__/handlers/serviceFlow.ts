import { v4 as uuidv4 } from 'uuid';
import { delay, http, HttpResponse } from 'msw';
import menuFlow from 'modules/service-flow/__mocks__/flow-side-menu.json';
import nodesFlow from 'modules/service-flow/__mocks__/flow-nodes.json';
import configurationFlow from 'modules/service-flow/__mocks__/flow-configurations.json';
import type {
  ServiceFlowItem,
  FlowNode,
  FlowEdge,
  ServiceFlowConfigurationResponse,
  ServiceFlowSideMenuItem,
} from 'shared/types/service-flow.types';
import { ELanguageType } from 'shared/types/service-flow.types';

const dateCreatedAtGenerator = () => {
  const date = new Date();
  const monthRandom = Math.floor(Math.random() * 12);
  date.setMonth(monthRandom);
  date.setHours(0, 0, 0, 0);
  date.setDate(Math.floor(Math.random() * 28) + 1);
  return date.toISOString();
};

const mockItems: ServiceFlowItem[] = Array.from({ length: 50 }, (_, i) => ({
  oid: uuidv4().slice(0, 12),
  name: `Fluxo teste ${i + 1}`,
  createdAt: dateCreatedAtGenerator(),
  modifiedAt: dateCreatedAtGenerator(),
  deletedAt: dateCreatedAtGenerator(),
  isActive: i % 2 === 0,
  tags: [
    { oid: uuidv4(), name: 'Termos de uso', isActive: true },
    { oid: uuidv4(), name: 'OCR', isActive: false },
    { oid: uuidv4(), name: 'Liveness', isActive: true },
  ],
}));

let mockNodes: FlowNode[] = nodesFlow.nodes.map((node) => ({
  ...node,
  type: node.type as FlowNode['type'],
  data: {
    ...node.data,
    patch: node.data.patch?.map((pt) => ({ ...pt })),
  },
})) as unknown as FlowNode[];

let mockEdges: FlowEdge[] = nodesFlow.edges.map((ed) => ({
  id: ed.id,
  source: ed.source,
  target: ed.target,
}));

let serviceFlowConfigurationMock: ServiceFlowConfigurationResponse = {
  oid: configurationFlow.oid,
  name: configurationFlow.name,
  languages: configurationFlow.languages.map((lang) => ({
    key: lang.key as ELanguageType,
    selected: lang.selected,
  })),
  isActive: configurationFlow.isActive,
};

const menuFlowItems = menuFlow as unknown as ServiceFlowSideMenuItem[];

export const serviceFlowHandlers = [
  // GET /api/service-flows
  http.get('/api/service-flows', async ({ request }) => {
    await delay(2000);
    const url = new URL(request.url);
    const offSet = Number(url.searchParams.get('offSet') ?? 0);
    const limit = Number(url.searchParams.get('limit') ?? 20);
    const search = url.searchParams.get('search') ?? '';

    if (!limit) {
      return HttpResponse.json(
        { message: 'limit is required' },
        { status: 400 }
      );
    }

    let filteredItems = mockItems;
    if (search) {
      filteredItems = mockItems.filter(
        (item) =>
          item.name.includes(search) ||
          item.tags.some((tag) => tag.name.includes(search))
      );
    }

    const items = filteredItems.slice(offSet, offSet + limit);
    const hasMore = offSet + limit < filteredItems.length;

    return HttpResponse.json({
      items,
      hasMore,
      totalRecords: filteredItems.length,
    });
  }),

  // GET /api/service-flows/:flowId/nodes
  http.get('/api/service-flows/:flowId/nodes', async ({ params }) => {
    const { flowId } = params;
    if (!flowId) {
      return HttpResponse.json(
        { message: 'flowId is required' },
        { status: 400 }
      );
    }
    return HttpResponse.json({ nodes: mockNodes, edges: mockEdges });
  }),

  // GET /api/service-flows/:flowId/configuration
  http.get('/api/service-flows/:flowId/configuration', async () => {
    if (!serviceFlowConfigurationMock) {
      return HttpResponse.json(
        { message: 'Configuration not found' },
        { status: 404 }
      );
    }
    return HttpResponse.json(serviceFlowConfigurationMock);
  }),

  // GET /api/service-flows/side-menu
  http.get('/api/service-flows/side-menu', async () => {
    return HttpResponse.json(menuFlowItems);
  }),

  // POST /api/service-flows
  http.post('/api/service-flows', async ({ request }) => {
    await delay(2000);
    const body = (await request.json()) as {
      name?: string;
      languages?: string[];
    };
    if (!body?.name) {
      return HttpResponse.json(
        { message: 'name is required' },
        { status: 400 }
      );
    }
    const newFlow: ServiceFlowItem = {
      oid: uuidv4(),
      name: body.name,
      isActive: true,
      tags: [],
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
    };
    mockItems.unshift(newFlow);
    return HttpResponse.json(newFlow, { status: 201 });
  }),

  // POST /api/service-flows/:flowId/nodes
  http.post('/api/service-flows/:flowId/nodes', async ({ params, request }) => {
    await delay(2000);
    const { flowId } = params;
    if (!flowId) {
      return HttpResponse.json(
        { message: 'flowId is required' },
        { status: 400 }
      );
    }
    const body = (await request.json()) as {
      nodes?: FlowNode[];
      edges?: FlowEdge[];
    };
    mockNodes = body?.nodes ?? mockNodes;
    mockEdges = body?.edges ?? mockEdges;
    return HttpResponse.json(
      { nodes: mockNodes, edges: mockEdges },
      { status: 201 }
    );
  }),

  // PUT /api/service-flows/:flowId/configuration
  http.put(
    '/api/service-flows/:flowId/configuration',
    async ({ params, request }) => {
      await delay(1000);
      const { flowId } = params;
      if (!flowId) {
        return HttpResponse.json(
          { message: 'flowId is required' },
          { status: 400 }
        );
      }
      const body =
        (await request.json()) as Partial<ServiceFlowConfigurationResponse>;
      serviceFlowConfigurationMock = {
        ...serviceFlowConfigurationMock,
        ...body,
      };
      return HttpResponse.json(serviceFlowConfigurationMock);
    }
  ),

  // PUT /api/service-flows/:flowId/nodes
  http.put('/api/service-flows/:flowId/nodes', async ({ params, request }) => {
    await delay(1000);
    const { flowId } = params;
    if (!flowId) {
      return HttpResponse.json(
        { message: 'flowId is required' },
        { status: 400 }
      );
    }
    const body = (await request.json()) as {
      nodes?: FlowNode[];
      edges?: FlowEdge[];
    };
    mockNodes = body?.nodes ?? mockNodes;
    mockEdges = body?.edges ?? mockEdges;
    return HttpResponse.json({ nodes: mockNodes, edges: mockEdges });
  }),

  // PUT /api/service-flows/side-menu
  http.put('/api/service-flows/side-menu', async () => {
    await delay(500);
    return HttpResponse.json({ message: 'Side menu updated' });
  }),

  // PATCH /api/service-flows/:flowId/status
  http.patch(
    '/api/service-flows/:flowId/status',
    async ({ params, request }) => {
      await delay(500);
      const { flowId } = params;
      const body = (await request.json()) as { isActive?: boolean };

      const idx = mockItems.findIndex((item) => item.oid === flowId);
      if (idx === -1) {
        return HttpResponse.json(
          { message: 'Fluxo não encontrado' },
          { status: 404 }
        );
      }

      mockItems[idx] = { ...mockItems[idx], isActive: Boolean(body?.isActive) };
      return HttpResponse.json({
        id: flowId,
        message: `Status atualizado para ${body?.isActive ? 'ativo' : 'inativo'}`,
      });
    }
  ),

  // DELETE /api/service-flows/:flowId
  http.delete('/api/service-flows/:flowId', async ({ params }) => {
    await delay(1000);
    const { flowId } = params;
    if (!flowId) {
      return HttpResponse.json(
        { message: 'flowId is required' },
        { status: 400 }
      );
    }
    const idx = mockItems.findIndex((item) => item.oid === flowId);
    if (idx === -1) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    }
    mockItems.splice(idx, 1);
    return HttpResponse.json({ id: flowId, message: 'Flow deleted.' });
  }),

  // DELETE /api/service-flows/:flowId/nodes
  http.delete('/api/service-flows/:flowId/nodes', async ({ params }) => {
    await delay(1000);
    const { flowId } = params;
    if (!flowId) {
      return HttpResponse.json(
        { message: 'flowId is required' },
        { status: 400 }
      );
    }
    mockNodes = [];
    mockEdges = [];
    return HttpResponse.json({ id: flowId, message: 'Nodes deleted.' });
  }),
];
