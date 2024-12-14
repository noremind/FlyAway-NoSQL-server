<template>
  <div class="range">
    <span class="range__text range__text--min" v-if="min || min === 0">{{
      min
    }}</span>
    <Slider v-model="priceValue" :max="max" :min="0" @change="output()" range />
    <span class="range__text range__text--max" v-if="max">{{ max }}</span>
  </div>
</template>

<script setup>
const emit = defineEmits(["updatePrice"]);
const props = defineProps({
  prices: {
    type: Array,
    default: [0, 100],
  },
  min: {
    type: Number,
    default: 20,
  },
  max: {
    type: Number,
    default: 80,
  },
});

const priceValue = ref([]);
</script>

<style scoped lang="scss">
.range {
  position: relative;
  margin-top: 32px;
  &__text {
    font-size: 10.5px;
    position: absolute;
    &--max {
      right: 0;
      top: -20px;
    }
    &--min {
      left: 0;
      top: -20px;
    }
  }
}

.p-slider {
  position: relative !important;
  height: 4px !important;
  border-radius: 6px;
  background-color: $surface-400 !important;
  pointer-events: none;
}
.p-slider :deep(.p-slider-range) {
  border-radius: 6px !important;
  height: 100% !important;
  background: $blue-500 !important;
  transition: all 0.18s linear;
  transform: translateX(6px);
}
.p-slider :deep(.p-slider-handle) {
  margin-top: -10px;
  display: flex !important;
  justify-content: center;
  align-items: center;
  height: 20px;
  width: 20px;
  background: $white;
  border: 2px solid $blue-500 !important;
  border-radius: 50%;
  transition: all 0.18s linear;
  // transition: background-color 0.4s, color 0.4s, border-color 0.4s,
  //   box-shadow 0.4s, outline-color 0.4s;
  outline-color: transparent;
  top: 50%;
  cursor: grab;
  touch-action: none;
  pointer-events: all;
}
.p-slider :deep(.p-slider-handle:last-child) {
  transform: translateX(-50%);
}
</style>
