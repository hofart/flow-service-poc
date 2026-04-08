<template>
  <v-box padding="0" class="flow-builder-menu-items">
    <v-box
      v-if="single"
      direction="row"
      gap="12px"
      align="center"
      :draggable="true"
      padding="0"
      round="8px"
      margin="0 0 1em"
      background="#fafafa"
      @dragstart="onDragStart($event, item.value)"
      @click="createNewNode(item.value)"
    >
      <v-text tag="strong" padding="12px">{{ item.label }}</v-text>
    </v-box>

    <v-accordion variant="light" v-else>
      <template #header>
        <v-text tag="strong" padding="12px">{{ item.label }}</v-text>
      </template>

      <v-box
        v-for="children in item.items"
        :key="children.label"
        direction="row"
        gap="12px"
        align="center"
        width="calc(26vw - 41px)"
        :draggable="true"
        @dragstart="onDragStart($event, children.value)"
        @click="createNewNode(children.value)"
      >
        <v-icon name="v-drag-item-flow" translate-y="4px" />
        <v-text>{{ children.label }}</v-text>
      </v-box>
    </v-accordion>
  </v-box>
</template>

<script lang="ts" setup>
  import { useFlowBuilderNodes } from 'modules/service-flow/hooks/useFlowBuilderNodes';
  import { useFlowBuilderSideMenu } from 'modules/service-flow/hooks/useFlowBuilderSideMenu';

  type SideMenuItem = {
    label: string;
    value: string;
    items?: SideMenuItem[];
  };

  defineProps<{ single?: boolean; item: SideMenuItem }>();

  const { onDragStart } = useFlowBuilderSideMenu();

  const { createNewNode } = useFlowBuilderNodes();
</script>

<style lang="scss">
  .flow-builder-menu-items {
    .v-accordion__header__toggle {
      height: 100%;
      width: 40px;
      background: #f0f0f0;
      text-align: center;
      justify-content: center;
      align-items: center;
    }
  }
</style>
