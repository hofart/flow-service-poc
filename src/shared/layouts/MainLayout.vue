<template>
  <div>
    <v-box direction="row" padding="0" class="main-layout">
      <v-box
        alias="main"
        id="main"
        padding="0"
        class="main-layout__main"
        ref="layoutMain"
        justify="between"
      >
        <slot v-if="fullLayout" />
        <v-box v-else direction="row" padding="0">
          <v-box
            :padding="isMobile ? '0.6em' : '2.5em 2em'"
            width="100%"
            ref="layoutContentBody"
          >
            <v-box
              padding="0"
              class="main-layout__body"
              overflow="auto"
              :class="bodyClass"
              :background="light ? '' : 'white'"
              round="8px"
            >
              <v-box
                padding="0 0 0"
                direction="row"
                justify="between"
                align="center"
                width="100%"
                :flex="!isMobile"
              >
                <slot name="header" />
              </v-box>
              <slot />
            </v-box>
          </v-box>

          <template v-if="showSideBar">
            <v-box
              overflow="auto"
              width="100%"
              style="max-width: 300px"
              height="calc(100vh - 60px)"
              background="white"
            >
              <slot name="sidebar-right" />
            </v-box>
          </template>
        </v-box>
      </v-box>
    </v-box>
  </div>
</template>

<script lang="ts" setup>
  import { VBox, useResponsiveScreen } from 'vsoft-design-system';
  import { onMounted, ref } from 'vue';

  export interface LayoutOptions {
    bodyClass?: string;
    light?: boolean;
    fullLayout?: boolean;
    showSideBar?: boolean;
  }

  withDefaults(defineProps<LayoutOptions>(), {
    light: true,
  });

  const layoutContentBody = ref();

  const { isMobile, layoutVisibleHeight } = useResponsiveScreen();

  const updateHeight = () => {
    const el = layoutContentBody.value?.$el as HTMLElement | undefined;

    if (el) {
      layoutVisibleHeight.value = el.clientHeight;
    }
  };

  onMounted(() => {
    updateHeight();
  });
</script>

<style lang="scss">
  .main-layout {
    width: 100%;
    height: 100%;
    min-height: 100vh;

    &__body {
      margin: 0 auto !important;
    }

    &__main {
      position: relative;

      .route-title {
        width: 100%;
      }
    }
  }
</style>
