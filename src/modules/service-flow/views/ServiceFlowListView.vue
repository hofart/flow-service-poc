<template>
  <main-layout class="p-service-flow">
    <template #header>
      <v-text tag="h5" white-space="nowrap">
        {{ $t('modules.serviceFlow.views.list.title') }}
      </v-text>
      <v-box
        direction="row"
        padding="0"
        align="center"
        gap="12px"
        justify="end"
      >
        <v-button
          size="large"
          :to="{
            name: $t('routes.serviceFlow.children.add.name'),
          }"
        >
          {{ $t('modules.serviceFlow.views.list.buttons.add') }}
        </v-button>
      </v-box>
    </template>
    <list-scroll />
  </main-layout>
</template>
<script setup lang="ts">
  import ListScroll from '../components/list/ListScroll.vue';
</script>
