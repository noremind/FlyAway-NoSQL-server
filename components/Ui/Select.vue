<template>
  <div class="select">
    <label v-if="label" class="select__label">{{ label }}</label>

    <div class="select__wrapper" :class="{ 'select__wrapper--disabled': disabled }">
      <Select
        v-model="model"
        :options="options"
        :optionLabel="optionLabel"
        :optionValue="optionValue || undefined"
        :placeholder="placeholder"
        :disabled="disabled"
        class="select__field"
      />
    </div>
  </div>
</template>

<script setup>
import Select from "primevue/select";

const props = defineProps({
  modelValue: {
    type: [String, Number, Object, Boolean, Array],
    default: null,
  },
  options: {
    type: Array,
    default: () => [],
  },
  optionLabel: {
    type: String,
    default: "name",
  },
  optionValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  disabled: Boolean,
});
const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<style lang="scss" scoped>
.select {
  &__label {
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
    font-weight: 500;
    color: $surface-900;
  }

  &__wrapper {
    border: 1px solid $surface-300;
    border-radius: 26px;
    background: $white;
    box-shadow: 0 8px 20px rgba(32, 36, 38, 0.06);
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;

    &:focus-within {
      border-color: rgba($red-500, 0.55);
      box-shadow: 0 10px 24px rgba($red-500, 0.1);
    }

    &--disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }
  }
}
</style>
