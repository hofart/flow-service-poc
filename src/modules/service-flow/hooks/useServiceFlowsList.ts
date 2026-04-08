import { defineStore } from 'pinia';
import { ref } from 'vue';
import { serviceFlowService } from '../services/serviceFlowService';
import type { ServiceFlowItem } from 'shared/types/service-flow.types';

export const useServiceFlowsList = defineStore('serviceFlowsList', () => {
  const items = ref<ServiceFlowItem[]>([]);
  const hasMore = ref(false);
  const isLoading = ref(false);

  const getServiceFlows = async (offSet = 0, limit = 20, search = '') => {
    isLoading.value = true;
    try {
      const { data } = await serviceFlowService.list({
        offSet,
        limit,
        search,
      });
      items.value = data.items;
      hasMore.value = data.hasMore;
    } finally {
      isLoading.value = false;
    }
  };

  return { getServiceFlows, items, hasMore, isLoading };
});
