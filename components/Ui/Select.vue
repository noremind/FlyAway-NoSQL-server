<template>
  <Select
    v-model="model"
    :options="options"
    :optionLabel="optionLabel"
    :placeholder="placeholder"
  />
</template>

<script setup>
import Select from "primevue/select";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => {},
  },
  options: {
    type: Array,
    default: () => [],
  },
  optionLabel: {
    type: String,
    default: "name",
  },
  placeholder: {
    type: String,
    default: "",
  },
});
const model = ref(props.modelValue);
</script>
