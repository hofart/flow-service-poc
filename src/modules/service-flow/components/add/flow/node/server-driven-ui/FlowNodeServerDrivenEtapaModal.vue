<template>
  <AnimatePresence>
    <animate-box
      padding="1em 12px 6px"
      width="320px"
      round="8px"
      elevation="large"
      class="flow-node--server-driven-ui--modal"
      :background="lightColor"
      v-click-outside="() => emit('close')"
      animate="open"
      initial="collapsed"
      exit="collapsed"
      :variants="{
        open: { opacity: 1, x: 0, y: 0 },
        collapsed: { opacity: 0, y: 40, x: 0 },
      }"
      :transition="{ type: 'spring', stiffness: 120, damping: 18 }"
    >
      <v-box width="100%" padding="0" direction="column" gap="10px">
        <v-box padding="0" direction="column" gap="4px">
          <v-text font-size="13px" :color="color">fluxoId</v-text>
          <v-input
            hide-label
            placeholder="ex: fluxo-cpf-demo"
            size="medium"
            v-model="form.fluxoId"
            :error-message="getError('fluxoId')"
          />
        </v-box>

        <v-box padding="0" direction="column" gap="4px">
          <v-text font-size="13px" :color="color">etapaId (UUID)</v-text>
          <v-input
            hide-label
            placeholder="ex: 8f3b2d1e-..."
            size="medium"
            v-model="form.etapaId"
            :error-message="getError('etapaId')"
          />
        </v-box>

        <v-box padding="0" direction="column" gap="4px">
          <v-text font-size="13px" :color="color">Nome da etapa</v-text>
          <v-input
            hide-label
            placeholder="ex: Dados Pessoais"
            size="medium"
            v-model="form.nomeEtapa"
            :error-message="getError('nomeEtapa')"
          />
        </v-box>

        <v-button
          @click="onSubmit"
          type="submit"
          :custom-color="color"
          class="save-button"
          block
        >
          Salvar etapa
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

  const { withMessage } = helpers;

  export type EtapaConfig = {
    fluxoId: string;
    etapaId: string;
    nomeEtapa: string;
  };

  const props = defineProps<{ etapa?: Partial<EtapaConfig> }>();

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'submit', payload: EtapaConfig): void;
  }>();

  const color = '#6C63FF';
  const lightColor = computed(() => getLightColor(color));
  const AnimateBox = motion.create(VBox);

  const form = reactive<EtapaConfig>({
    fluxoId: '',
    etapaId: '',
    nomeEtapa: '',
  });

  const rules = {
    fluxoId: { required: withMessage('Informe o fluxoId', required) },
    nomeEtapa: { required: withMessage('Informe o nome da etapa', required) },
  };

  const { v$, getError } = useForm(rules, form);

  const onSubmit = async () => {
    const isValid = await v$.value.$validate();
    if (!isValid) return;
    emit('submit', { ...form });
  };

  onMounted(() => {
    if (props.etapa) {
      form.fluxoId = props.etapa.fluxoId ?? '';
      form.etapaId = props.etapa.etapaId ?? '';
      form.nomeEtapa = props.etapa.nomeEtapa ?? '';
    }
  });
</script>
