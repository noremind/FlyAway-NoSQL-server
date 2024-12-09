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
          class="banner__btn"
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
    max-height: 765px;
    // height: 765px;
    height: clamp(26.875rem, 20.893rem + 29.91vw, 47.813rem);
  }
  &__img-wrapper {
    max-width: 1240px;
    width: 100%;
    position: absolute;
    top: 0;
    z-index: 2;
    border-radius: 16px;
    overflow: hidden;
  }
  &__img {
    object-fit: cover;
    width: 100%;
    // max-height: 756px;
    filter: brightness(40%);
    pointer-events: none;
  }
  &__content {
    position: relative;
    z-index: 3;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 26px;
  }
  &__title {
    font-size: clamp(3.5rem, 2rem + 7.5vw, 8.75rem); //140
    font-family: "Miama Nueva", sans-serif;
    text-align: center;
    color: $blue-400;
    font-style: italic;
  }
  &__description {
    font-size: 20px;
    font-weight: 300;
    text-align: center;
    color: $white;
  }
  &__btn {
    color: $blue-400;
    font-size: 14px;
    border: 1px solid $blue-400;
    width: 150px;
    background-color: transparent;
    display: flex;
    justify-content: center;
  }
}
</style>
