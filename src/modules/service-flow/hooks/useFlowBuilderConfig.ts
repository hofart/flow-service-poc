import { defineStore, storeToRefs } from 'pinia';
import { useLanguage } from 'shared/hooks/useLanguage';
import { computed, ComputedRef, ref, watch } from 'vue';
import { useFlowBuilderNodes } from './useFlowBuilderNodes';
import { PatchType } from 'shared/models/service-flow-nodes.interface';
import enFlag from 'shared/assets/images/flags/en.svg';
import esFlag from 'shared/assets/images/flags/es.svg';
import ptFlag from 'shared/assets/images/flags/pt.svg';
import { useServiceFlow } from './useServiceFlow';
import { useTranslation } from 'i18next-vue';

export interface Lang {
  key: string;
  label: string;
  image: string;
  disabled: boolean;
}

export const useFlowBuilderConfig = defineStore('flowBuilderConfig', () => {
  const storeFlowNodes = useFlowBuilderNodes();

  const storeServiceFlow = useServiceFlow();

  const { language } = useLanguage();

  const { t } = useTranslation();

  const { nodes } = storeToRefs(storeFlowNodes);

  const { flowConfig } = storeToRefs(storeServiceFlow);

  const currentLang = ref<Lang>();

  const flowTitle = computed(() => flowConfig.value?.name ?? 'Fluxo teste 1');

  const selectedKeysLangs = ref<string[]>([]);

  const allLangs = ref<Lang[]>([
    {
      key: 'PORTUGUESE',
      label: t('modules.serviceFlow.views.add.config.languages.pt'),
      image: ptFlag,
      disabled: false,
    },
    {
      key: 'ENGLISH',
      label: t('modules.serviceFlow.views.add.config.languages.en'),
      image: enFlag,
      disabled: false,
    },
    {
      key: 'SPANISH',
      label: t('modules.serviceFlow.views.add.config.languages.es'),
      image: esFlag,
      disabled: false,
    },
  ]);

  const selectedLangs = computed<Lang[]>({
    get: () =>
      allLangs.value.filter((i) => selectedKeysLangs.value.includes(i.key)),
    set: (arr) => {
      selectedKeysLangs.value = Array.from(new Set(arr.map((i) => i.key)));
    },
  });

  const hasPartialFilledLang: ComputedRef<boolean> = computed(() => {
    return nodes.value.some((node) =>
      node.data.patch?.some((p: PatchType) => Boolean(p.partialFilled))
    );
  });

  const hasAnyEmptyLang: ComputedRef<boolean> = computed(() => {
    return nodes.value.some((node) =>
      node.data.patch?.some((p: PatchType) => Boolean(p.empty))
    );
  });

  const toggleSelectedLang = (key: string, checked?: boolean) => {
    const set = new Set(selectedKeysLangs.value);

    const shouldSelect = checked ?? !set.has(key);

    shouldSelect ? set.add(key) : set.delete(key);

    selectedKeysLangs.value = [...set];
  };

  const setCurrentLang = (lang: Lang) => {
    currentLang.value = lang;
  };

  const isPartialLangFilled = (lang: string) =>
    nodes.value.some((node) => {
      const patch = node.data.patch?.find(
        (p: PatchType) => p.language === lang
      );
      return Boolean(patch?.partialFilled);
    });

  const isAnyNodeEmpty = (lang: string) => {
    const allNodes = nodes.value.filter((node) => node.id !== 'home');

    if (!allNodes.length) {
      return true;
    }

    return allNodes.some((node) => {
      const currentPatch = node.data.patch?.find(
        (p: { language: string }) => p.language === lang
      );

      return !currentPatch || currentPatch.empty;
    });
  };

  const isDisabledCheckBox = (lang: string) => {
    return isAnyNodeEmpty(lang) || isPartialLangFilled(lang);
  };

  watch(
    () => selectedKeysLangs.value,
    (langs) => {
      if (!langs.length) {
        currentLang.value = allLangs.value.find(({ key }) => key === language)!;
      }
    },
    { immediate: true }
  );

  return {
    flowTitle,
    selectedLangs,
    allLangs,
    selectedKeysLangs,
    currentLang,
    toggleSelectedLang,
    setCurrentLang,
    isPartialLangFilled,
    hasPartialFilledLang,
    isDisabledCheckBox,
    hasAnyEmptyLang,
  };
});
