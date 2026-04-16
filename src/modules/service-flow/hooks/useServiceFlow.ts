import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { serviceFlowService } from '../services/serviceFlowService';
import { useServiceFlowsList } from './useServiceFlowsList';
import type {
  ServiceFlowConfigurationResponse,
  ServiceFlowNodesResponse,
  ServiceFlowSideMenuItem,
} from 'shared/types/service-flow.types';
import staticSideMenu from 'modules/service-flow/__mocks__/flow-side-menu.json';

export const useServiceFlow = defineStore('serviceFlows', () => {
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

  const deleteFlowNodes = async (flowId: string) => {
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

  return {
    flowNodes,
    flowConfig,
    flowSideMenu,
    loadFlowData,
    deleteFlowNodes,
    changeStatusServiceFlow,
  };
});
