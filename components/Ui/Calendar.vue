<template>
  <Calendar v-model="model" showIcon dateFormat="dd.mm.yy">
    <template #inputicon="{ clickCallback }">
      <UiIcons icon="lupa"></UiIcons>
    </template>
  </Calendar>
</template>

<script setup>
import Calendar from "primevue/calendar";

const props = defineProps({
  modelValue: {
    type: [Date, String],
    default: () => null,
  },
});
const model = ref(props.modelValue);
</script>
