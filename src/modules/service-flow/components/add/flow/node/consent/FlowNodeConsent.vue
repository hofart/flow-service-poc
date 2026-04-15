<template>
  <div class="flow-node--consent">
    <flow-node-container v-bind="data">
      <v-box margin="0 0 1em" padding="0">
        <v-text font-size="13px" :color="data.color">
          Preencha as informações
        </v-text>
        <v-input
          hide-label
          placeholder="Nome consentimento"
          size="medium"
          v-model="dataNode.name"
          @change="handleUpdate($event, 'name')"
        />

        <v-input
          multiline
          :rows="6"
          hide-label
          placeholder="Descrição consentimento"
          v-model="dataNode.description"
          @change="handleUpdate($event, 'description')"
        />
      </v-box>

      <v-box direction="column" gap="4px" padding="0" margin="0 0 0.41em">
        <v-text font-size="14px" :color="data.color" font-weight="600">
          Itens de consentimento
        </v-text>
        <flow-node-consent-button-add @open="handleOpenModal" />
        <flow-node-consent-item
          v-for="item in dataNode.items"
          :item="item"
          @edit="handleEditConsent"
        />
      </v-box>
    </flow-node-container>

    <flow-node-consent-modal
      v-bind="data"
      @close="handleCloseModal"
      @submit="handleAddNewItem"
      :item="currentItem"
      v-if="openModalConsent"
    />
  </div>
</template>

<script setup lang="ts">
  import { NodeProps } from '@vue-flow/core';
  import { computed, defineAsyncComponent, ref } from 'vue';
  import { useFlowBuilderNodes } from 'modules/service-flow/hooks/useFlowBuilderNodes';
  import FlowNodeContainer from '../FlowNodeContainer.vue';
  import type { FormItem } from './FlowNodeConsentModal.vue';
  import FlowNodeConsentButtonAdd from './FlowNodeConsentButtonAdd.vue';
  import FlowNodeConsentItem from './FlowNodeConsentItem.vue';

  const FlowNodeConsentModal = defineAsyncComponent(
    () => import('./FlowNodeConsentModal.vue')
  );

  const props = defineProps<NodeProps>();

  const openModalConsent = ref(false);

  const currentItem = ref<Partial<FormItem>>();

  const { updateNodeData, getValueByLanguage } = useFlowBuilderNodes();

  const dataNode = computed(() => getValueByLanguage(props.data.patch));

  const data = computed(() => ({
    ...props,
    color: '#07B6B4',
    title: 'Consentimento de dados',
  }));

  const handleOpenModal = () => {
    openModalConsent.value = true;
  };

  const handleCloseModal = () => {
    openModalConsent.value = false;
    currentItem.value = undefined;
  };

  const handleUpdatePatchNode = (key: string, value: unknown) => {
    const params = {
      nodeId: props.id,
      key: props.data.key,
      patch: {
        [key]: value,
      },
    };

    updateNodeData(params);
  };

  const handleAddNewItem = (item: FormItem) => {
    dataNode.value.items.push(item);

    handleUpdatePatchNode('items', dataNode.value.items);

    handleCloseModal();
  };

  const handleEditConsent = (item: Partial<FormItem>) => {
    currentItem.value = item;

    handleOpenModal();
  };

  const handleUpdate = (event: Event, key: string) => {
    const target = event.target as HTMLInputElement;

    handleUpdatePatchNode(key, target.value);
  };
</script>

<style lang="scss">
  .flow-node {
    &--consent {
      position: relative;
    }
  }
</style>
