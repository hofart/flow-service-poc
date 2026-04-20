import { defineStore, storeToRefs } from 'pinia';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useVueFlow, Edge, NodeProps, Node, GraphNode } from '@vue-flow/core';
import { useFlowBuilderSideMenu } from './useFlowBuilderSideMenu';
import { useFlowBuilderConfig } from './useFlowBuilderConfig';
import { v4 as uuidv4 } from 'uuid';
import {
  PatchType,
  InputPatch,
  ParamsUpdateNode,
  ParamsUpdateConsentItem,
  ItemPatch,
} from 'shared/models/service-flow-nodes.interface';
import {
  DEFAULT_Y,
  DEFAULT_LANGUAGES,
  DEFAULT_SERVER_DRIVEN_UI_PATCH,
  DEFAULT_WIDTH,
  GAP,
  NODE_FIELDS_TO_VALIDATE,
} from 'shared/constants/service-flow-nodes';
import { PREVIEW_FLOW } from 'shared/models/service-flow.interface';
import { useServiceFlow } from './useServiceFlow';

export const useFlowBuilderNodes = defineStore('flowBuilderNodes', () => {
  const storeSideMenu = useFlowBuilderSideMenu();

  const storeServiceFlow = useServiceFlow();

  const { flowNodes } = storeToRefs(storeServiceFlow);

  const { isDragOver, draggedType, isDragging } = storeToRefs(storeSideMenu);

  const { onDragOver, onDragLeave, handleSelectTab } = storeSideMenu;

  const {
    onConnect,
    addEdges,
    setNodes,
    setEdges,
    removeNodes,
    addSelectedNodes,
  } = useVueFlow();

  const selectedNode = ref<NodeProps | null>(null);

  const dataClipboardNode = ref<NodeProps>();

  const nodeData: Node[] = [];

  const nodes = ref<Node[]>(
    nodeData.map((data) => ({
      id: data.id,
      type: 'special',
      position: { x: 0, y: DEFAULT_Y },
      data: {
        key: data.data.key,
        label: data.data.label,
        patch: DEFAULT_LANGUAGES.map((lang) => ({ ...lang })),
      },
    }))
  );

  const homeNode: Node = {
    id: 'home',
    type: 'special',
    position: { x: 20, y: DEFAULT_Y },
    data: { key: 'home', label: 'Início' },
  };

  const edges = ref<Edge[]>([]);

  onConnect(addEdges);

  const configLanguage = computed(() => useFlowBuilderConfig());

  const getNodePostionX = () => {
    let currentX = 20;

    nodes.value.forEach((node) => {
      const el = document.querySelector(`[data-id="${node.id}"]`);
      const elementWidth = el?.getBoundingClientRect().width;
      const width = elementWidth ?? DEFAULT_WIDTH;
      currentX += width + GAP;
    });

    return currentX;
  };

  const getNodePositionY = (nodeId: string) => {
    const node = (nodes.value as unknown as any[]).find((n) => n.id === nodeId);

    if (node && typeof node.position?.y === 'number') {
      return node.position.y;
    }

    return DEFAULT_Y;
  };

  const getNewNodePosition = async () => {
    await nextTick();

    const others = (nodes.value as unknown as any[]).filter(
      (n) => n.id !== 'home'
    ) as Node[];

    const includeHome = others.length > 0;

    const newNodeList = includeHome ? [homeNode, ...others] : [];

    let currentX = 20;

    const updatedNodes: Node[] = [];

    newNodeList.forEach((node) => {
      const el = document.querySelector(`[data-id="${node.id}"]`);

      const width = el?.getBoundingClientRect().width ?? DEFAULT_WIDTH;

      const original = (nodes.value as unknown as any[]).find(
        (n) => n.id === node.id
      );

      const y = original?.position.y ?? DEFAULT_Y;

      updatedNodes.push({
        ...node,
        position: { x: currentX, y },
      });

      currentX += width + GAP;
    });

    nodes.value = updatedNodes;

    edges.value = (updatedNodes as unknown as any[])
      .slice(1)
      .map((node, i) => ({
        id: `e${updatedNodes[i].id}->${node.id}`,
        source: updatedNodes[i].id,
        target: node.id,
      })) as Edge[];
  };

  const focusToNewNode = (nodeId: string) => {
    const el = document.querySelector(`[data-id="${nodeId}"]`) as HTMLElement;

    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
      el.focus();
    }
  };

  const createDataNode = (key?: string, patch?: ItemPatch) => {
    const nodeId = `flow_node_${uuidv4()}`;

    const positionX = getNodePostionX();

    const positionY = getNodePositionY(nodeId);

    const defaultPatch =
      key === PREVIEW_FLOW.SERVER_DRIVEN_UI
        ? DEFAULT_SERVER_DRIVEN_UI_PATCH.map((lang) => ({ ...lang }))
        : DEFAULT_LANGUAGES.map((lang) => ({ ...lang }));

    return {
      id: nodeId,
      type: 'special',
      position: { x: positionX, y: positionY },
      data: {
        key,
        label: nodeId,
        patch: patch ?? defaultPatch,
      },
    };
  };

  const afterCreateNewNode = async (nodeId: string) => {
    await getNewNodePosition();

    await nextTick();

    return focusToNewNode(nodeId);
  };

  const createNewNode = async (key?: string, patch?: ItemPatch) => {
    const newNode = createDataNode(key, patch);

    const filtered = (nodes.value as unknown as any[]).filter(
      (n) => n.id !== 'home'
    ) as Node[];
    nodes.value = [...filtered, newNode];

    await afterCreateNewNode(newNode.id);
  };

  const onDrop = async (event: DragEvent) => {
    const payload = event.dataTransfer?.getData('application/vueflow');

    event.preventDefault();

    await createNewNode(payload);

    isDragging.value = false;

    isDragOver.value = false;

    draggedType.value = null;
  };

  const handleDeleteAll = () => {
    nodes.value = [];
    edges.value = [];
    setNodes([]);
    setEdges([]);
  };

  const handleDeleteNode = async () => {
    if (!selectedNode.value) {
      return;
    }

    const nodeId = selectedNode.value.id;

    removeNodes([nodeId]);

    const index = nodes.value.findIndex((n) => n.id === nodeId);

    if (index !== -1) {
      nodes.value.splice(index, 1);
    }

    await getNewNodePosition();
  };

  const handleDuplicateNode = async () => {
    if (!selectedNode.value) {
      return;
    }

    const node = selectedNode.value;

    const patch = node.data.patch;

    const key = node.data.key;

    createNewNode(key, patch);
  };

  const handleCopyEvent = async () => {
    dataClipboardNode.value = undefined;

    if (!selectedNode.value) {
      return;
    }

    dataClipboardNode.value = selectedNode.value;
  };

  const handlePasteEvent = async () => {
    const src = dataClipboardNode.value;

    if (!src) return;

    const key = src.data.key;

    const patch = src.data.patch ?? DEFAULT_LANGUAGES.map((l) => ({ ...l }));

    const newNode = createDataNode(key, patch);

    const list = (nodes.value as unknown as any[]).filter(
      (n) => n.id !== 'home'
    ) as Node[];

    if (selectedNode.value) {
      const idx = list.findIndex((n) => n.id === selectedNode.value?.id);

      const nodeInsideFlow = [
        ...list.slice(0, idx + 1),
        newNode,
        ...list.slice(idx + 1),
      ];

      const nodeAfterFlow = [...list, newNode];

      nodes.value = idx >= 0 ? nodeInsideFlow : nodeAfterFlow;

      await afterCreateNewNode(newNode.id);

      return;
    }

    nodes.value = [...list, newNode];

    await afterCreateNewNode(newNode.id);
  };

  const handleSelectNode = (node: NodeProps) => {
    selectedNode.value = node;
    addSelectedNodes([node as unknown as GraphNode]);
  };

  const getValueByLanguage = (patch: PatchType[] = []) => {
    const { currentLang } = configLanguage.value;

    const language = String(currentLang?.key);

    const dataPatch = patch.find((data) => data.language === language);

    if (dataPatch) {
      return {
        ...dataPatch,
        items: (dataPatch.items ?? []).map((item) => ({
          ...item,
          name: item.name ?? '',
          description: item.description ?? '',
        })),
      };
    }

    return {
      language,
      description: undefined,
      name: undefined,
      partialFilled: false,
      empty: true,
      items: [],
    };
  };

  const isPartialFilled = (obj: Record<string, unknown>, keys: string[]) => {
    let filled = 0;
    let empty = 0;

    keys.forEach((key) => {
      const value = obj[key];

      const partialCondition = typeof value === 'string' && value.trim() !== '';

      if (partialCondition) {
        filled++;
      } else empty++;
    });

    return filled > 0 && empty > 0;
  };

  const isEmpty = (obj: Record<string, unknown>, keys: string[]) => {
    return keys.every((key) => {
      const value = obj[key];
      return typeof value === 'string' ? value.trim() === '' : !value;
    });
  };

  const updateValueByLanguage = (data: InputPatch) => {
    const { currentLang } = configLanguage.value;

    const language = String(currentLang?.key);

    const currentPatch = data.currentPatch ?? [];

    return Object.entries(data.patch).reduce(
      (acc: PatchType[], [key, value]) => {
        const existing = acc.find((p) => p.language === language);

        const validation = NODE_FIELDS_TO_VALIDATE[data.key];

        if (existing) {
          const updated = { ...existing, [key]: value };

          updated.partialFilled = isPartialFilled(updated, validation);

          updated.empty = isEmpty(updated, validation);

          return acc.map((p) => (p.language === language ? updated : p));
        }

        const newItem = {
          language,
          description: undefined,
          name: undefined,
          partialFilled: false,
          empty: true,
          [key]: value,
        };

        newItem.partialFilled = isPartialFilled(newItem, validation);

        newItem.empty = isEmpty(newItem, validation);

        return [...acc, newItem];
      },
      currentPatch
    );
  };

  const updateNodeData = <T>(params: ParamsUpdateNode<T>) => {
    const { patch, nodeId, key } = params;

    const node = (nodes.value as unknown as any[]).find(
      (n) => n.id === nodeId
    ) as { data: Record<string, unknown> } | undefined;

    if (!node) {
      return;
    }

    const payload = {
      currentPatch: node.data.patch as PatchType[],
      patch,
      key,
    };

    node.data.patch = updateValueByLanguage(payload);
  };

  const addConsentItem = (nodeId: string, item: any) => {
    const node = (nodes.value as unknown as any[]).find((n) => n.id === nodeId);

    if (!node) {
      return;
    }

    if (node.data.type === PREVIEW_FLOW.CONSENT) {
      if (!node.data.items) {
        node.data.items = [];
      }

      node.data.items.push(item);
    }
  };

  const updateConsentItem = (params: ParamsUpdateConsentItem) => {
    const { nodeId, index, patch } = params;
    const node = (nodes.value as unknown as any[]).find((n) => n.id === nodeId);

    if (!node) {
      return;
    }

    const isConsentNode =
      node.data.type === PREVIEW_FLOW.CONSENT && node.data.patch.items?.[index];

    if (isConsentNode) {
      node.data.items[index] = {
        ...node.data.items[index],
        ...patch,
      };
    }
  };

  watch(
    () => flowNodes.value,
    (data) => {
      nodes.value = data.nodes;
      edges.value = data.edges;
    },
    { deep: true, immediate: true }
  );

  onMounted(() => {
    getNewNodePosition();
  });

  const hasNodes = computed(() => nodes.value.length > 0);

  return {
    nodes,
    hasNodes,
    edges,
    isDragOver,
    selectedNode,
    dataClipboardNode,
    onDrop,
    handleDeleteAll,
    handleDeleteNode,
    handleSelectNode,
    updateNodeData,
    addConsentItem,
    updateConsentItem,
    onDragOver,
    onDragLeave,
    handleSelectTab,
    getValueByLanguage,
    updateValueByLanguage,
    handleDuplicateNode,
    handleCopyEvent,
    handlePasteEvent,
    createNewNode,
  };
});
