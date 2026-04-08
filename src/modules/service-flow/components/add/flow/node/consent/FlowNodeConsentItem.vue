<template>
  <v-box
    padding="4px 0 4px 12px"
    direction="row"
    justify="between"
    align="center"
    round="8px"
    background="white"
  >
    <v-text font-size="13px">{{ item.name }}</v-text>
    <v-button icon="v-edit2" icon-button @click.native="$emit('edit', item)" />
  </v-box>
</template>

<script lang="ts" setup>
  import type { FormItem } from './FlowNodeConsentModal.vue';

  defineProps<{ item: Partial<FormItem> }>();

  defineEmits<(e: 'edit', item: Partial<FormItem>) => void>();
</script>
