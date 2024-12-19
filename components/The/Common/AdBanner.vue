<template>
  <div class="ad-banner">
    <div class="ad-banner__wrapper">
      <img
        class="ad-banner__img"
        src="@/assets/image/content/ad-banner.png"
        alt="Banner"
      />
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.ad-banner {
  &__wrapper {
    max-width: 255px;
    max-height: 338px;
    height: 100%;
    margin-top: 12px;
  }
  &__img {
    border-radius: 16px;
    width: 100%;
    object-fit: cover;
  }
}
</style>
