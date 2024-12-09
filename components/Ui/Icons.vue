<template>
  <i :class="[icon, size, color, deg]" class="icon" />
</template>

<script setup>
const props = defineProps({
  icon: [String, Object],
  size: String,
  color: {
    type: String,
    deflaut: "transparent",
  },
  deg: String,
});
</script>

<style lang="scss" scoped></style>
