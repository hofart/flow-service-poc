<template>
  <main-layout class="p-service-flow" full-layout>
    <v-box
      class="p-service-flow__container"
      direction="row"
      padding="0"
      justify="between"
      height="calc(100vh - 60px)"
    >
      <flow-builder-terms-edit v-if="isOpenTermsEdit" />
      <v-box
        v-else
        class="p-service-flow__container-content"
        width="100%"
        padding="0"
      >
        <flow-builder-header />
        <v-context-menu :items="contextMenu" :enabled="isSelected">
          <v-short-cuts :items="shortCuts" :enabled="isSelected">
            <flow-builder-container />
          </v-short-cuts>
        </v-context-menu>
      </v-box>
      <flow-builder-side-menu />
    </v-box>
  </main-layout>
</template>
<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { useFlowBuilderTerms } from '../hooks/useFlowBuilderTerms';
  import { VContextMenu, VShortCuts } from 'vsoft-design-system';
  import { computed, defineAsyncComponent, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { useFlowBuilderNodes } from '../hooks/useFlowBuilderNodes';
  import { useServiceFlow } from '../hooks/useServiceFlow';

  const FlowBuilderHeader = defineAsyncComponent(
    () => import('../components/add/FlowBuilderHeader.vue')
  );
  const FlowBuilderSideMenu = defineAsyncComponent(
    () => import('../components/add/side-menu/FlowBuilderSideMenu.vue')
  );
  const FlowBuilderContainer = defineAsyncComponent(
    () => import('../components/add/flow/FlowBuilderContainer.vue')
  );
  const FlowBuilderTermsEdit = defineAsyncComponent(
    () => import('../components/add/flow/terms/FlowBuilderTermsEdit.vue')
  );

  const props = defineProps<{ flowId?: string }>();

  let route: ReturnType<typeof useRoute> | undefined;
  try {
    route = useRoute();
  } catch {
    route = undefined;
  }

  const { loadFlowData } = useServiceFlow();

  const resolvedFlowId = computed(
    () => props.flowId ?? (route?.params.flowId as string | undefined)
  );

  watch(
    resolvedFlowId,
    (flowId) => {
      if (flowId) loadFlowData(flowId);
    },
    { immediate: true }
  );

  const { isOpenTermsEdit } = storeToRefs(useFlowBuilderTerms());

  const storeFlowNodes = useFlowBuilderNodes();

  const { handleDeleteNode, handleCopyEvent, handlePasteEvent } =
    storeFlowNodes;

  const { dataClipboardNode, selectedNode } = storeToRefs(storeFlowNodes);

  const isSelected = computed(() => Boolean(selectedNode.value?.id));

  const hasClipboard = computed(() => Boolean(dataClipboardNode.value?.id));

  const contextMenu = computed(() => [
    {
      id: '1',
      name: 'Copiar',
      description: 'CTRL+SHIFT+C',
      action: () => handleCopyEvent(),
    },
    {
      id: '2',
      name: 'Colar',
      description: 'CTRL+SHIFT+V',
      disabled: !hasClipboard.value,
      action: () => handlePasteEvent(),
    },
    {
      id: 'divider',
    },
    {
      id: '3',
      name: 'Deletar',
      description: 'SHIFT+Del',
      disabled: !isSelected.value,
      action: () => handleDeleteNode(),
    },
  ]);

  const shortCuts = computed(() => [
    {
      name: 'Copiar',
      command: ['ctrl', 'shift', 'c'],
      action: () => handleCopyEvent(),
    },
    {
      name: 'Colar',
      command: ['ctrl', 'shift', 'v'],
      action: () => handlePasteEvent(),
    },
    {
      name: 'Deletar',
      command: ['shift', 'del'],
      action: () => handleDeleteNode(),
    },
  ]);
</script>
