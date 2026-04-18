<template>
  <div class="media-field">
    <div v-if="label || hasModes" class="media-field__head">
      <label v-if="label" class="media-field__label">{{ label }}</label>

      <div v-if="hasModes" class="media-field__modes">
        <button
          class="media-field__mode"
          type="button"
          :class="{ 'media-field__mode--active': mode === 'upload' }"
          @click="$emit('update:mode', 'upload')"
        >
          Из хранилища
        </button>
        <button
          class="media-field__mode"
          type="button"
          :class="{ 'media-field__mode--active': mode === 'link' }"
          @click="$emit('update:mode', 'link')"
        >
          Ссылка
        </button>
      </div>
    </div>

    <slot name="preview">
      <div v-if="preview" class="media-field__preview">
        <img class="media-field__preview-image" :src="preview" :alt="label || 'Preview'" />
      </div>
    </slot>

    <slot />
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: "",
  },
  mode: {
    type: String,
    default: "upload",
  },
  preview: {
    type: String,
    default: "",
  },
  hasModes: {
    type: Boolean,
    default: true,
  },
});

defineEmits(["update:mode"]);
</script>

<style lang="scss" scoped>
.media-field {
  display: grid;
  gap: 10px;

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  &__label {
    color: $surface-900;
    font-size: 14px;
    font-weight: 600;
  }

  &__modes {
    display: inline-flex;
    gap: 6px;
    padding: 4px;
    background: rgba($surface-150, 0.9);
    border: 1px solid rgba($red-500, 0.08);
    border-radius: 8px;
  }

  &__mode {
    min-height: 32px;
    padding: 0 10px;
    color: $surface-500;
    background: transparent;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;

    &--active {
      color: $surface-900;
      background: $white;
      box-shadow: 0 6px 14px rgba(32, 36, 38, 0.08);
    }
  }

  &__preview {
    overflow: hidden;
    border-radius: 8px;
    border: 1px solid rgba($red-500, 0.08);
    background: $surface-150;
  }

  &__preview-image {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }
}
</style>
