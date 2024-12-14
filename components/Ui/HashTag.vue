<template>
  <div class="hash-tags">
    <div class="hash-tags__wrapper">
      <p class="hash-tags__label" v-if="label">{{ label }}</p>
      <div class="hash-tags__blocks">
        <div class="hash-tags__block" v-for="tag in tags" :key="tag.id">
          {{ tag.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: String,
  modelValue: {
    type: Array,
    default: () => [],
  },
  tags: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped lang="scss">
.hash-tags {
  &__wrapper {
    width: 100%;
  }
  &__label {
    color: $surface-900;
    font-size: 14px;
    margin-bottom: 12px;
    font-weight: 400;
  }
  &__blocks {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  &__block {
    padding: 4px 8px;
    border-radius: 24px;
    background-color: $surface-150;
    font-size: 14px;
    cursor: pointer;
    &--active {
      background-color: $blue-500;
      color: $white;
    }
  }
}
</style>
