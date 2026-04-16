<template>
  <v-box
    padding="4px 0 4px 12px"
    direction="row"
    justify="between"
    align="center"
    round="8px"
    background="white"
  >
    <v-box padding="0" direction="column" gap="2px">
      <v-text font-size="13px">{{ componentLabel }}</v-text>
    </v-box>
    <v-button icon="v-edit2" icon-button @click.native="$emit('edit', item)" />
  </v-box>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import type { ServerDrivenItem } from './FlowNodeServerDrivenModal.vue';

  const props = defineProps<{ item: Partial<ServerDrivenItem> }>();

  defineEmits<(e: 'edit', item: Partial<ServerDrivenItem>) => void>();

  const componentLabel = computed(() => props.item.component ?? '—');
</script>
