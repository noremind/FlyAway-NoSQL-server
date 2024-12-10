<template>
  <div class="button" :class="backgroundColor">
    <UiIcons
      v-if="beforeIcon"
      :icon="beforeIcon"
      :color="iconColor"
      :size="iconSize"
    ></UiIcons>
    <button
      :style="{ color: backgroundColor ? 'white' : '' }"
      class="button__btn"
      type="button"
    >
      {{ label }}
    </button>
    <UiIcons
      v-if="afterIcon"
      :icon="afterIcon"
      :color="iconColor"
      :size="iconSize"
    ></UiIcons>
  </div>
</template>

<script setup>
const props = defineProps({
  label: String,
  backgroundColor: String,
  beforeIcon: String,
  afterIcon: String,
  iconSize: String,
  iconColor: String,
});
</script>

<style lang="scss" scoped>
.button {
  padding: 6px 12px;
  border-radius: 26px;
  background-color: $surface-150;
  cursor: pointer;
  height: 100%;
  display: flex;
  gap: 6px;
  align-items: center;
  &__btn {
    font-size: 15.5px;
    color: inherit;
  }
}
</style>
