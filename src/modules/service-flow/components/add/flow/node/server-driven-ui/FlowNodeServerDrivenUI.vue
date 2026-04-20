<template>
  <div class="flow-node--server-driven-ui">
    <flow-node-container v-bind="data">
      <v-box direction="column" gap="4px" padding="0" margin="0 0 0.41em">
        <!-- Seção Etapa -->
        <v-text font-size="12px" :color="data.color">Etapa</v-text>

        <flow-node-server-driven-button-add
          label="Configurar etapa"
          @open="openEtapaModal = true"
        />

        <flow-node-server-driven-etapa-item
          v-if="etapaConfig"
          :etapa="etapaConfig"
          @edit="openEtapaModal = true"
        />

        <!-- Seção Campos -->
        <v-text font-size="12px" :color="data.color" style="margin-top: 4px">
          Campos
        </v-text>

        <flow-node-server-driven-button-add
          label="Adicionar campo"
          @open="handleOpenCampoModal"
        />

        <flow-node-server-driven-item
          v-for="campo in campos"
          :key="campo.id"
          :campo="campo"
          @edit="handleEditCampo"
        />

        <!-- Seção Regras -->
        <v-text font-size="12px" :color="data.color" style="margin-top: 8px">
          Regras
        </v-text>

        <flow-node-server-driven-button-add
          label="Adicionar regra"
          @open="handleOpenRegraModal"
        />

        <flow-node-server-driven-regra-item
          v-for="regra in regras"
          :key="regra.id"
          :regra="regra"
          @edit="handleEditRegra"
        />

        <v-button
          @click="toggleJsonPreview"
          type="submit"
          style="margin-top: 4px"
          block
        >
          Ver JSON
        </v-button>
      </v-box>
    </flow-node-container>

    <!-- JSON preview -->
    <v-box
      v-if="showJson"
      padding="12px"
      round="8px"
      elevation="large"
      background="white"
      class="flow-node--server-driven-ui--json-preview"
      v-click-outside="() => (showJson = false)"
    >
      <v-box
        direction="row"
        justify="between"
        align="center"
        padding="0"
        margin="0 0 8px"
      >
        <v-text font-size="12px" :color="data.color">JSON Mock</v-text>
        <v-button
          size="small"
          :custom-color="data.color"
          @click.native="copyJson"
        >
          Copiar
        </v-button>
      </v-box>
      <div class="flow-node--server-driven-ui--json-body" @wheel.stop>
        <v-text font-size="11px" :color="data.color" style="margin-bottom: 4px">
          GET /etapa → InicioEtapa
        </v-text>
        <pre class="flow-node--server-driven-ui--json-pre">{{
          inicioEtapaJson
        }}</pre>
        <v-text font-size="11px" :color="data.color" style="margin: 8px 0 4px">
          GET /etapa/:etapaId → EtapaUI
        </v-text>
        <pre class="flow-node--server-driven-ui--json-pre">{{
          jsonPreview
        }}</pre>
      </div>
    </v-box>

    <!-- Modal Etapa -->
    <flow-node-server-driven-etapa-modal
      v-if="openEtapaModal"
      :etapa="etapaConfig ?? undefined"
      @close="openEtapaModal = false"
      @submit="handleSubmitEtapa"
    />

    <!-- Modal Campo -->
    <flow-node-server-driven-campo-modal
      v-if="openCampoModal"
      :campo="currentCampo"
      @close="handleCloseCampoModal"
      @submit="handleSubmitCampo"
    />

    <!-- Modal Regra -->
    <flow-node-server-driven-regra-modal
      v-if="openRegraModal"
      :regra="currentRegra"
      :campos="campos"
      @close="handleCloseRegraModal"
      @submit="handleSubmitRegra"
    />
  </div>
</template>

