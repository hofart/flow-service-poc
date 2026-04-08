<template>
  <v-box padding="2em 0">
    <v-infinite-scroll
      @load-more="getServiceFlows"
      v-bind="infiniteScrollProps"
      class="c-listscroll"
    >
      <template #default="{ item }">
        <v-item-table>
          <v-text font-size="14px">{{ item.name }}</v-text>
          <v-box padding="0" direction="row" gap="12px">
            <v-tag-button v-for="tag in item.tags" :label="tag.name" />
          </v-box>
          <v-clipboard-button color="#07A09F" :target="item.oid">
            <v-text font-size="14px">
              <span v-text-truncate="20">{{ item.oid }}</span>
              <span :id="item.oid" style="display: none">{{ item.oid }}</span>
            </v-text>
          </v-clipboard-button>

          <template #actions>
            <v-toggle-button
              :label="getActiveLabel(item)"
              size="small"
              :loading="updatingId === item.oid"
              :model-value="item.isActive"
              @update:model-value="(value) => handleUpdate(item, value)"
            />
            <v-button
              class="c-listscroll_edit"
              :to="getLinkEdit(item)"
              icon-button
              icon="v-edit3"
            />
          </template>
        </v-item-table>
      </template>
    </v-infinite-scroll>
  </v-box>
</template>
<script setup lang="ts">
  import { useTranslation } from 'i18next-vue';
  import { VInfiniteScroll } from 'vsoft-design-system';
  import { storeToRefs } from 'pinia';
  import type { ServiceFlowItem } from 'shared/types/service-flow.types';
  import { computed } from 'vue';
  import { useServiceFlowsList } from 'modules/service-flow/hooks/useServiceFlowsList';
  import { useServiceFlow } from 'modules/service-flow/hooks/useServiceFlow';
  import { useStatusUpdate } from 'shared/hooks/useStatusUpdate';

  const store = useServiceFlowsList();

  const { hasMore, items, isLoading } = storeToRefs(store);

  const { getServiceFlows } = store;

  const storeServiceFlow = useServiceFlow();

  const { changeStatusServiceFlow } = storeServiceFlow;

  const { t } = useTranslation();

  const { updatingId, handleUpdate } = useStatusUpdate<
    ServiceFlowItem,
    any
  >({
    items,
    idKey: 'oid',
    statusKey: 'isActive',
    updateFn: changeStatusServiceFlow,
    getErrorMessage: (item, isActive) =>
      `Falha ao <i>${isActive ? 'Ativar' : 'Pausar'}</i> o fluxo <b>${item.name}</b>`,
  });

  const infiniteScrollProps = computed(() => ({
    perPage: 20,
    hasMore: hasMore.value,
    isLoading: isLoading.value,
    items: items.value,
    height: '80vh',
    listKey: 'service-flow-list',
  }));

  const getLinkEdit = (item: ServiceFlowItem) => ({
    name: t('routes.serviceFlow.children.edit.name'),
    params: { flowId: item.oid },
  });

  const getActiveLabel = (item: ServiceFlowItem) =>
    item.isActive
      ? t('modules.serviceFlow.views.list.statusActive')
      : t('modules.serviceFlow.views.list.statusInactive');
</script>

<style lang="scss">
  .c-listscroll {
    padding: 2em 0;
    &_edit {
      text-align: center;
    }
  }
</style>
