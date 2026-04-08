<template>
  <v-box
    width="100%"
    height="60vh"
    background="white"
    round="8px"
    padding="0"
    gap="1.5em"
    elevation="large"
    overflow="hidden"
    class="c-preview-auto-id"
  >
    <v-box
      direction="row"
      align="center"
      justify="between"
      :background="defaultColor"
      padding="0.4em 1em"
      border-radius="12px 12px 0 0"
    >
      <v-box direction="row" align="center" gap="0.5em" padding="4px">
        <img src="shared/assets/images/logo.png" alt="Logo" width="32" />
        <v-text color="white" font-size="18px">Certfy</v-text>
      </v-box>
      <v-box
        padding="0"
        direction="row"
        gap="10px"
        align="center"
        justify="end"
      >
        <v-language-switcher
          :current-lang="current"
          :enableds="langs"
          light
          @select="handleSelectLang"
        />
        <v-icon
          button
          name="times"
          color="white"
          @click="handleSelectTab(FlowBuilderTabs.FLOW)"
        />
      </v-box>
    </v-box>

    <slot />
  </v-box>
</template>
<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { defaultColor } from 'shared/constants/variables';
  import {
    FlowBuilderTabs,
    useFlowBuilderSideMenu,
  } from 'modules/service-flow/hooks/useFlowBuilderSideMenu';
  import { VLanguageSwitcher } from 'vsoft-design-system';
  import {
    Lang,
    useFlowBuilderConfig,
  } from 'modules/service-flow/hooks/useFlowBuilderConfig';
  import { computed, ref, watch } from 'vue';

  const { handleSelectTab } = useFlowBuilderSideMenu();

  const storeBuilderConfig = useFlowBuilderConfig();

  const { setCurrentLang } = storeBuilderConfig;

  const { selectedKeysLangs, currentLang, allLangs } =
    storeToRefs(storeBuilderConfig);

  const current = computed(
    () => currentLang.value?.key ?? selectedKeysLangs.value[0]
  );

  const langs = ref<string[]>([current.value]);

  const handleSelectLang = (lang: { name: string; key: string }) => {
    const currentLng = allLangs.value.find(
      (lng) => lng.key === lang.key
    ) as Lang;

    setCurrentLang(currentLng);
  };

  watch(
    () => selectedKeysLangs.value,
    (values) => {
      if (!values.length) {
        langs.value = [current.value];
      } else langs.value = values;
    },
    { deep: true, immediate: true }
  );
</script>

<style lang="scss">
  .c-preview-auto-id {
    &__footer {
      &-button {
        width: 50%;
      }
    }
  }
</style>
