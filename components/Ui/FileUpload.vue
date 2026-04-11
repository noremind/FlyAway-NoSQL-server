<template>
  <label class="file-upload">
    <input
      class="file-upload__input"
      type="file"
      :multiple="multiple"
      :accept="accept"
      @change="changeFiles"
    />
    <span class="file-upload__title">{{ title }}</span>
    <span class="file-upload__text">{{ selectedText }}</span>
  </label>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: "Перетащите файлы или выберите",
  },
  accept: {
    type: String,
    default: "image/*",
  },
  multiple: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

const selectedText = computed(() => {
  if (!props.modelValue.length) return "PNG, JPG, WEBP до 4.5MB";
  return `Выбрано файлов: ${props.modelValue.length}`;
});

const changeFiles = (event) => {
  emit("update:modelValue", Array.from(event.target.files || []));
};
</script>

<style lang="scss" scoped>
.file-upload {
  min-height: 132px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  color: $surface-900;
  background: $white;
  border: 1px dashed $red-500;
  border-radius: 8px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: $surface-150;
    transform: translateY(-1px);
  }

  &__input {
    display: none;
  }

  &__title {
    color: $red-500;
    font-weight: 700;
  }

  &__text {
    color: $surface-400;
    font-size: 14px;
  }
}
</style>
