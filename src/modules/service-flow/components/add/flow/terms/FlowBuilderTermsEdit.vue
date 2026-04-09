<template>
  <v-box padding="0" class="c-flow-terms-edit">
    <v-box
      padding="12px 12px 0"
      direction="row"
      justify="between"
      align="center"
      class="c-flow-terms-edit__header"
    >
      <v-box
        direction="row"
        width="auto"
        align="center"
        gap="12px"
        padding="0 1em"
      >
        <v-toggle-button :model-value="false" size="small" label="AutoSave" />
        <v-box
          padding="0"
          alias="button"
          direction="row"
          @click="handleSaveClick()"
          class="c-flow-terms-edit__header-savebutton"
        >
          <v-icon name="save" />
          <v-dropdown
            ref="saveRef"
            :items="[{ label: 'teste' }]"
            hide-selected-icon
            :left="true"
          />
        </v-box>
        <v-text white-space="nowrap">Termos de uso</v-text>
      </v-box>
      <v-button icon-button icon="times" @click="handleCloseTermsEdit()" />
    </v-box>

    <flow-builder-terms-design v-if="currentMode === TermsEditMode.DESIGN" />
    <flow-builder-terms-html v-if="currentMode === TermsEditMode.HTML" />

    <v-box padding="0 12px" direction="row">
      <v-button
        :custom-color="currentMode === TermsEditMode.DESIGN ? 'black' : '#ccc'"
        variant="flat"
        @click="handleChangeMode(TermsEditMode.DESIGN)"
      >
        Design
      </v-button>
      <v-button
        :custom-color="currentMode === TermsEditMode.HTML ? 'black' : '#ccc'"
        variant="flat"
        @click="handleChangeMode(TermsEditMode.HTML)"
      >
        HTML
      </v-button>
    </v-box>
  </v-box>
</template>

<script lang="ts" setup>
  import { VDropdown } from 'vsoft-design-system';
  import FlowBuilderTermsHtml from './FlowBuildTermsHtml.vue';
  import FlowBuilderTermsDesign from './FlowBuildTermsDesign.vue';
  import {
    useFlowBuilderTerms,
    TermsEditMode,
  } from 'modules/service-flow/hooks/useFlowBuilderTerms';
  import { storeToRefs } from 'pinia';

  const store = useFlowBuilderTerms();

  const { handleChangeMode, handleSaveClick, handleCloseTermsEdit } = store;

  const { currentMode } = storeToRefs(store);
</script>
