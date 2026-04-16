<template>
  <div>
    <component :is="component" v-bind="props" @click="selectNode" />
    <Handle type="target" :position="Position.Left" />
    <Handle type="source" :position="Position.Right" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { Position, Handle, NodeProps } from '@vue-flow/core';
  import { useFlowBuilderNodes } from 'modules/service-flow/hooks/useFlowBuilderNodes';
  import { PREVIEW_FLOW } from 'shared/models/service-flow.interface';
  import FlowNodeInitAttendance from './node/FlowNodeInitAttendance.vue';
  import FlowNodeHome from './node/FlowNodeHome.vue';
  import FlowNodeTermsOfUse from './node/FlowNodeTermsOfUse.vue';
  import FlowNodeConsent from './node/consent/FlowNodeConsent.vue';
  import FlowNodeSignature from './node/FlowNodeSignature.vue';
  import FlowNodeServerDrivenUI from './node/server-driven-ui/FlowNodeServerDrivenUI.vue';

  const props = defineProps<NodeProps>();

  const payload = props.data as { key: string; label: string };

  const storeFlowNodes = useFlowBuilderNodes();

  const { handleSelectNode } = storeFlowNodes;

  const component = computed(
    () =>
      ({
        home: FlowNodeHome,
        [PREVIEW_FLOW.INIT_ATTENDANCE]: FlowNodeInitAttendance,
        [PREVIEW_FLOW.TERMS_OF_USE]: FlowNodeTermsOfUse,
        [PREVIEW_FLOW.CONSENT]: FlowNodeConsent,
        [PREVIEW_FLOW.SIGNATURE]: FlowNodeSignature,
        [PREVIEW_FLOW.SERVER_DRIVEN_UI]: FlowNodeServerDrivenUI,
      })[payload.key]
  );

  const selectNode = () => {
    handleSelectNode(props);
  };
</script>
