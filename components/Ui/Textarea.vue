<template>
  <div class="textarea">
    <label class="textarea__label" v-if="label">{{ label }}</label>
    <div class="textarea__wrapper">
      <textarea
        :rows="rows"
        :cols="cols"
        :placeholder="placeholder"
        class="textarea__field"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  label: String,
  placeholder: String,
  rows: {
    type: Number,
    default: 5,
  },
  cols: Number,
});

defineEmits(["update:modelValue"]);
</script>

<style lang="scss" scoped>
.textarea {
  &__label {
    display: block;
    margin-bottom: 6px;
    color: $surface-900;
    font-size: 14px;
  }

  &__wrapper {
    border: 1px solid $surface-300;
    border-radius: 8px;
    padding: 12px;
  }

  &__field {
    width: 100%;
    min-height: 120px;
    resize: vertical;
  }
}
</style>
