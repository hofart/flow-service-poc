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
      <v-text font-size="13px">{{ etapa.nomeEtapa || '(sem nome)' }}</v-text>
      <v-text font-size="11px" color="rgb(150 150 150)">
        {{ etapa.fluxoId || '—' }}
      </v-text>
    </v-box>

    <v-button icon="v-edit2" icon-button @click.native="$emit('edit')" />
  </v-box>
</template>

<script setup lang="ts">
  import type { EtapaConfig } from './FlowNodeServerDrivenEtapaModal.vue';

  defineProps<{ etapa: EtapaConfig }>();

  defineEmits<(e: 'edit') => void>();
</script>
