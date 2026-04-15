<template>
  <div class="c-flow-build-terms-html">
    <Codemirror
      v-model="htmlContent"
      placeholder="Code goes here..."
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions as never"
    />
  </div>
</template>

<script lang="ts" setup>
  import { defineAsyncComponent, shallowRef } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useFlowBuilderTerms } from 'modules/service-flow/hooks/useFlowBuilderTerms';

  const Codemirror = defineAsyncComponent(async () => {
    const mod = await import('vue-codemirror');
    return mod.Codemirror;
  });

  const store = useFlowBuilderTerms();

  const { htmlContent } = storeToRefs(store);

  const extensions = shallowRef<unknown[]>([]);

  (async () => {
    const [{ html }, { EditorView }] = await Promise.all([
      import('@codemirror/lang-html'),
      import('@codemirror/view'),
    ]);
    extensions.value = [html(), EditorView.lineWrapping];
  })();
</script>

<style lang="scss">
  .c-flow-build-terms-html {
    width: 100%;
    .v-codemirror {
      display: block !important;
      padding: 4em 4em 3.6em;
      width: 100%;
      background: #f0f0f0;

      .cm-editor {
        width: 100%;
        height: 72.01vh;
        background: $white;
        box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.1);
      }
    }
  }
</style>
