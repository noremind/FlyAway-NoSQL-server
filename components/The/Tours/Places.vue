<template>
  <div class="places">
    <div class="places__wrapper">
      <img
        class="places__img"
        src="@/assets/image/content/main-image.png"
        alt="Places"
      />
      <h4 class="places__title">Озеро Кольсай</h4>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.places {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-width: 190px;
    width: 100%;
  }
  &__img {
    width: 100%;
    border-radius: 16px;
  }
  &__title {
    color: $surface-900;
    font-weight: 400;
    text-align: center;
  }
}
</style>
