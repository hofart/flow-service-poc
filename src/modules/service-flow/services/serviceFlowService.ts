import { http } from 'core/http';
import type {
  ServiceFlowsListRequest,
  ServiceFlowsListResponse,
  ServiceFlowConfigurationResponse,
  ServiceFlowNodesResponse,
  ServiceFlowSideMenuItem,
  CreateServiceFlowConfigurationRequest,
  UpdateServiceFlowConfigurationRequest,
  CreateServiceFlowNodesRequest,
  UpdateServiceFlowNodesRequest,
} from 'shared/types/service-flow.types';

export const serviceFlowService = {
  list: (params: ServiceFlowsListRequest) =>
    http.get<ServiceFlowsListResponse>('/service-flows', { params }),

  getConfiguration: (flowId: string) =>
    http.get<ServiceFlowConfigurationResponse>(
      `/service-flows/${flowId}/configuration`
    ),

  getNodes: (flowId: string) =>
    http.get<ServiceFlowNodesResponse>(`/service-flows/${flowId}/nodes`),

  createConfiguration: (input: CreateServiceFlowConfigurationRequest) =>
    http.post<ServiceFlowConfigurationResponse>('/service-flows', input),

  createNodes: (flowId: string, input: CreateServiceFlowNodesRequest) =>
    http.post<ServiceFlowNodesResponse>(
      `/service-flows/${flowId}/nodes`,
      input
    ),

  updateConfiguration: (
    flowId: string,
    input: UpdateServiceFlowConfigurationRequest
  ) =>
    http.put<ServiceFlowConfigurationResponse>(
      `/service-flows/${flowId}/configuration`,
      input
    ),

  updateNodes: (flowId: string, input: UpdateServiceFlowNodesRequest) =>
    http.put<ServiceFlowNodesResponse>(`/service-flows/${flowId}/nodes`, input),

  updateSideMenu: (items: ServiceFlowSideMenuItem[]) =>
    http.put<ServiceFlowSideMenuItem[]>('/service-flows/side-menu', { items }),

  changeStatus: (flowId: string, isActive: boolean) =>
    http.patch(`/service-flows/${flowId}/status`, { isActive }),

  delete: (flowId: string) => http.delete(`/service-flows/${flowId}`),

  deleteNodes: (flowId: string) =>
    http.delete(`/service-flows/${flowId}/nodes`),
};
