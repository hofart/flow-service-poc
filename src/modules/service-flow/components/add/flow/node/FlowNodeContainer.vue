<template>
  <v-box
    padding="1em 12px 6px"
    width="260px"
    round="8px"
    elevation="large"
    class="flow-node--container"
    :background="lightColor"
    @contextmenu.prevent="handleSelectCard"
  >
    <v-box
      v-if="partialFilled"
      position="absolute"
      class="flow-node--container-notification"
      round="8px"
      elevation="medium"
      width="38px"
      height="32px"
      background="#fff"
      padding="0"
      align="center"
      justify="center"
    >
      <span />
      <v-icon
        name="exclamation-circle"
        size="18px"
        translate-y="3px"
        color="#E5555C"
      />
    </v-box>
    <v-box direction="row" align="start" justigy="between" padding="0">
      <v-box padding="0" margin="0">
        <v-text tag="strong" :color="color" font-size="12px">
          {{ title }}
        </v-text>
      </v-box>
      <v-box
        padding="0"
        direction="row"
        width="auto"
        v-if="isSelected"
        class="flow-node--container-actions"
        gap="4px"
      >
        <v-icon
          name="eye"
          @click="handleSelectTab(FlowBuilderTabs.PREVIEW)"
          color="#3A3A3A"
          size="16px"
          style="opacity: 0.85"
        />
        <v-icon
          name="times"
          @click="handleDeleteNode()"
          color="#3A3A3A"
          size="16px"
          style="opacity: 0.85"
        />
      </v-box>
    </v-box>
    <slot />
  </v-box>
</template>

<script setup lang="ts">
  import { NodeProps } from '@vue-flow/core';
  import {
    FlowBuilderTabs,
    useFlowBuilderSideMenu,
  } from 'modules/service-flow/hooks/useFlowBuilderSideMenu';
  import { useFlowBuilderNodes } from 'modules/service-flow/hooks/useFlowBuilderNodes';
  import { getLightColor } from 'shared/utils/lightColor';
  import { computed, ref, watch } from 'vue';
  import { useFlowBuilderConfig } from 'modules/service-flow/hooks/useFlowBuilderConfig';
  import { storeToRefs } from 'pinia';

  export interface FlowNodeContainerProps extends NodeProps {
    color: string;
    title: string;
    disabled?: boolean;
  }

  const { handleSelectTab } = useFlowBuilderSideMenu();

  const { handleDeleteNode, handleSelectNode } = useFlowBuilderNodes();

  const storeConfig = useFlowBuilderConfig();

  const { currentLang } = storeToRefs(storeConfig);

  const props = defineProps<FlowNodeContainerProps>();

  const partialFilled = ref(false);

  const isSelected = computed(() => Boolean(props.selected));

  const borderColor = computed(() =>
    isSelected.value ? props.color : 'white'
  );

  const lightColor = computed(() => getLightColor(props.color));

  const hoverColor = computed(() => getLightColor(props.color, 80));

  const handleSelectCard = () => {
    handleSelectNode(props);
  };

  watch(
    () => props.data,
    () => {
      const patch = props.data.patch.find(
        (p: { language: string }) => p.language === currentLang.value?.key
      );

      partialFilled.value = Boolean(patch.partialFilled);
    }
  );
</script>

<style lang="scss">
  .flow-node {
    &--container {
      position: relative;
      border: 2px solid v-bind(borderColor);

      &-notification {
        top: -44px;
        position: absolute;
        right: 0;

        span {
          display: block;
          position: absolute;
          bottom: -5px;
          width: 10px;
          height: 3px;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 5px solid $white;
        }
      }

      input,
      textarea,
      .v-input__container {
        border-color: v-bind(lightColor) !important;
      }

      button {
        &.v-button--small {
          width: 20px;
          height: 20px;
        }
        &.save-button {
          width: 100%;
          margin-top: 1em;

          &.--disabled {
            opacity: 0.3;
            cursor: not-allowed;
            pointer-events: none;
          }
        }
      }
      &-actions {
        position: absolute;
        right: 12px;
        top: 12px;
        .unicon {
          cursor: pointer;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          &:hover {
            background-color: v-bind(hoverColor);
          }
        }
      }
    }
  }
</style>
