<template>
  <container>
    <v-box
      height="100%"
      justify="between"
      padding="0 1em 12px"
      class="preview-autoid-init"
    >
      <v-box padding="0">
        <v-text tag="h4">Olá!</v-text>
        <v-text margin="1em 0">
          {{ description }}
        </v-text>
        <v-box padding="0">
          <v-item-list simple :items="flow" />
        </v-box>
      </v-box>

      <v-button class="preview-autoid-init__button" block size="large">
        Continuar
      </v-button>
    </v-box>
  </container>
</template>
<script lang="ts" setup>
  import Container from './Container.vue';

  defineProps<{ flow: any[]; description?: string }>();
</script>

<style lang="scss">
  .preview-autoid-init {
    .v-item__list-item-section {
      padding: 1em 0;
    }
  }
</style>
