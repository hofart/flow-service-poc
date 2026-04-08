import { i18next } from 'core/i18n';
import { ELanguageType } from 'shared/types/service-flow.types';
import {
  defineComponent,
  inject,
  InjectionKey,
  provide,
  reactive,
  readonly,
  toRefs,
} from 'vue';

type LanguageSettingsState = {
  language:
    | ELanguageType.English
    | ELanguageType.Portuguese
    | ELanguageType.Spanish;
};

export type LanguageTypes = LanguageSettingsState['language'];

export const LanguageSettingsStateSymbol: InjectionKey<
  ReturnType<typeof toRefs<LanguageSettingsState>>
> = Symbol('LanguageSettingsState');

export const LanguageSettingsUpdateSymbol: InjectionKey<
  <K extends keyof LanguageSettingsState>(
    key: K,
    value: LanguageSettingsState[K]
  ) => void
> = Symbol('LanguageSettingsUpdate');

const LanguageProvider = defineComponent({
  name: 'LanguageProvider',
  setup(_, { slots }) {
    const capturesLang = navigator.language.split('-');

    const language = capturesLang[0] as LanguageTypes;

    const state = reactive<LanguageSettingsState>({ language });

    provide(LanguageSettingsStateSymbol, toRefs(readonly(state)));

    const update = <K extends keyof LanguageSettingsState>(
      key: K,
      value: LanguageSettingsState[K]
    ) => {
      state[key] = value;
    };

    provide(LanguageSettingsUpdateSymbol, update);

    return () => slots.default?.();
  },
});

export { LanguageProvider };
