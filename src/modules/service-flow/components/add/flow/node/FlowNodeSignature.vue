<template>
  <flow-node-container v-bind="data" class="c-flow-builder-card-init">
    <v-box margin="0 0 " padding="0">
      <v-text font-size="13px" :color="data.color">
        {{ $t('modules.serviceFlow.views.add.flows.node.signature.title') }}
      </v-text>
      <v-input
        hide-label
        :placeholder="
          $t(
            'modules.serviceFlow.views.add.flows.node.signature.placeholders.titleSignature'
          )
        "
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
        {{
          $t(
            'modules.serviceFlow.views.add.flows.node.signature.fields.additionalText'
          )
        }}
      </v-text>
      <v-input
        multiline
        :rows="6"
        hide-label
        :placeholder="
          $t(
            'modules.serviceFlow.views.add.flows.node.signature.placeholders.additionalText'
          )
        "
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
  import { useTranslation } from 'i18next-vue';

  const { t } = useTranslation();

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
    title: t('modules.serviceFlow.views.add.flows.node.signature.title'),
  }));
</script>
