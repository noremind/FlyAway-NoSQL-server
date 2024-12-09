<template>
  <div class="input">
    <div class="input__wrapper">
      <UiIcons
        v-if="beforeIcon"
        :icon="beforeIcon"
        :color="iconColor"
        :size="iconSize"
      ></UiIcons>
      <input
        class="input__field"
        :type="type"
        name=""
        :value="modelValue"
        @input="$emit('update:modelValue', event.target.value)"
        :placeholder="placeholder"
      />
      <UiIcons
        v-if="afterIcon"
        :icon="afterIcon"
        :color="iconColor"
        :size="iconSize"
      ></UiIcons>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: "text",
  },
  modelValue: {
    type: String,
    defautl: "",
  },
  label: String,
  placeholder: String,
  disabled: Boolean,
  beforeIcon: String,
  afterIcon: String,
  iconSize: String,
  iconColor: String,
});
</script>

<style lang="scss" scoped>
.input {
  border-radius: 26px;
  padding: 12px 18px;
  max-width: 100%;
  border: 1px solid $surface-300;
  &__wrapper {
    display: flex;
    gap: 6px;
    align-items: center;
  }
  &__field {
    &[placeholder] {
      color: $surface-400;
    }
  }
}
</style>
