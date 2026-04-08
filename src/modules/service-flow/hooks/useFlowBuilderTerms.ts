import { QuillEditor } from '@vueup/vue-quill';
import { defineStore } from 'pinia';
import { VDropdown } from 'vsoft-design-system';
import { ref, watch } from 'vue';
import { useFlowBuilderNodes } from './useFlowBuilderNodes';
import {
  FlowBuilderTabs,
  useFlowBuilderSideMenu,
} from './useFlowBuilderSideMenu';
import { PREVIEW_FLOW } from 'shared/models/service-flow.interface';

export enum TermsEditMode {
  DESIGN = 'design',
  HTML = 'html',
}

export const useFlowBuilderTerms = defineStore('flowTermsEditor', () => {
  const { handleSelectTab } = useFlowBuilderSideMenu();

  const { updateNodeData } = useFlowBuilderNodes();

  const currentMode = ref<TermsEditMode>(TermsEditMode.DESIGN);

  const isOpenTermsEdit = ref(false);

  const nodeId = ref<string>();

  const htmlContent = ref('');

  const quillRef = ref<InstanceType<typeof QuillEditor> | null>(null);

  const saveRef = ref<typeof VDropdown>();

  const handleOpenTermsEdit = (id: string) => {
    nodeId.value = id;
    isOpenTermsEdit.value = true;
  };

  const handleCloseTermsEdit = () => {
    isOpenTermsEdit.value = false;
  };

  const handleSaveClick = () => {
    saveRef.value?.toggleMenu();
  };

  const handleChangeMode = async (mode: TermsEditMode) => {
    currentMode.value = mode;

    if (mode === TermsEditMode.HTML) {
      htmlContent.value = quillRef.value?.getHTML() || '';
    }

    if (mode === TermsEditMode.DESIGN) {
      quillRef.value?.setHTML(htmlContent.value);
    }
  };

  watch(
    () => htmlContent.value,
    (value) => {
      updateNodeData({
        nodeId: String(nodeId.value),
        key: PREVIEW_FLOW.TERMS_OF_USE,
        patch: {
          description: value,
        },
      });
    }
  );

  watch(
    () => isOpenTermsEdit,
    ({ value }) => {
      const { PREVIEW, FLOW } = FlowBuilderTabs;

      const currentTab = value ? PREVIEW : FLOW;

      handleSelectTab(currentTab);
    },
    { deep: true, immediate: true }
  );

  return {
    isOpenTermsEdit,
    currentMode,
    htmlContent,
    quillRef,
    saveRef,
    handleSaveClick,
    handleChangeMode,
    handleOpenTermsEdit,
    handleCloseTermsEdit,
  };
});
