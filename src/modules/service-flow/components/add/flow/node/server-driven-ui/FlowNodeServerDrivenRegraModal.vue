<template>
  <AnimatePresence>
    <animate-box
      padding="1em 12px 6px"
      width="360px"
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
        <!-- mensagemErroUI -->
        <v-box padding="0" direction="column" gap="4px">
          <v-text font-size="13px" :color="color">Mensagem de erro</v-text>
          <v-input
            hide-label
            placeholder="ex: CPF obrigatório e idade mínima 18 anos"
            size="medium"
            v-model="form.mensagemErroUI"
            :error-message="getError('mensagemErroUI')"
          />
        </v-box>

        <!-- Condition builder -->
        <v-box padding="0" direction="column" gap="4px">
          <v-text font-size="13px" :color="color">Condições</v-text>
          <v-box
            padding="8px"
            round="8px"
            background="white"
            direction="column"
          >
            <flow-node-server-driven-condition-builder
              :group="form.condicoes"
              :key-mappers="keyMappers"
              :color="color"
            />
          </v-box>
        </v-box>

        <v-button
          @click="onSubmit"
          type="submit"
          :custom-color="color"
          class="save-button"
          block
        >
          Salvar regra
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
    RegraValidacao,
  } from 'shared/models/server-driven-ui.interface';
  import {
    createCondicaoGroup,
    flattenKeyMappers,
  } from 'shared/utils/server-driven-ui';
  import FlowNodeServerDrivenConditionBuilder from './FlowNodeServerDrivenConditionBuilder.vue';

  const { withMessage } = helpers;

  const props = defineProps<{
    regra?: Partial<RegraValidacao>;
    campos: CampoEtapa[];
  }>();

  const emit = defineEmits<{
    (e: 'close'): void;
    (
      e: 'submit',
      payload: Omit<RegraValidacao, 'id' | 'etapaUIId' | 'condicoesJson'>
    ): void;
  }>();

  const color = '#6C63FF';
  const lightColor = computed(() => getLightColor(color));
  const AnimateBox = motion.create(VBox);
  const collapsed = computed(() => ({ opacity: 0, y: 40, x: 0 }));

  const keyMappers = computed(() => flattenKeyMappers(props.campos));

  const form = reactive({
    mensagemErroUI: '',
    condicoes: createCondicaoGroup(),
  });

  const rules = {
    mensagemErroUI: {
      required: withMessage('Informe a mensagem de erro', required),
    },
  };

  const { v$, getError } = useForm(rules, form);

  const onOutsideClick = () => emit('close');

  const onSubmit = async () => {
    const isValid = await v$.value.$validate();
    if (!isValid) return;

    emit('submit', {
      mensagemErroUI: form.mensagemErroUI,
      condicoes: { ...form.condicoes },
    });
  };

  onMounted(() => {
    if (props.regra) {
      form.mensagemErroUI = props.regra.mensagemErroUI ?? '';
      if (props.regra.condicoes) {
        Object.assign(form.condicoes, props.regra.condicoes);
      }
    }
  });
</script>
