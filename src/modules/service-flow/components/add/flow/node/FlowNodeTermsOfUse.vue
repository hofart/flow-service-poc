<template>
  <flow-node-container v-bind="data" class="flow-node--terms">
    <v-box margin="0 0 1em" padding="0">
      <v-text :color="data.color" font-size="13px">
        Confira as informações
      </v-text>
      <v-input
        placeholder="Descrição dos termos"
        size="medium"
        hide-label
        v-model="dataNode.name"
        @change="handleUpdate"
      />
    </v-box>

    <v-box direction="column" gap="4px" padding="0" margin="0 0 0.41em">
      <v-text :color="data.color" font-size="14px" font-weight="600">
        Texto do termo de uso
      </v-text>
      <v-box
        padding="4px 0 4px 12px"
        direction="row"
        justify="between"
        align="center"
        class="flow-node__edit-terms"
        round="8px"
        background="white"
      >
        <v-text font-size="13px">Editar texto</v-text>
        <v-button
          icon="v-edit2"
          icon-button
          @click="handleOpenTermsEdit(props.id)"
        />
      </v-box>
    </v-box>
  </flow-node-container>
</template>

<script setup lang="ts">
  import { useFlowBuilderNodes } from 'modules/service-flow/hooks/useFlowBuilderNodes';
  import { NodeProps } from '@vue-flow/core';
  import { computed } from 'vue';
  import FlowNodeContainer from './FlowNodeContainer.vue';
  import { useFlowBuilderTerms } from 'modules/service-flow/hooks/useFlowBuilderTerms';

  const props = defineProps<NodeProps>();

  const { handleOpenTermsEdit } = useFlowBuilderTerms();

  const { updateNodeData, getValueByLanguage } = useFlowBuilderNodes();

  const dataNode = computed(() => getValueByLanguage(props.data.patch));

  const handleUpdate = (event: Event) => {
    const target = event.target as HTMLInputElement;

    const params = {
      nodeId: props.id,
      key: props.data.key,
      patch: {
        name: target.value,
      },
    };

    updateNodeData(params);
  };

  const data = computed(() => ({
    ...props,
    color: '#4F7CA0',
    title: 'Termos de uso e privacidade',
  }));
</script>

<style lang="scss">
  .flow-node {
    &--terms {
      .v-input__container {
        border: 1px solid oklch(0.91 0.03 243.17);
      }
    }
  }
</style>
