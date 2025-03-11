<template>
  <button class="locale" type="button">
    <span class="locale-text">RU</span>
  </button>
</template>

<script setup></script>

<style lang="scss" scoped>
.locale {
  border: 1px solid $red-500;
  color: $red-500;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  &-text {
    transform: translate(0.5px, 1px);
  }
}
</style>
