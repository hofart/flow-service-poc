<template>
  <flow-node-container v-bind="data" class="c-flow-builder-card-init">
    <v-box margin="0 0 " padding="0">
      <v-text font-size="13px" :color="data.color">
        Captura de assinatura
      </v-text>
      <v-input
        hide-label
        placeholder="Título da assinatura"
        size="medium"
        v-model="dataNode.name"
        @change="handleUpdate($event, 'name')"
      />
      <v-text
        font-size="13px"
        font-weight="600"
        :color="data.color"
        margin="1em 0"
      >
        Texto adicional
      </v-text>
      <v-input
        multiline
        :rows="6"
        hide-label
        placeholder="Texto adicional"
        v-model="dataNode.description"
        @change="handleUpdate($event, 'description')"
      />
    </v-box>
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

  const handleUpdate = (event: Event, key: string) => {
    const target = event.target as HTMLInputElement;

    const params = {
      nodeId: props.id,
      key: props.data.key,
      patch: {
        [key]: target.value,
      },
    };

    updateNodeData(params);
  };

  const data = computed(() => ({
    ...props,
    color: '#B05066',
    title: 'Captura de assinatura',
  }));
</script>
