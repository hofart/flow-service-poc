<template>
  <flow-node-container v-bind="data" class="c-flow-builder-card-init">
    <v-text font-size="12px" class="c-flow-builder-card-init__sub-title">
      Informações da tela inicial
    </v-text>

    <v-input
      multiline
      placeholder="Vamos iniciar o seu cadastro. Durante a operação você passará pelas seguintes etapas:"
      :rows="4"
      hide-label
      v-model="dataNode.description"
      @input="handleUpdate"
    />
  </flow-node-container>
</template>

<script setup lang="ts">
  import { NodeProps } from '@vue-flow/core';
  import { computed } from 'vue';
  import { useFlowBuilderNodes } from 'modules/service-flow/hooks/useFlowBuilderNodes';
  import FlowNodeContainer from './FlowNodeContainer.vue';

  const props = defineProps<NodeProps>();

  const { updateNodeData, getValueByLanguage } = useFlowBuilderNodes();

  const dataNode = computed(() => getValueByLanguage(props.data.patch));

  const handleUpdate = (event: Event) => {
    const target = event.target as HTMLInputElement;

    const params = {
      nodeId: props.id,
      key: props.data.key,
      patch: {
        description: target.value,
      },
    };

    updateNodeData(params);
  };

  const data = computed(() => ({
    ...props,
    color: '#3A3A3A',
    title: 'Início do atendimento',
  }));
</script>

<style lang="scss" scoped>
  .c-flow-builder-card-init {
    &__sub-title {
      opacity: 0.85;
      margin-bottom: 1rem;
    }
  }
</style>
