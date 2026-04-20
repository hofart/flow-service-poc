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
      <v-text font-size="12px">
        {{ regra.mensagemErroUI || '(sem mensagem)' }}
      </v-text>
      <v-text font-size="11px" color="rgb(150 150 150)">
        {{ childCount }} condição{{ childCount !== 1 ? 'ões' : '' }}
      </v-text>
    </v-box>

    <v-button icon="v-edit2" icon-button @click.native="$emit('edit', regra)" />
  </v-box>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import type { RegraValidacao } from 'shared/models/server-driven-ui.interface';

  const props = defineProps<{ regra: RegraValidacao }>();

  defineEmits<(e: 'edit', regra: RegraValidacao) => void>();

  const childCount = computed(() => {
    const node = props.regra.condicoes;
    return node.type === 'group' ? node.children.length : 0;
  });
</script>
