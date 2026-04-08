<template>
  <container>
    <v-box
      height="100%"
      justify="between"
      padding="0 12px 12px"
      class="preview-autoid-terms"
    >
      <v-box padding="0">
        <v-text tag="h4">
          {{
            $t(
              'modules.serviceFlow.views.add.preview.termsOfUse.title'
            )
          }}
        </v-text>
        <v-text margin="1em 0">
          {{
            $t(
              'modules.serviceFlow.views.add.preview.termsOfUse.subtitle',
              { title }
            )
          }}
        </v-text>
        <v-box
          background="rgb(241 241 241)"
          round="4px"
          height="286px"
          overflow="auto"
        >
          <v-box margin="0 0 1em" justify="center" padding="0" align="center">
            <v-text tag="strong" text-align="center">
              {{ title }}
            </v-text>
          </v-box>

          <div v-html="description" />
        </v-box>
      </v-box>
      <v-button
        class="preview-autoid-terms__button"
        block
        size="large"
        custom-color="#e9e9e9"
      >
        {{
          $t('modules.serviceFlow.views.add.preview.default.continue')
        }}
      </v-button>
    </v-box>
  </container>
</template>
<script lang="ts" setup>
  import Container from './Container.vue';

  defineProps<{ description?: string; title?: string }>();
</script>

<style lang="scss">
  .preview-autoid-terms {
    &__button {
      color: #4b5563;
      font-weight: bold;
    }
  }
</style>
