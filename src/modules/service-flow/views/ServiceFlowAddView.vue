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
  import FlowBuilderHeader from '../components/add/FlowBuilderHeader.vue';
  import FlowBuilderSideMenu from '../components/add/side-menu/FlowBuilderSideMenu.vue';
  import FlowBuilderContainer from '../components/add/flow/FlowBuilderContainer.vue';
  import FlowBuilderTermsEdit from '../components/add/flow/terms/FlowBuilderTermsEdit.vue';
  import { VContextMenu, VShortCuts } from 'vsoft-design-system';
  import { computed } from 'vue';
  import { useFlowBuilderNodes } from '../hooks/useFlowBuilderNodes';
  import { t } from 'i18next';

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
      name: t('modules.serviceFlow.views.add.contextMenu.copy'),
      description: t(
        'modules.serviceFlow.views.add.contextMenu.shortcuts.copy'
      ),
      action: () => handleCopyEvent(),
    },
    {
      id: '2',
      name: t('modules.serviceFlow.views.add.contextMenu.paste'),
      description: t(
        'modules.serviceFlow.views.add.contextMenu.shortcuts.paste'
      ),
      disabled: !hasClipboard.value,
      action: () => handlePasteEvent(),
    },
    {
      id: 'divider',
    },
    {
      id: '3',
      name: t('modules.serviceFlow.views.add.contextMenu.delete'),
      description: t(
        'modules.serviceFlow.views.add.contextMenu.shortcuts.delete'
      ),
      disabled: !isSelected.value,
      action: () => handleDeleteNode(),
    },
  ]);

  const shortCuts = computed(() => [
    {
      name: t('modules.serviceFlow.views.add.contextMenu.copy'),
      command: ['ctrl', 'shift', 'c'],
      action: () => handleCopyEvent(),
    },
    {
      name: t('modules.serviceFlow.views.add.contextMenu.paste'),
      command: ['ctrl', 'shift', 'v'],
      action: () => handlePasteEvent(),
    },
    {
      name: t('modules.serviceFlow.views.add.contextMenu.delete'),
      command: ['shift', 'del'],
      action: () => handleDeleteNode(),
    },
  ]);
</script>
