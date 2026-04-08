<template>
  <container>
    <v-box
      height="100%"
      justify="between"
      padding="0"
      margin="-1.4em 0 0"
      class="preview-autoid-signature"
      background="#EBEBEB"
    >
      <v-box padding="2em 0 0" align="center">
        <v-text tag="h4">
          {{ title }}
        </v-text>
        <v-text margin="4px 0 0">
          {{ description }}
        </v-text>
      </v-box>

      <v-box background="#fff" height="50%">
        <v-signature-pad ref="signature" />
      </v-box>

      <v-box direction="row" gap="1em" background="#fff">
        <v-button
          block
          size="large"
          variant="flat"
          @click="handleClearSignature"
        >
          Limpar
        </v-button>
        <v-button
          block
          size="large"
          variant="flat"
          :custom-color="defaultColor"
        >
          Enviar assinatura
        </v-button>
      </v-box>
    </v-box>
  </container>
</template>
<script lang="ts" setup>
  import { defaultColor } from 'shared/constants/variables';
  import Container from './Container.vue';
  import { ref } from 'vue';
  import { VSignaturePad } from 'vsoft-design-system';

  const signature = ref<typeof VSignaturePad>();

  defineProps<{ title?: string; description?: string }>();

  const handleClearSignature = () => {
    signature.value?.clear();
  };
</script>

<style lang="scss">
  .preview-autoid-signature {
    .v-item__list-item-section {
      padding: 1em 0;
    }
  }
</style>
