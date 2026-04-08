<template>
  <v-box
    padding="4px 0 4px 12px"
    direction="row"
    justify="between"
    align="center"
    round="8px"
    background="white"
  >
    <v-text font-size="13px">Adicionar item</v-text>
    <v-button icon="plus" icon-button @click.native="$emit('open')" />
  </v-box>
</template>

<script lang="ts" setup>
  defineEmits<(e: 'open') => void>();
</script>
