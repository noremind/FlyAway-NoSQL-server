<template>
  <section class="banner">
    <div class="banner__wrapper">
      <div class="banner__img-wrapper">
        <img
          class="banner__img"
          src="@/assets/image/content/main-image.png"
          alt="Кольсай"
        />
      </div>

      <div class="banner__content">
        <h1 class="banner__title">Кольсай</h1>
        <p class="banner__description">
          Погружение в Природную Красоту Казахстана
        </p>

        <UiButton
          class="banner__btn button-secondary"
          afterIcon="arrow"
          iconColor="blue-400"
          label="подробнее"
          iconSize="size-26"
        ></UiButton>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
.banner {
  &__wrapper {
    position: relative;
    margin: 36px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: clamp(20.438rem, 10.916rem + 47.61vw, 47.813rem);
  }
  &__img-wrapper {
    max-width: 1240px;
    width: 100%;
    position: absolute;
    top: 0;
    border-radius: 16px;
    overflow: hidden;
    padding: 12px 0px;
  }
  &__img {
    object-fit: cover;
    width: 100%;
    filter: brightness(40%);
    pointer-events: none;
    border-radius: 16px;
  }
  &__content {
    position: relative;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 26px;
    padding: 16px;
  }
  &__title {
    font-size: clamp(2rem, -0.348rem + 11.74vw, 8.75rem); //140
    font-family: "Miama Nueva", sans-serif;
    text-align: center;
    color: $blue-400;
    font-style: italic;
  }
  &__description {
    // font-size: 20px;
    font-size: clamp(0.875rem, 0.745rem + 0.65vw, 1.25rem);
    font-weight: 300;
    text-align: center;
    color: $white;
  }
  &__btn {
    width: 150px;
  }
}

@media (max-width: 768px) {
  .banner {
    &__wrapper {
      display: block;
      height: auto;
    }
    &__img {
      border-radius: 20px;
      height: clamp(20.438rem, -24.105rem + 92.8vw, 47.813rem);
      &-wrapper {
        z-index: 2;
      }
    }
    &__content {
      z-index: 3;
    }
    &__title {
      margin-top: 64px;
    }
  }
}
</style>
