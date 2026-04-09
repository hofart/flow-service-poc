<template>
  <v-box>
    <v-text tag="strong" font-size="17px" margin="0 0 0.6em">
      Customização de fluxo
    </v-text>
    <v-text tag="span" color="#3A3A3A99">
      Clique nas categorias abaixo para visualizar as opções. Para adicionar um
      item ao fluxo, basta puxar ou clicar.
    </v-text>
  </v-box>
  <v-box>
    <card-items
      v-for="item in items"
      :key="item.label"
      :item="item"
      :single="isSingle(item)"
    />
  </v-box>
</template>
<script setup lang="ts">
  import CardItems from './CardItems.vue';
  import { useFlowBuilderSideMenu } from 'modules/service-flow/hooks/useFlowBuilderSideMenu';
  import { storeToRefs } from 'pinia';
  import { computed } from 'vue';

  type SideMenuItem = {
    label: string;
    value: string;
    items?: SideMenuItem[];
  };

  const serviceMenuFlowStore = useFlowBuilderSideMenu();

  const { flowSideMenu } = storeToRefs(serviceMenuFlowStore);

  const items = computed(
    () => (flowSideMenu.value as unknown as SideMenuItem[]) ?? []
  );

  const isSingle = (item: SideMenuItem) =>
    !item.items || item.items.length === 0;
</script>
