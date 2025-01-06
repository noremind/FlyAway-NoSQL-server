<template>
  <div class="tabs">
    <div
      class="tabs__wrapper"
      :class="{ 'tabs__wrapper--line': type === 'line' }"
    >
      <ul class="tabs__list" :class="{ 'tabs__list--line': type === 'line' }">
        <li
          class="tabs__list-item"
          v-for="tab in tabs"
          :key="tab.id"
          :class="{
            'tabs__list-item--active': tab.id === modelValue?.id,
            'tabs__list-item--active-line':
              tab.id === modelValue?.id && type === 'line',
          }"
          @click="emit('update:modelValue', tab)"
        >
          <UiIcons
            v-if="tab.icon"
            :icon="tab.icon"
            size="size-30"
            :color="tab.id === modelValue?.id ? 'white' : 'blue-500'"
          ></UiIcons>
          <p class="tabs__list-name">{{ tab.name }}</p>
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
  type: {
    type: String,
    default: "block",
  },
});
</script>

<style lang="scss" scoped>
.tabs {
  &__wrapper {
    &--line {
      display: inline-block;
      border-bottom: 1.5px solid $surface-300;
    }
  }
  &__list {
    display: flex;
    gap: 6px;
    align-items: center;
    &--line {
      gap: 0;
    }
  }
  &__list-item {
    color: $surface-900;
    cursor: pointer;
    border-radius: 24px;
    // font-size: 24px;
    font-size: clamp(0.875rem, 0.648rem + 1.14vw, 1.5rem);
    padding: 8px 16px;
    display: flex;
    gap: 6px;
    align-items: center;
    &--active {
      background-color: $blue-500;
      color: $white;
    }
    &--active-line {
      color: $blue-500;
      background-color: transparent;
      border-bottom: 3px solid $blue-500;
      border-radius: 0;
    }
  }
}

@media (max-width: 375px) {
  .tabs {
    &__list {
      justify-content: space-between;
    }
    &__list-item {
      flex-grow: 1;
      padding: 2px 8px;
      font-weight: 400;
    }
  }
}
</style>
