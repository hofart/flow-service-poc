import type * as Components from 'vsoft-design-system/resources/components';
import type * as Compositions from 'vsoft-design-system/resources/compositions';

type ComponentMap<T> = {
  [K in keyof T as T[K] extends new (...args: any) => any ? K : never]: T[K];
};

type GlobalVSoftDesignSystemComponents = ComponentMap<typeof Components>;
type GlobalVSoftDesignSystemCompositions = ComponentMap<typeof Compositions>;

declare module 'vue' {
  export interface GlobalComponents
    extends
      GlobalVSoftDesignSystemComponents,
      GlobalVSoftDesignSystemCompositions {}
}
