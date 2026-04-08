<template>
  <language-provider>
    <router-view />
  </language-provider>
</template>

<script lang="ts" setup>
  import { LanguageProvider } from 'shared/contexts/LanguageContext';
</script>
