<template>
  <div class="select" :class="{ 'select--margin': !!label }">
    <p class="select__label">{{ label }}</p>
    <Select
      v-model="model"
      :options="options"
      :optionLabel="optionLabel"
      :placeholder="placeholder"
      class="select__field"
    />
  </div>
</template>

<script setup>
import Select from "primevue/select";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
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
  label: {
    type: String,
    default: "",
  },
});
const model = ref(props.modelValue);
</script>

<style lang="scss" scoped>
.select {
  position: relative;
  border: 1px solid $surface-300;
  border-radius: 26px;
  &--margin {
    margin-top: 17px;
  }
  &__label {
    position: absolute;
    top: -18px;
    font-size: 14px;
    font-weight: 400;
  }
}
</style>
