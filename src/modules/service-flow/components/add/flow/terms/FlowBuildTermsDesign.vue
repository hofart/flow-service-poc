<template>
  <quill-editor
    ref="quillRef"
    :content="htmlContent"
    contentType="html"
    toolbar="full"
    @update:content="onEditorChange"
  />
</template>

<script lang="ts" setup>
  import { defineAsyncComponent } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useFlowBuilderTerms } from 'modules/service-flow/hooks/useFlowBuilderTerms';

  const QuillEditor = defineAsyncComponent(async () => {
    const mod = await import('@vueup/vue-quill');
    return mod.QuillEditor;
  });

  const store = useFlowBuilderTerms();

  const { htmlContent, quillRef } = storeToRefs(store);

  const onEditorChange = (newValue: string) => {
    htmlContent.value = newValue;
  };
</script>

<style lang="scss">
  .c-flow-terms-edit {
    &__header {
      &-savebutton {
        background: transparent;
        border: none;
        box-shadow: none;
        width: auto;
        cursor: pointer;
      }
    }
    .ql-toolbar {
      border: none !important;
      padding: 1em;
    }
    .ql-container {
      padding: 4em;
      border: none;
      width: 100%;
      border: none !important;
      background: #f0f0f0;

      .ql-editor {
        height: 65vh;
        background: white;
        box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.1);
      }
    }
  }
</style>
