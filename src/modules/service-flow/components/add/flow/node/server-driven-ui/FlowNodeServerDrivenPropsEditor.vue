<template>
  <v-box direction="column" gap="4px" padding="0">
    <v-box
      v-for="(entry, i) in entries"
      :key="i"
      direction="row"
      gap="4px"
      padding="0"
      align="center"
    >
      <v-input
        :model-value="entry.key"
        @update:model-value="(v: string) => updateEntry(i, 'key', v)"
        placeholder="chave"
        hide-label
        size="small"
      />
      <v-input
        :model-value="entry.value"
        @update:model-value="(v: string) => updateEntry(i, 'value', v)"
        placeholder="valor"
        hide-label
        size="small"
      />
      <v-button icon="v-trash" icon-button @click.native="removeEntry(i)" />
    </v-box>

    <v-box padding="0" direction="row" justify="end">
      <v-button icon="plus" icon-button @click.native="addEntry" />
    </v-box>
  </v-box>
</template>

<script setup lang="ts">
  import { reactive, watch } from 'vue';

  const props = defineProps<{ modelValue: Record<string, unknown> }>();
  const emit =
    defineEmits<(e: 'update:modelValue', v: Record<string, unknown>) => void>();

  type Entry = { key: string; value: string };

  const entries = reactive<Entry[]>(
    Object.entries(props.modelValue ?? {}).map(([key, value]) => ({
      key,
      value: String(value),
    }))
  );

  const addEntry = () => entries.push({ key: '', value: '' });

  const removeEntry = (i: number) => entries.splice(i, 1);

  const updateEntry = (i: number, field: 'key' | 'value', v: string) => {
    entries[i][field] = v;
  };

  const parseValue = (v: string): unknown => {
    if (v === 'true') return true;
    if (v === 'false') return false;
    const n = Number(v);
    if (!isNaN(n) && v.trim() !== '') return n;
    return v;
  };

  watch(
    entries,
    () => {
      const result: Record<string, unknown> = {};
      for (const e of entries) {
        if (e.key) result[e.key] = parseValue(e.value);
      }
      emit('update:modelValue', result);
    },
    { deep: true }
  );
</script>