<script setup lang="ts">
  import { NodeProps } from '@vue-flow/core';
  import { computed, ref } from 'vue';
  import { useFlowBuilderNodes } from 'modules/service-flow/hooks/useFlowBuilderNodes';
  import { v4 as uuidv4 } from 'uuid';
  import type {
    CampoEtapa,
    RegraValidacao,
  } from 'shared/models/server-driven-ui.interface';
  import {
    serializeEtapaUI,
    serializeInicioEtapa,
  } from 'shared/utils/server-driven-ui';
  import FlowNodeContainer from '../FlowNodeContainer.vue';
  import FlowNodeServerDrivenButtonAdd from './FlowNodeServerDrivenButtonAdd.vue';
  import FlowNodeServerDrivenItem from './FlowNodeServerDrivenItem.vue';
  import FlowNodeServerDrivenRegraItem from './FlowNodeServerDrivenRegraItem.vue';
  import FlowNodeServerDrivenCampoModal from './FlowNodeServerDrivenCampoModal.vue';
  import FlowNodeServerDrivenRegraModal from './FlowNodeServerDrivenRegraModal.vue';
  import FlowNodeServerDrivenEtapaModal from './FlowNodeServerDrivenEtapaModal.vue';
  import FlowNodeServerDrivenEtapaItem from './FlowNodeServerDrivenEtapaItem.vue';
  import type { EtapaConfig } from './FlowNodeServerDrivenEtapaModal.vue';

  const props = defineProps<NodeProps>();

  const { updateNodeData, getValueByLanguage } = useFlowBuilderNodes();

  const dataNode = computed(() => getValueByLanguage(props.data.patch));

  const campos = computed<CampoEtapa[]>(
    () => (dataNode.value.campos ?? []) as CampoEtapa[]
  );
  const regras = computed<RegraValidacao[]>(
    () => (dataNode.value.regras ?? []) as RegraValidacao[]
  );

  const data = computed(() => ({
    ...props,
    color: '#6C63FF',
    title: 'Interface dinâmica',
  }));

  // Modal campo
  const openCampoModal = ref(false);
  const currentCampo = ref<Partial<CampoEtapa>>();

  const handleOpenCampoModal = () => (openCampoModal.value = true);

  const handleCloseCampoModal = () => {
    openCampoModal.value = false;
    currentCampo.value = undefined;
  };

  const handleEditCampo = (campo: CampoEtapa) => {
    currentCampo.value = campo;
    openCampoModal.value = true;
  };

  const handleSubmitCampo = (
    payload: Omit<CampoEtapa, 'id' | 'etapaUIId' | 'propsJson'>
  ) => {
    const existing = currentCampo.value;

    let newCampos: CampoEtapa[];

    if (existing?.id) {
      newCampos = campos.value.map((c) =>
        c.id === existing.id
          ? { ...c, ...payload, propsJson: JSON.stringify(payload.props) }
          : c
      );
    } else {
      const novo: CampoEtapa = {
        id: uuidv4(),
        etapaUIId: props.id,
        ...payload,
        propsJson: JSON.stringify(payload.props),
        ordem: campos.value.length + 1,
      };
      newCampos = [...campos.value, novo];
    }

    updateNodeData({
      nodeId: props.id,
      key: props.data.key,
      patch: { campos: newCampos },
    });
    handleCloseCampoModal();
  };

  // Modal regra
  const openRegraModal = ref(false);
  const currentRegra = ref<Partial<RegraValidacao>>();

  const handleOpenRegraModal = () => (openRegraModal.value = true);

  const handleCloseRegraModal = () => {
    openRegraModal.value = false;
    currentRegra.value = undefined;
  };

  const handleEditRegra = (regra: RegraValidacao) => {
    currentRegra.value = regra;
    openRegraModal.value = true;
  };

  const handleSubmitRegra = (
    payload: Omit<RegraValidacao, 'id' | 'etapaUIId' | 'condicoesJson'>
  ) => {
    const existing = currentRegra.value;

    let newRegras: RegraValidacao[];

    if (existing?.id) {
      newRegras = regras.value.map((r) =>
        r.id === existing.id
          ? {
              ...r,
              ...payload,
              condicoesJson: JSON.stringify(payload.condicoes),
            }
          : r
      );
    } else {
      const nova: RegraValidacao = {
        id: uuidv4(),
        etapaUIId: props.id,
        condicoesJson: JSON.stringify(payload.condicoes),
        ...payload,
      };
      newRegras = [...regras.value, nova];
    }

    updateNodeData({
      nodeId: props.id,
      key: props.data.key,
      patch: { regras: newRegras },
    });
    handleCloseRegraModal();
  };

  // Etapa modal
  const openEtapaModal = ref(false);

  const etapaConfig = computed<EtapaConfig | null>(() => {
    const { fluxoId, nomeEtapa } = dataNode.value;
    if (!fluxoId && !nomeEtapa) return null;
    return {
      fluxoId: fluxoId ?? '',
      etapaId: dataNode.value.etapaId ?? props.id,
      nomeEtapa: nomeEtapa ?? '',
    };
  });

  const handleSubmitEtapa = (payload: EtapaConfig) => {
    updateNodeData({ nodeId: props.id, key: props.data.key, patch: payload });
    openEtapaModal.value = false;
  };

  // Derived for JSON preview
  const fluxoId = computed<string>(() => dataNode.value.fluxoId ?? '');
  const etapaId = computed<string>(() => dataNode.value.etapaId ?? props.id);
  const nomeEtapa = computed<string>(() => dataNode.value.nomeEtapa ?? '');
  const tipoEtapa = computed<number>(() => dataNode.value.tipoEtapa ?? 0);

  // JSON preview
  const showJson = ref(false);

  const toggleJsonPreview = () => (showJson.value = !showJson.value);

  const inicioEtapaJson = computed(() =>
    JSON.stringify(
      serializeInicioEtapa(etapaId.value, tipoEtapa.value),
      null,
      2
    )
  );

  const jsonPreview = computed(() => {
    const etapaUI = serializeEtapaUI({
      fluxoId: fluxoId.value || 'flow-id',
      etapaId: etapaId.value,
      nome: nomeEtapa.value || 'Etapa',
      tipo: tipoEtapa.value,
      campos: campos.value,
      regras: regras.value,
    });
    return JSON.stringify(etapaUI, null, 2);
  });

  const copyJson = () => {
    navigator.clipboard.writeText(jsonPreview.value);
  };
</script>

<style lang="scss">
  .flow-node {
    &--server-driven-ui {
      position: relative;

      &--json-preview {
        position: absolute;
        top: 0;
        left: calc(100% + 10px);
        width: 400px;
        max-height: 500px;
        z-index: 10;
        display: flex;
        flex-direction: column;
      }

      &--json-body {
        overflow-y: auto;
        overflow-x: hidden;
        flex: 1;
        min-height: 0;
      }

      &--json-pre {
        font-size: 11px;
        white-space: pre-wrap;
        word-break: break-all;
        color: #333;
        margin: 0;
        line-height: 1.5;
      }
    }
  }
</style>
