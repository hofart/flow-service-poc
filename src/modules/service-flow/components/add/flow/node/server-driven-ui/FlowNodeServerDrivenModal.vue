<template>
  <AnimatePresence>
    <animate-box
      padding="1em 12px 6px"
      width="280px"
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
      <v-box width="100%" padding="0">
        <v-box margin="0 0 1em" padding="0">
          <v-text font-size="13px" :color="color">Componente</v-text>
          <v-select
            hide-label
            placeholder="Selecione o componente"
            size="medium"
            :options="componentOptions"
            :model-value="form.component"
            :selected="selectedOption"
            @update:model-value="onComponentChange"
            :error-message="getError('component')"
          />
        </v-box>

        <v-box direction="column" gap="4px" padding="0" margin="0 0 0.41em">
          <v-text font-size="13px" :color="color">Condições</v-text>

          <v-box
            alias="button"
            padding="4px 12px"
            direction="row"
            justify="between"
            align="center"
            round="8px"
            height="40px"
            background="white"
          >
            <v-text font-size="13px" color="rgb(150 150 150)">
              Obrigatório
            </v-text>
            <v-checkbox v-model="form.condicoes.obrigatorio" size="small" />
          </v-box>

          <v-box
            alias="button"
            padding="4px 12px"
            direction="row"
            justify="between"
            align="center"
            round="8px"
            height="40px"
            background="white"
          >
            <v-text font-size="13px" color="rgb(150 150 150)">Visível</v-text>
            <v-checkbox v-model="form.condicoes.visivel" size="small" />
          </v-box>
        </v-box>

        <v-button
          @click="onSubmit"
          type="submit"
          :custom-color="color"
          class="save-button"
          block
        >
          Salvar
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

  export type ServerDrivenCondicoes = {
    obrigatorio: boolean;
    visivel: boolean;
  };

  export type ServerDrivenItem = {
    component: 'modal' | 'input';
    condicoes: ServerDrivenCondicoes;
  };

  const { withMessage } = helpers;

  const props = defineProps<{ item?: Partial<ServerDrivenItem> }>();

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'submit', payload: ServerDrivenItem): void;
  }>();

  const color = '#6C63FF';

  const lightColor = computed(() => getLightColor(color));

  const AnimateBox = motion.create(VBox);

  const collapsed = computed(() => ({ opacity: 0, y: 40, x: 0 }));

  type ComponentOption = { label: string; key?: string };

  const componentOptions: ComponentOption[] = [
    { label: 'Modal', key: 'modal' },
    { label: 'Input', key: 'input' },
  ];

  const selectedOption = computed<ComponentOption>(
    () =>
      componentOptions.find((opt) => opt.key === form.component) ??
      componentOptions[1]
  );

  const onComponentChange = (item: ComponentOption) => {
    form.component = (item?.key ?? 'input') as ServerDrivenItem['component'];
  };

  const defaultCondicoes: ServerDrivenCondicoes = {
    obrigatorio: false,
    visivel: true,
  };

  const form = reactive<ServerDrivenItem>({
    component: 'input',
    condicoes: { ...defaultCondicoes },
  });

  const rules = {
    component: { required: withMessage('Selecione um componente', required) },
  };

  const { v$, getError } = useForm(rules, form);

  const onOutsideClick = () => {
    emit('close');
  };

  const onSubmit = async () => {
    const isValid = await v$.value.$validate();

    if (!isValid) {
      return;
    }

    emit('submit', { ...form, condicoes: { ...form.condicoes } });
  };

  onMounted(() => {
    if (props.item) {
      form.component = props.item.component ?? 'input';
      form.condicoes = { ...defaultCondicoes, ...props.item.condicoes };
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
