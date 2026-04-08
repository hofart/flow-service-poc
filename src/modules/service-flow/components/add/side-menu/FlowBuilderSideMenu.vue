<template>
  <v-box
    class="p-service-flow__container-side"
    background="white"
    height="100%"
    width="46vw"
    padding="0"
  >
    <flow-tabs />

    <v-box class="p-service-flow__container-side-list">
      <side-menu-build-tab v-if="FlowBuilderTabs.FLOW === currentTab" />
      <side-menu-preview-tab v-if="FlowBuilderTabs.PREVIEW === currentTab" />
    </v-box>
  </v-box>
</template>

<script lang="ts" setup>
  import FlowTabs from './FlowTabs.vue';
  import SideMenuPreviewTab from './SideMenuPreviewTab.vue';
  import SideMenuBuildTab from './SideMenuBuildTab.vue';
  import {
    useFlowBuilderSideMenu,
    FlowBuilderTabs,
  } from 'modules/service-flow/hooks/useFlowBuilderSideMenu';
  import { storeToRefs } from 'pinia';

  const store = useFlowBuilderSideMenu();

  const { currentTab } = storeToRefs(store);
</script>

<style lang="scss">
  .p-service-flow {
    &__container {
      &-side {
        max-width: 440px;
      }
    }
  }
</style>
