<template>
  <container>
    <v-box
      height="100%"
      justify="between"
      padding="0 1em 12px"
      class="preview-autoid-consent"
    >
      <v-box padding="0">
        <v-box width="50%" padding="0">
          <v-text tag="h4">Privacidade e compartilhamento</v-text>
        </v-box>

        <v-box padding="0">
          <v-text font-size="14px" margin="1em 0">
            Vamos iniciar o seu processo de cadastro, durante a operação você
            passará pelas seguintes etapas:
          </v-text>

          <v-box direction="row" align="center" gap="1em" padding="1em 0 0">
            <v-icon name="user-circle" />
            <v-text font-weight="600">{{ title }}</v-text>
          </v-box>
          <v-text font-size="14px" margin="0 0 1em">
            {{ description }}
          </v-text>
          <v-divider />

          <v-box padding="0" overflow="auto" height="200px">
            <v-box padding="0" v-for="consent in items">
              <v-box border="1px solid #f0f0f0" round="8px" margin="1em 0 0">
                <v-text tag="strong">{{ consent.name }}</v-text>
                <v-text font-size="15px">{{ consent.description }}</v-text>
                <v-box
                  direction="row"
                  align="center"
                  justify="between"
                  padding="0"
                  margin="1.4em 0 0"
                >
                  <v-text tag="strong">Consentir</v-text>
                  <div>
                    <v-toggle-button
                      :model-value="Boolean(consent.initialActive)"
                    />
                  </div>
                </v-box>
              </v-box>
            </v-box>
          </v-box>
        </v-box>
      </v-box>
      <v-box direction="row" padding="0" gap="1em">
        <v-button
          block
          size="large"
          variant="bordered"
          :custom-color="defaultColor"
        >
          Voltar
        </v-button>
        <v-button block size="large">Continuar</v-button>
      </v-box>
    </v-box>
  </container>
</template>
<script lang="ts" setup>
  import { defaultColor } from 'shared/constants/variables';
  import Container from './Container.vue';

  defineProps<{ title?: string; description?: string; items?: any[] }>();
</script>
