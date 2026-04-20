<template>
  <v-box direction="column" gap="6px" padding="0" class="condition-builder">
    <!-- Group header -->
    <v-box direction="row" gap="6px" padding="0" align="center">
      <v-box
        alias="button"
        padding="2px 10px"
        round="6px"
        background="white"
        @click.native="toggleOperador"
        class="condition-builder__operator"
      >
        <v-text font-size="12px" :color="color">{{ group.operador }}</v-text>
      </v-box>

      <v-button
        size="small"
        :custom-color="color"
        @click.native="addRule"
        class="condition-builder__btn-add"
      >
        + Regra
      </v-button>

      <v-button
        size="small"
        :custom-color="color"
        @click.native="addSubgrupo"
        class="condition-builder__btn-add"
      >
        + Subgrupo
      </v-button>

      <v-button
        v-if="removable"
        icon="v-trash"
        icon-button
        @click.native="$emit('remove')"
      />
    </v-box>

    <!-- Children -->
    <v-box
      v-for="(child, i) in group.children"
      :key="i"
      direction="column"
      padding="0 0 0 12px"
      gap="4px"
      class="condition-builder__child"
    >
      <!-- Subgroup (recursivo) -->
      <FlowNodeServerDrivenConditionBuilder
        v-if="child.type === 'group'"
        :group="child"
        :key-mappers="keyMappers"
        :color="color"
        removable
        @remove="removeChild(i)"
      />

      <!-- Rule -->
      <v-box v-else direction="row" gap="4px" padding="0" align="center">
        <v-select
          hide-label
          size="small"
          placeholder="Campo"
          :options="fieldOptions"
          :model-value="child.field"
          :selected="selectedField(child.field)"
          @update:model-value="
            (opt: FieldOption) => (child.field = opt.key ?? '')
          "
          style="flex: 1"
        />

        <v-select
          hide-label
          size="small"
          placeholder="Operador"
          :options="operatorOptions"
          :model-value="child.operador"
          :selected="selectedOperator(child.operador)"
          @update:model-value="
            (opt: OperatorOption) => onOperatorChange(child, opt)
          "
          style="flex: 1"
        />

        <v-input
          v-if="needsValue(child.operador)"
          hide-label
          size="small"
          :model-value="String(child.value ?? '')"
          @update:model-value="(v: string) => setRuleValue(child, v)"
          placeholder="Valor"
          style="flex: 1"
        />

        <v-button icon="v-trash" icon-button @click.native="removeChild(i)" />
      </v-box>
    </v-box>
  </v-box>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import type {
    CondicaoNode,
    CondicaoOperador,
  } from 'shared/models/server-driven-ui.interface';
  import {
    createCondicaoGroup,
    createCondicaoRule,
  } from 'shared/utils/server-driven-ui';
  import FlowNodeServerDrivenConditionBuilder from './FlowNodeServerDrivenConditionBuilder.vue';

  type GroupNode = Extract<CondicaoNode, { type: 'group' }>;
  type RuleNode = Extract<CondicaoNode, { type: 'rule' }>;

  const props = defineProps<{
    group: GroupNode;
    keyMappers: Array<{ keyMapper: string; nomeCampo: string }>;
    color: string;
    removable?: boolean;
  }>();

  defineEmits<(e: 'remove') => void>();

  const OPERATORS_WITHOUT_VALUE: CondicaoOperador[] = ['isEmpty', 'isNotEmpty'];

  const needsValue = (op: CondicaoOperador) =>
    !OPERATORS_WITHOUT_VALUE.includes(op);

  const toggleOperador = () => {
    props.group.operador = props.group.operador === 'AND' ? 'OR' : 'AND';
  };

  const addRule = () => {
    props.group.children.push(createCondicaoRule());
  };

  const addSubgrupo = () => {
    props.group.children.push(createCondicaoGroup());
  };

  const removeChild = (i: number) => {
    props.group.children.splice(i, 1);
  };

  const onOperatorChange = (rule: RuleNode, opt: OperatorOption) => {
    rule.operador = (opt.key ?? '=') as CondicaoOperador;
    if (OPERATORS_WITHOUT_VALUE.includes(rule.operador)) {
      rule.value = undefined;
    }
  };

  const setRuleValue = (rule: RuleNode, v: string) => {
    rule.value = v;
  };

  type FieldOption = { label: string; key?: string };
  type OperatorOption = { label: string; key?: string };

  const fieldOptions = computed(() =>
    props.keyMappers.map((km) => ({
      label: `${km.nomeCampo} (${km.keyMapper})`,
      key: km.keyMapper,
    }))
  );

  const operatorOptions: OperatorOption[] = [
    { label: 'igual (=)', key: '=' },
    { label: 'diferente (!=)', key: '!=' },
    { label: 'maior (>)', key: '>' },
    { label: 'maior ou igual (>=)', key: '>=' },
    { label: 'menor (<)', key: '<' },
    { label: 'menor ou igual (<=)', key: '<=' },
    { label: 'contém', key: 'contains' },
    { label: 'começa com', key: 'startsWith' },
    { label: 'está vazio', key: 'isEmpty' },
    { label: 'não está vazio', key: 'isNotEmpty' },
    { label: 'está em (in)', key: 'in' },
  ];

  const selectedField = (field: string) =>
    fieldOptions.value.find((o) => o.key === field) ?? {
      label: field,
      key: field,
    };
  const selectedOperator = (op: CondicaoOperador) =>
    operatorOptions.find((o) => o.key === op) ?? { label: op, key: op };
</script>

<style lang="scss">
  .condition-builder {
    &__operator {
      cursor: pointer;
      user-select: none;
      min-width: 44px;
      text-align: center;
    }

    &__btn-add {
      font-size: 11px !important;
      padding: 2px 8px !important;
      height: auto !important;
    }

    &__child {
      border-left: 2px solid rgba(108, 99, 255, 0.2);
    }
  }
</style>
