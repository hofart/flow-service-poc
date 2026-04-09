<template>
  <v-box
    direction="row"
    padding="0"
    justify="between"
    height="60px"
    class="p-service-flow-tabs"
  >
    <button
      :disabled="isOpenTermsEdit"
      @click="handleSelectTab(FLOW)"
      :class="{ active: currentTab === FLOW }"
    >
      Criação de fluxo
    </button>
    <button
      @click="handleSelectTab(PREVIEW)"
      :class="{ active: currentTab === PREVIEW }"
    >
      Preview
    </button>
  </v-box>
</template>

<script lang="ts" setup>
  import {
    useFlowBuilderSideMenu,
    FlowBuilderTabs,
  } from 'modules/service-flow/hooks/useFlowBuilderSideMenu';
  import { useFlowBuilderTerms } from 'modules/service-flow/hooks/useFlowBuilderTerms';
  import { storeToRefs } from 'pinia';

  const store = useFlowBuilderSideMenu();

  const { handleSelectTab } = store;

  const { currentTab } = storeToRefs(store);

  const { isOpenTermsEdit } = storeToRefs(useFlowBuilderTerms());

  const { FLOW, PREVIEW } = FlowBuilderTabs;
</script>
<style lang="scss">
  .p-service-flow {
    &-tabs {
      border-bottom: 1px solid $neutral-100;
      button {
        cursor: pointer;
        background-color: transparent;
        border: none;
        height: 100%;
        width: 100%;
        text-align: center;
        font-size: 16px;
        color: $neutral-400;
        &.active {
          color: $neutral-800;
          font-weight: bolder;
          border-bottom: 1px solid $primary;
        }
        &:disabled {
          cursor: not-allowed;
        }
      }
    }
  }
</style>
