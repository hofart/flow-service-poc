<template>
  <div class="flow-node--server-driven-ui">
    <flow-node-container v-bind="data">
      <v-box direction="column" gap="4px" padding="0" margin="0 0 0.41em">
        <v-text font-size="12px" :color="data.color">
          Componentes de interface
        </v-text>

        <flow-node-server-driven-button-add @open="handleOpenModal" />

        <flow-node-server-driven-item
          v-for="(item, index) in items"
          :key="index"
          :item="item"
          @edit="handleEditItem"
        />
      </v-box>
    </flow-node-container>

    <flow-node-server-driven-modal
      v-bind="data"
      @close="handleCloseModal"
      @submit="handleAddNewItem"
      :item="currentItem"
      v-if="openModal"
    />
  </div>
</template>

<script setup lang="ts">
  import { NodeProps } from '@vue-flow/core';
  import { computed, ref } from 'vue';
  import { useFlowBuilderNodes } from 'modules/service-flow/hooks/useFlowBuilderNodes';
  import FlowNodeContainer from '../FlowNodeContainer.vue';
  import FlowNodeServerDrivenButtonAdd from './FlowNodeServerDrivenButtonAdd.vue';
  import FlowNodeServerDrivenItem from './FlowNodeServerDrivenItem.vue';
  import FlowNodeServerDrivenModal from './FlowNodeServerDrivenModal.vue';
  import type { ServerDrivenItem } from './FlowNodeServerDrivenModal.vue';

  const props = defineProps<NodeProps>();

  const openModal = ref(false);

  const currentItem = ref<Partial<ServerDrivenItem>>();

  const { updateNodeData, getValueByLanguage } = useFlowBuilderNodes();

  const dataNode = computed(() => getValueByLanguage(props.data.patch));

  const items = computed(
    () => (dataNode.value.items ?? []) as unknown as Partial<ServerDrivenItem>[]
  );

  const data = computed(() => ({
    ...props,
    color: '#6C63FF',
    title: 'Interface dinâmica',
  }));

  const handleOpenModal = () => {
    openModal.value = true;
  };

  const handleCloseModal = () => {
    openModal.value = false;
    currentItem.value = undefined;
  };

  const handleUpdatePatchNode = (key: string, value: unknown) => {
    updateNodeData({
      nodeId: props.id,
      key: props.data.key,
      patch: { [key]: value },
    });
  };

  const handleAddNewItem = (item: ServerDrivenItem) => {
    (dataNode.value.items as unknown as ServerDrivenItem[]).push(item);

    handleUpdatePatchNode('items', dataNode.value.items);

    handleCloseModal();
  };

  const handleEditItem = (item: Partial<ServerDrivenItem>) => {
    currentItem.value = item;
    handleOpenModal();
  };
</script>

<style lang="scss">
  .flow-node {
    &--server-driven-ui {
      position: relative;
    }
  }
</style>
