<template>
  <div class="popular-banner">
    <div class="popular-banner__wrapper">
      <img
        class="popular-banner__img"
        src="@/assets/image/content/popular-banner.png"
        alt="Banner"
      />
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.popular-banner {
  &__wrapper {
    width: 100%;
    max-height: 300px;
    height: 100%;
  }
  &__img {
    border-radius: 16px;
    width: 100%;
  }
}
</style>
