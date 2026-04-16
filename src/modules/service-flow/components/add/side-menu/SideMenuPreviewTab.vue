<template>
  <v-box margin="2em 0 0">
    <component v-if="preview" :is="component" v-bind="props" />
    <preview-container v-else />
  </v-box>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { PREVIEW_FLOW } from 'shared/models/service-flow.interface';
  import { computed } from 'vue';
  import PreviewInitialAttendance from 'shared/components/preview-autoid/PreviewInitialAttendance.vue';
  import PreviewTermsOfUse from 'shared/components/preview-autoid/PreviewTermsOfUse.vue';
  import PreviewConsent from 'shared/components/preview-autoid/PreviewConsent.vue';
  import PreviewSignature from 'shared/components/preview-autoid/PreviewSignature.vue';
  import PreviewContainer from 'shared/components/preview-autoid/Container.vue';
  import { useFlowBuilderNodes } from 'modules/service-flow/hooks/useFlowBuilderNodes';
  import { nodeName } from 'shared/utils/nodeName';

  const storeFlowNodes = useFlowBuilderNodes();

  const { getValueByLanguage } = useFlowBuilderNodes();

  const { selectedNode, nodes } = storeToRefs(storeFlowNodes);

  const data = computed(() => selectedNode.value?.data);

  const preview = computed<PREVIEW_FLOW>(() => data.value?.key ?? undefined);

  const dataNode = computed(() => getValueByLanguage(data.value.patch ?? {}));

  const component = computed(
    () =>
      ({
        [PREVIEW_FLOW.HOME]: PreviewContainer,
        [PREVIEW_FLOW.INIT_ATTENDANCE]: PreviewInitialAttendance,
        [PREVIEW_FLOW.TERMS_OF_USE]: PreviewTermsOfUse,
        [PREVIEW_FLOW.CONSENT]: PreviewConsent,
        [PREVIEW_FLOW.SIGNATURE]: PreviewSignature,
        [PREVIEW_FLOW.SERVER_DRIVEN_UI]: PreviewContainer,
      })[preview.value]
  );

  const flow = computed(() =>
    (nodes.value as unknown as any[])
      .filter((n) => n.data.key !== PREVIEW_FLOW.HOME)
      .map(nodeName)
  );

  const props = computed(() => ({
    title: dataNode.value.name,
    description: dataNode.value.description,
    items: dataNode.value.items,
    flow: flow.value,
  }));
</script>

<style lang="scss">
  .c-preview-auto-id {
    &__footer {
      &-button {
        width: 50%;
      }
    }
  }
</style>
