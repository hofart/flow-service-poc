import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { serviceFlowService } from '../services/serviceFlowService';
import { useServiceFlowsList } from './useServiceFlowsList';
import type {
  ServiceFlowConfigurationResponse,
  ServiceFlowNodesResponse,
  ServiceFlowSideMenuItem,
} from 'shared/types/service-flow.types';
import staticSideMenu from 'modules/service-flow/__mocks__/flow-side-menu.json';

export const useServiceFlow = defineStore('serviceFlows', () => {
  const route = useRoute();

  const flowParamsId = computed(() => route.params.flowId as string);

  const flowNodesData = ref<ServiceFlowNodesResponse>({ nodes: [], edges: [] });
  const flowConfigData = ref<ServiceFlowConfigurationResponse | undefined>(
    undefined
  );
  const flowSideMenuData = ref<ServiceFlowSideMenuItem[]>(
    staticSideMenu as ServiceFlowSideMenuItem[]
  );

  const { getServiceFlows } = useServiceFlowsList();

  const loadFlowData = async (flowId: string) => {
    const [nodesRes, configRes] = await Promise.all([
      serviceFlowService.getNodes(flowId),
      serviceFlowService.getConfiguration(flowId),
    ]);
    flowNodesData.value = nodesRes.data;
    flowConfigData.value = configRes.data;
  };

  const deleteFlowNodes = async () => {
    const flowId = flowParamsId.value;
    if (!flowId) return;
    await serviceFlowService.deleteNodes(flowId);
  };

  const changeStatusServiceFlow = async (oid: string, isActive: boolean) => {
    await serviceFlowService.changeStatus(oid, isActive);
    return getServiceFlows();
  };

  const flowNodes = computed(() => flowNodesData.value);
  const flowConfig = computed(() => flowConfigData.value);
  const flowSideMenu = computed(() => flowSideMenuData.value);

  watch(
    () => route.params.flowId,
    (flowId) => {
      if (flowId) {
        loadFlowData(flowId as string);
      }
    },
    { immediate: true }
  );

  return {
    flowNodes,
    flowConfig,
    flowSideMenu,
    deleteFlowNodes,
    changeStatusServiceFlow,
  };
});
