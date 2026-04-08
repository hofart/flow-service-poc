declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    LottieAnimation: (typeof import('vue3-lottie'))['Vue3Lottie'];
  }
}
export interface OptionsFilePicker {
  types: Type[];
  multiple: boolean;
}

export interface Type {
  description: string;
  accept: Accept;
}

export interface Accept {
  'text/plain': string[];
}

declare global {
  interface Window {
    showOpenFilePicker: (
      options?: OptionsFilePicker
    ) => Promise<FileSystemFileHandle[]>;
  }
}

export {};
