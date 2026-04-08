import { defineStore, storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useServiceFlow } from './useServiceFlow';

export enum FlowBuilderTabs {
  FLOW = 'flow',
  PREVIEW = 'preview',
}

const state = {
  draggedType: ref<string | null>(null),
  isDragOver: ref<boolean>(false),
  isDragging: ref<boolean>(false),
};

export const useFlowBuilderSideMenu = defineStore('flowBuilderSideMenu', () => {
  const storeServiceFlow = useServiceFlow();

  const { flowSideMenu } = storeToRefs(storeServiceFlow);

  const currentTab = ref<FlowBuilderTabs>(FlowBuilderTabs.FLOW);

  const { draggedType, isDragOver, isDragging } = state;

  const handleSelectTab = (tab: FlowBuilderTabs) => {
    currentTab.value = tab;
  };

  const onDragStart = (event: DragEvent, type: string) => {
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/vueflow', type);
      event.dataTransfer.effectAllowed = 'move';
    }

    draggedType.value = type;

    isDragging.value = true;

    document.addEventListener('drop', onDragEnd);
  };

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();

    if (draggedType.value) {
      isDragOver.value = true;

      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
      }
    }
  };

  const onDragLeave = () => {
    isDragOver.value = false;
  };

  const onDragEnd = () => {
    isDragging.value = false;
    isDragOver.value = false;
    draggedType.value = null;
    document.removeEventListener('drop', onDragEnd);
  };

  watch(isDragging, (dragging: boolean) => {
    document.body.style.userSelect = dragging ? 'none' : '';
  });

  return {
    currentTab,
    handleSelectTab,
    draggedType,
    isDragOver,
    isDragging,
    onDragStart,
    onDragLeave,
    onDragOver,
    flowSideMenu,
  };
});
