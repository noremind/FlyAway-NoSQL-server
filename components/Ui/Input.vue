<template>
  <div class="input">
    <label class="input__label" for="" v-if="label">{{ label }}</label>
    <div
      class="input__wrapper"
      :class="[customClass, { 'input__wrapper--error': isError }]"
    >
      <UiIcons
        v-if="beforeIcon"
        :icon="beforeIcon"
        :color="iconColor"
        :size="iconSize"
      ></UiIcons>
      <input
        class="input__field"
        :class="{
          'input__field--center': isCenter,
          'input__field--disabled': disabled,
        }"
        :type="type"
        :name="name"
        v-maska
        :data-maska="maska"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        :disabled="disabled"
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
defineProps({
  type: {
    type: String,
    default: "text",
  },
  modelValue: {
    type: [String, Number],
    default: "",
  },
  maska: {
    type: String,
    default: "",
  },
  label: String,
  placeholder: String,
  disabled: Boolean,
  beforeIcon: String,
  afterIcon: String,
  iconSize: String,
  iconColor: String,
  customClass: String,
  isCenter: Boolean,
  isError: Boolean,
  name: String,
});
</script>

<style lang="scss" scoped>
.input {
  &__wrapper {
    border-radius: 26px;
    min-height: 46px;
    padding: 10px 14px;
    max-width: 100%;
    border: 1px solid $surface-300;
    background: $white;
    box-shadow: 0 8px 20px rgba(32, 36, 38, 0.06);
    display: flex;
    gap: 6px;
    align-items: center;
    justify-content: space-between;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;

    &:focus-within {
      border-color: rgba($red-500, 0.55);
      box-shadow: 0 10px 24px rgba($red-500, 0.1);
    }

    &--error {
      border-color: $orange-200;
    }
  }
  &__label {
    display: block;
    margin-bottom: 6px;
    color: $surface-900;
    font-weight: 500;
    font-size: 14px;
  }
  &__field {
    width: 100%;
    min-width: 0;
    color: $surface-900;
    font-size: 14px;
    font-weight: 500;

    &--center {
      text-align: center;
      font-size: 16px;
      font-weight: 500;
    }
    &--disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    &[placeholder] {
      color: $surface-900;
    }

    &::placeholder {
      color: $surface-400;
      font-weight: 500;
    }
  }
}
</style>
