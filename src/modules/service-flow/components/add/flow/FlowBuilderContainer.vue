<template>
  <v-box
    padding="0"
    height="calc(100vh - 121px)"
    width="100%"
    @drop="onDrop"
    class="flow-builder-container"
    direction="row"
    align="center"
    justify="center"
  >
    <vue-flow
      :nodes="nodes"
      :edges="edges"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
    >
      <Background
        v-if="isDragOver"
        :size="2"
        :gap="20"
        pattern-color="#BDBDBD"
      />
      <Controls position="bottom-right" />
      <flow-node-placeholder v-if="!nodes.length" />
      <template #node-special="specialNodeProps">
        <flow-builder-nodes v-bind="specialNodeProps" />
      </template>
    </vue-flow>
  </v-box>
</template>

<script setup lang="ts">
  import { defineAsyncComponent } from 'vue';
  import { useFlowBuilderNodes } from 'modules/service-flow/hooks/useFlowBuilderNodes';
  import { storeToRefs } from 'pinia';

  const FlowBuilderNodes = defineAsyncComponent(
    () => import('./FlowBuilderNodes.vue')
  );
  const FlowNodePlaceholder = defineAsyncComponent(
    () => import('./node/FlowNodePlaceholder.vue')
  );
  const Background = defineAsyncComponent(async () => {
    const mod = await import('@vue-flow/background');
    return mod.Background;
  });
  const VueFlow = defineAsyncComponent(async () => {
    const mod = await import('@vue-flow/core');
    return mod.VueFlow;
  });
  const Controls = defineAsyncComponent(async () => {
    const mod = await import('@vue-flow/controls');
    return mod.Controls;
  });

  const store = useFlowBuilderNodes();

  const { nodes, edges, isDragOver } = storeToRefs(store);

  const { onDrop, onDragOver, onDragLeave } = store;
</script>

<style lang="scss">
  .flow-builder-container {
    box-shadow: inset 0 0 15px 3px rgba(0, 0, 0, 0.03) !important;
  }
</style>
