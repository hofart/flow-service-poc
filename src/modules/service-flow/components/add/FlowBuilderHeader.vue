<template>
  <v-box
    background="white"
    direction="row"
    align="center"
    justify="between"
    height="60px"
    width="100%"
    class="p-service-flow__container-header"
  >
    <v-box
      padding="0"
      direction="row"
      gap="8px"
      justify="start"
      align="center"
      width="100%"
    >
      <v-text>{{ flowTitle }}</v-text>
      <v-button icon="v-edit2" icon-button @click="handleEditTitle()" />
    </v-box>
    <v-box
      padding="0"
      direction="row"
      gap="1em"
      justify="end"
      align="center"
      width="365px"
    >
      <flow-builder-select-language />
      <v-icon
        :disabled="!hasNodes"
        name="v-trash2"
        button
        size="24px"
        @click="handleConfirmDelete()"
      />
      <v-divider verical height="30px" margin="auto" />
      <v-tooltip :alert="!disableSaveButton" position="bottom">
        <template #content v-if="!disableSaveButton">
          <v-box width="280px">
            <v-text text-align="left" font-weight="600">
              Necessário preencher os campos
            </v-text>
            <v-text text-align="left" font-size="13px">
              É preciso que todos os campos estejam preenchidos para salvar o
              fluxo.
            </v-text>
          </v-box>
        </template>
        <template #target>
          <v-button :disabled="!disableSaveButton">Salvar fluxo</v-button>
        </template>
      </v-tooltip>
    </v-box>
  </v-box>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import FlowBuilderSelectLanguage from './FlowBuilderSelectLanguage.vue';
  import { useFlowBuilderNodes } from 'modules/service-flow/hooks/useFlowBuilderNodes';
  import { useFlowBuilderConfig } from 'modules/service-flow/hooks/useFlowBuilderConfig';
  import { useModal } from 'vsoft-design-system';
  import { computed } from 'vue';
  import FormHeader from './config/FormHeader.vue';

  const storeFlowBuilderNodes = useFlowBuilderNodes();

  const storeFlowConfig = useFlowBuilderConfig();

  const { hasNodes } = storeToRefs(storeFlowBuilderNodes);

  const { flowTitle, hasPartialFilledLang } = storeToRefs(storeFlowConfig);

  const { handleDeleteAll } = storeFlowBuilderNodes;

  const { open, close } = useModal();

  const disableSaveButton = computed(
    () => !hasNodes.value && hasPartialFilledLang.value
  );

  const modalDeleteId = 'modal-delete-flow';

  const modalEditId = 'modal-edit-flow';

  const handleConfirmDelete = () => {
    open({
      id: modalDeleteId,
      modalImage: 'delete',
      modalTitle: '',
      modalSubTitle: 'Deseja excluir o fluxo?',
      modalContent: 'Essa ação não pode ser desfeita',
      showFooter: true,
      hideHeader: true,
      alert: true,
      buttonPrimary: {
        text: 'Confirmar',
        action: () => {
          handleDeleteAll();
          close(modalDeleteId);
        },
      },
      buttonSecondary: {
        text: 'Cancelar',
        action: () => close(modalDeleteId),
      },
    });
  };

  const handleEditTitle = () => {
    open({
      id: modalEditId,
      modalTitle: 'Editar título',
      showFooter: true,
      alert: true,
      component: FormHeader,
      buttonPrimary: {
        text: 'Confirmar',
        action: () => {
          handleDeleteAll();
          close(modalEditId);
        },
      },
      buttonSecondary: {
        text: 'Cancelar',
        action: () => close(modalEditId),
      },
    });
  };
</script>

<style lang="scss">
  .p-service-flow {
    &__container {
      &-header {
        border: 1px solid $neutral-50;
      }
    }
  }
</style>
