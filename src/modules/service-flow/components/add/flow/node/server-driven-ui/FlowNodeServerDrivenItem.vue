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
      <v-text font-size="13px">{{ campo.nomeCampo || '(sem nome)' }}</v-text>
      <v-text font-size="11px" color="rgb(150 150 150)">
        {{ campo.tipoComponente }}
      </v-text>
    </v-box>

    <v-button icon="v-edit2" icon-button @click.native="$emit('edit', campo)" />
  </v-box>

  <!-- filhos indentados -->
  <v-box
    v-for="filho in campo.filhos"
    :key="filho.id"
    padding="0 0 0 12px"
    direction="column"
    gap="4px"
  >
    <FlowNodeServerDrivenItem :campo="filho" @edit="$emit('edit', $event)" />
  </v-box>
</template>

<script setup lang="ts">
  import type { CampoEtapa } from 'shared/models/server-driven-ui.interface';
  import FlowNodeServerDrivenItem from './FlowNodeServerDrivenItem.vue';

  defineProps<{ campo: CampoEtapa }>();

  defineEmits<(e: 'edit', campo: CampoEtapa) => void>();
</script>
