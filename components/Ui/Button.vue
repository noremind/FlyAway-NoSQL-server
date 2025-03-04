<template>
  <div
    class="button"
    :class="{
      backgroundColor: backgroundColor,
      disabled: disabled,
      loading: isLoading,
    }"
  >
    <UiIcons
      v-if="beforeIcon"
      :icon="beforeIcon"
      :color="iconColor"
      :size="iconSize"
    ></UiIcons>
    <button
      :style="{ color: backgroundColor }"
      class="button__btn"
      :disabled="disabled || isLoading"
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
  disabled: Boolean,
  isLoading: Boolean,
});
</script>

<style lang="scss" scoped>
.button {
  position: relative;
  padding: 6px 12px;
  border-radius: 26px;
  // background-color: initial;
  cursor: pointer;
  height: 100%;
  display: flex;
  gap: 6px;
  align-items: center;
  &__btn {
    font-size: inherit;
    color: inherit;
    font-weight: inherit;
  }
}

.disabled {
  pointer-events: none;
  opacity: 0.7;
  background-color: $surface-400;
}

.loading {
  color: transparent !important;
  pointer-events: none;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    width: 4px;
    height: 4px;
    border-radius: 100%;
    box-shadow: 0 -10px 0 1px #fff, 10px 0 #fff, 0 10px #fff, -10px 0 #fff,
      -7px -7px 0 0.5px #fff, 7px -7px 0 1.5px #fff, 7px 7px #fff, -7px 7px #fff;
    animation: spinZoom 1s steps(8) infinite;
  }
}

@keyframes spinZoom {
  0% {
    transform: scale(0.75) rotate(0);
  }
  100% {
    transform: scale(0.75) rotate(360deg);
  }
}
</style>
