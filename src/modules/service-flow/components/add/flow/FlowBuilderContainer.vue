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
  import { useFlowBuilderNodes } from 'modules/service-flow/hooks/useFlowBuilderNodes';
  import FlowBuilderNodes from './FlowBuilderNodes.vue';
  import { Background } from '@vue-flow/background';
  import { VueFlow } from '@vue-flow/core';
  import { Controls } from '@vue-flow/controls';
  import { storeToRefs } from 'pinia';
  import FlowNodePlaceholder from './node/FlowNodePlaceholder.vue';

  const store = useFlowBuilderNodes();

  const { nodes, edges, isDragOver } = storeToRefs(store);

  const { onDrop, onDragOver, onDragLeave } = store;
</script>

<style lang="scss">
  .flow-builder-container {
    box-shadow: inset 0 0 15px 3px rgba(0, 0, 0, 0.03) !important;
  }
</style>
