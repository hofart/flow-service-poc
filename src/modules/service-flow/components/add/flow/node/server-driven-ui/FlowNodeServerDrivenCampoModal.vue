<template>
  <AnimatePresence>
    <animate-box
      padding="1em 12px 6px"
      width="320px"
      round="8px"
      elevation="large"
      class="flow-node--server-driven-ui--modal"
      :background="lightColor"
      v-click-outside="onOutsideClick"
      animate="open"
      initial="collapsed"
      exit="collapsed"
      :variants="{
        open: { opacity: 1, x: 0, y: 0 },
        collapsed: collapsed,
      }"
      :transition="{ type: 'spring', stiffness: 120, damping: 18 }"
    >
      <v-box width="100%" padding="0" direction="column" gap="10px">
        <!-- nomeCampo -->
        <v-box padding="0" direction="column" gap="4px">
          <v-text font-size="13px" :color="color">Nome do campo</v-text>
          <v-input
            hide-label
            placeholder="ex: CPF"
            size="medium"
            v-model="form.nomeCampo"
            :error-message="getError('nomeCampo')"
          />
        </v-box>

        <!-- keyMapper -->
        <v-box padding="0" direction="column" gap="4px">
          <v-text font-size="13px" :color="color">Key mapper</v-text>
          <v-input
            hide-label
            placeholder="ex: dadosPessoais.cpf"
            size="medium"
            v-model="form.keyMapper"
            :error-message="getError('keyMapper')"
          />
        </v-box>

        <!-- tipoComponente -->
        <v-box padding="0" direction="column" gap="4px">
          <v-text font-size="13px" :color="color">Componente</v-text>
          <v-select
            hide-label
            placeholder="Selecione"
            size="medium"
            :options="tipoComponenteOptions"
            :model-value="form.tipoComponente"
            :selected="selectedTipoComponente!"
            @update:model-value="
              (opt: SelectOption) =>
                (form.tipoComponente = opt.key as TipoComponente)
            "
            :error-message="getError('tipoComponente')"
          />
        </v-box>

        <!-- tipoDado -->
        <v-box padding="0" direction="column" gap="4px">
          <v-text font-size="13px" :color="color">Tipo de dado</v-text>
          <v-select
            hide-label
            placeholder="Selecione"
            size="medium"
            :options="tipoDadoOptions"
            :model-value="form.tipoDado"
            :selected="selectedTipoDado!"
            @update:model-value="
              (opt: SelectOption) => (form.tipoDado = opt.key as TipoDado)
            "
          />
        </v-box>

        <!-- obrigatorio -->
        <v-box
          padding="4px 12px"
          direction="row"
          justify="between"
          align="center"
          round="8px"
          background="white"
        >
          <v-text font-size="13px" color="rgb(150 150 150)">Obrigatório</v-text>
          <v-checkbox v-model="form.obrigatorio" size="small" />
        </v-box>

        <!-- props editor -->
        <v-box padding="0" direction="column" gap="4px">
          <v-text font-size="13px" :color="color">Props (chave / valor)</v-text>
          <flow-node-server-driven-props-editor v-model="form.props" />
        </v-box>

        <v-button
          @click="onSubmit"
          type="submit"
          :custom-color="color"
          class="save-button"
          block
        >
          Salvar campo
        </v-button>
      </v-box>
    </animate-box>
  </AnimatePresence>
</template>

<script setup lang="ts">
  import { AnimatePresence, motion } from 'motion-v';
  import { computed, onMounted, reactive } from 'vue';
  import { helpers, required } from '@vuelidate/validators';
  import { getLightColor } from 'shared/utils/lightColor';
  import { useForm, VBox } from 'vsoft-design-system';
  import type {
    CampoEtapa,
    TipoComponente,
    TipoDado,
  } from 'shared/models/server-driven-ui.interface';
  import FlowNodeServerDrivenPropsEditor from './FlowNodeServerDrivenPropsEditor.vue';

  const { withMessage } = helpers;

  const props = defineProps<{ campo?: Partial<CampoEtapa> }>();

  const emit = defineEmits<{
    (e: 'close'): void;
    (
      e: 'submit',
      payload: Omit<CampoEtapa, 'id' | 'etapaUIId' | 'propsJson'>
    ): void;
  }>();

  const color = '#6C63FF';
  const lightColor = computed(() => getLightColor(color));
  const AnimateBox = motion.create(VBox);
  const collapsed = computed(() => ({ opacity: 0, y: 40, x: 0 }));

  type SelectOption = { label: string; key?: string };

  const tipoComponenteOptions: SelectOption[] = [
    { label: 'vsoft-text-input', key: 'vsoft-text-input' },
    { label: 'vsoft-select', key: 'vsoft-select' },
    { label: 'vsoft-date-picker', key: 'vsoft-date-picker' },
  ];

  const tipoDadoOptions: SelectOption[] = [
    { label: 'string', key: 'string' },
    { label: 'number', key: 'number' },
    { label: 'boolean', key: 'boolean' },
    { label: 'array', key: 'array' },
  ];

  const form = reactive({
    nomeCampo: '',
    keyMapper: '',
    tipoComponente: 'vsoft-text-input' as TipoComponente,
    tipoDado: 'string' as TipoDado,
    obrigatorio: false,
    props: {} as Record<string, unknown>,
  });

  const selectedTipoComponente = computed(() =>
    tipoComponenteOptions.find((o) => o.key === form.tipoComponente)
  );

  const selectedTipoDado = computed(() =>
    tipoDadoOptions.find((o) => o.key === form.tipoDado)
  );

  const rules = {
    nomeCampo: { required: withMessage('Informe o nome do campo', required) },
    keyMapper: { required: withMessage('Informe o key mapper', required) },
    tipoComponente: {
      required: withMessage('Selecione o componente', required),
    },
  };

  const { v$, getError } = useForm(rules, form);

  const onOutsideClick = () => emit('close');

  const onSubmit = async () => {
    const isValid = await v$.value.$validate();
    if (!isValid) return;

    emit('submit', {
      paiId: null,
      filhos: [],
      nomeCampo: form.nomeCampo,
      keyMapper: form.keyMapper,
      tipoComponente: form.tipoComponente,
      tipoDado: form.tipoDado,
      obrigatorio: form.obrigatorio,
      props: { ...form.props },
      ordem: props.campo?.ordem ?? 0,
    });
  };

  onMounted(() => {
    if (props.campo) {
      form.nomeCampo = props.campo.nomeCampo ?? '';
      form.keyMapper = props.campo.keyMapper ?? '';
      form.tipoComponente = props.campo.tipoComponente ?? 'vsoft-text-input';
      form.tipoDado = props.campo.tipoDado ?? 'string';
      form.obrigatorio = props.campo.obrigatorio ?? false;
      form.props = { ...(props.campo.props ?? {}) };
    }
  });
</script>

<style lang="scss">
  .flow-node {
    &--server-driven-ui {
      &--modal {
        position: absolute;
        top: 0;
        left: calc(100% + 10px);

        button {
          outline: none;
          border: none;
        }

        input,
        textarea,
        button,
        .v-input__container,
        .v-select__container {
          border-color: v-bind(lightColor) !important;
        }
      }
    }
  }
</style>
