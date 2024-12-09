<template>
  <div class="tabs">
    <div class="tabs__wrapper">
      <ul class="tabs__list">
        <li
          class="tabs__list-item"
          v-for="tab in tabs"
          :key="tab.id"
          :class="{ 'tabs__list-item--active': tab.id === modelValue.id }"
          @click="emit('update:modelValue', tab)"
        >
          {{ tab.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => {},
  },
  tabs: {
    type: Array,
    default: () => [],
  },
});
</script>

<style lang="scss" scoped>
.tabs {
  &__list {
    display: flex;
    gap: 6px;
    align-items: center;
  }
  &__list-item {
    color: $surface-900;
    cursor: pointer;
    padding: 8px;
    border-radius: 24px;
    font-size: 24px;
    padding: 8px 16px;
    &--active {
      background-color: $blue-500;
      color: $white;
    }
  }
}
</style>
