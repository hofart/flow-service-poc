<template>
  <flow-node-container v-bind="data" class="c-flow-builder-card-init">
    <v-text font-size="12px">Informações da tela inicial</v-text>

    <v-input
      multiline
      placeholder="Descrição da jornada"
      :rows="4"
      hide-label
      v-model="dataNode.description"
      @input="handleUpdate"
    />

    <v-text font-size="12px" margin="1em 0 1em">
      *A listagem com as etapas de atendimento será exibida abaixo do texto
      acima para o usuário.
    </v-text>
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
    color: '#838383',
    title: 'Início do atendimento',
  }));
</script>
