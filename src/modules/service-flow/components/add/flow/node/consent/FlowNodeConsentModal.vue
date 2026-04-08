<template>
  <AnimatePresence>
    <animate-box
      padding="1em 12px 6px"
      width="260px"
      round="8px"
      elevation="large"
      class="flow-node--consent--modal"
      :background="lightColor"
      v-click-outside="onOutsideClick"
      animate="open"
      initial="collapsed"
      exit="collapsed"
      :variants="{
        open: {
          opacity: 1,
          x: 0,
          y: 0,
        },
        collapsed: collapsed,
      }"
      :transition="{ type: 'spring', stiffness: 120, damping: 18 }"
    >
      <v-box width="100%" padding="0">
        <v-box margin="0 0 1em" padding="0">
          <v-text font-size="13px" :color="color">Item de consentimento</v-text>
          <v-input
            v-model="form.name"
            hide-label
            placeholder="Nome do item"
            size="medium"
            required
            :error-message="getError('name')"
          />
          <v-input
            v-model="form.description"
            multiline
            placeholder="Descrição do item de consentimento"
            :rows="6"
            hide-label
            required
            :error-message="getError('description')"
          />
        </v-box>

        <v-box direction="column" gap="4px" padding="0" margin="0 0 0.41em">
          <v-box
            alias="button"
            padding="4px 12px 4px 12px"
            direction="row"
            justify="between"
            align="center"
            round="8px"
            height="40px"
            background="white"
          >
            <v-text font-size="13px" color="rgb(150 150 150)">
              Item obrigatório
            </v-text>
            <v-checkbox v-model="form.required" size="small" />
          </v-box>
          <v-box
            alias="button"
            padding="4px 12px 4px 12px"
            direction="row"
            justify="between"
            align="center"
            round="8px"
            height="40px"
            background="white"
          >
            <v-text font-size="13px" color="rgb(150 150 150)">
              Status inicial ativo
            </v-text>
            <v-checkbox v-model="form.initialActive" size="small" />
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

  export type FormItem = {
    name: string;
    description: string;
    required: boolean;
    initialActive: boolean;
  };

  const { withMessage } = helpers;

  const props = defineProps<{ item?: Partial<FormItem> }>();

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'submit', payload: FormItem): void;
  }>();

  const color = '#07B6B4';

  const lightColor = computed(() => getLightColor(color));

  const AnimateBox = motion.create(VBox);

  const collapsed = computed(() => ({
    opacity: 0,
    y: 40,
    x: 0,
  }));

  const defaultForm = {
    name: '',
    description: '',
    required: false,
    initialActive: false,
  };

  const form = reactive({ ...defaultForm });

  const rules = {
    name: { required: withMessage('Digite um nome', required) },
    description: { required: withMessage('Digite uma descrição', required) },
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

    emit('submit', form);
  };

  onMounted(() => {
    if (props.item) {
      form.name = String(props.item.name ?? '');
      form.description = String(props.item.description ?? '');
      form.required = Boolean(props.item.required);
      form.initialActive = Boolean(props.item.initialActive);
    }
  });
</script>

<style lang="scss">
  .flow-node {
    &--consent {
      &--modal {
        position: absolute;
        top: 0;
        right: calc(-100% - 10px);

        button {
          outline: none;
          border: none;
        }
        input,
        textarea,
        button,
        .v-input__container {
          border-color: v-bind(lightColor) !important;
        }
      }
    }
  }
</style>
