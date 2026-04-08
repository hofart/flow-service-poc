<template>
  <flow-node-container v-bind="data" class="c-flow-builder-card-init">
    <v-text font-size="12px">
      {{
        $t(
          'modules.serviceFlow.views.add.flows.node.initAttendance.description'
        )
      }}
    </v-text>

    <v-input
      multiline
      :placeholder="
        $t(
          'modules.serviceFlow.views.add.flows.node.initAttendance.placeholder'
        )
      "
      :rows="4"
      hide-label
      v-model="dataNode.description"
      @input="handleUpdate"
    />

    <v-text font-size="12px" margin="1em 0 1em">
      {{
        $t('modules.serviceFlow.views.add.flows.node.initAttendance.infoList')
      }}
    </v-text>
  </flow-node-container>
</template>

<script setup lang="ts">
  import { NodeProps } from '@vue-flow/core';
  import { computed } from 'vue';
  import { useFlowBuilderNodes } from 'modules/service-flow/hooks/useFlowBuilderNodes';
  import FlowNodeContainer from './FlowNodeContainer.vue';
  import { useTranslation } from 'i18next-vue';

  const props = defineProps<NodeProps>();

  const { updateNodeData, getValueByLanguage } = useFlowBuilderNodes();

  const { t } = useTranslation();

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
    title: t('modules.serviceFlow.views.add.flows.node.initAttendance.title'),
  }));
</script>
