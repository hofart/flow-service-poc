<template>
  <v-box
    padding="0"
    direction="row"
    align="center"
    gap="12px"
    class="flow-builder-select-language"
  >
    <v-icon
      name="v-language"
      :dot-notification="hasPartialFilledLang"
      translate-y="4px"
      translate-x="0px"
    />
    <v-box
      padding="0"
      direction="row"
      align="center"
      gap="8px"
      width="100px"
      justify="between"
      class="flow-builder-select-language-text"
      @click="handleToggle()"
    >
      <v-text font-weight="600">
        {{ currentLang?.label ?? 'Language' }}
      </v-text>
      <img
        width="24"
        v-if="currentLang?.image"
        :src="currentLang.image"
        :alt="currentLang.label"
      />
    </v-box>

    <v-dropdown
      ref="dropdownRef"
      icon-right
      multiple
      v-model:selected="selectedLangs"
      :items="allLangs"
    >
      <v-box
        class="flow-builder-select-language-item"
        alias="button"
        align="center"
        direction="row"
        justify="between"
        height="50px"
        padding="2em 1em"
        v-for="item in allLangs"
        :key="item.key"
      >
        <v-checkbox
          :partial="isPartialLangFilled(item.key)"
          :disabled="isDisabledCheckBox(item.key)"
          :model-value="isSelected(item.key)"
          @update:modelValue="(v) => toggleSelectedLang(item.key, v)"
        />

        <v-box
          padding="0 0 0 8px"
          direction="row"
          align="center"
          justify="between"
          width="160px"
          class="flow-builder-select-language-button"
          @click="setCurrentLang(item)"
        >
          <v-text :font-weight="currentLang?.key === item.key ? '600' : '400'">
            {{ item.label }}
          </v-text>
          <v-box
            padding="0"
            direction="row"
            align="center"
            justify="end"
            gap="8px"
          >
            <v-tooltip position="bottom">
              <template #content>
                <v-text text-align="left">Idioma em preenchimento</v-text>
              </template>
              <template #target>
                <v-icon
                  v-if="isPartialLangFilled(item.key)"
                  name="exclamation-circle"
                  size="22px"
                  translate-y="3px"
                  color="#E5555C"
                />
              </template>
            </v-tooltip>
            <img :src="item.image" alt="" width="24" />
          </v-box>
        </v-box>
      </v-box>
    </v-dropdown>

    <v-divider verical height="30px" />
  </v-box>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { VDropdown } from 'vsoft-design-system';
  import { useFlowBuilderConfig } from 'modules/service-flow/hooks/useFlowBuilderConfig';
  import { storeToRefs } from 'pinia';

  const store = useFlowBuilderConfig();

  const {
    setCurrentLang,
    toggleSelectedLang,
    isDisabledCheckBox,
    isPartialLangFilled,
  } = store;

  const {
    allLangs,
    selectedLangs,
    selectedKeysLangs,
    currentLang,
    hasPartialFilledLang,
  } = storeToRefs(store);

  const dropdownRef = ref<InstanceType<typeof VDropdown> | null>(null);

  const isSelected = (key: string) => selectedKeysLangs.value.includes(key);

  const handleToggle = () => {
    dropdownRef.value?.toggleMenu();
  };
</script>

<style lang="scss">
  .flow-builder-select-language {
    &-item {
      cursor: pointer;
      background: transparent;
      border: none;
      background: $white;
      &hover {
        background: $neutral-100;
      }
    }

    .v-checkbox {
      transform: translateY(-1px);

      &__box {
        &--active {
          background: #058792 !important;
          border-color: #058792 !important;
        }
      }
    }

    .v-dropdown__menu {
      box-shadow: 0 5px 10px #0003;
    }

    &-text {
      cursor: pointer;
    }

    &-button {
      &.-disabled {
        cursor: not-allowed;
        pointer-events: none;
      }
    }
  }
</style>
