<template>
  <section class="tour">
    <div class="tour__wrapper">
      <img
        class="tour__img"
        src="@/assets/image/content/tour-card.png"
        alt=""
      />
      <div class="tour__header">
        <span class="tour__icon">
          <UiIcons icon="hot" color="orange-200" size="size-14"></UiIcons>
        </span>
        <div class="tour__price-box">
          <p class="tour__new-price">66 750 ₸</p>
          <p class="tour__old-price"><s>89 000 ₸</s></p>
        </div>
      </div>

      <div class="tour__info">
        <div class="tour__info-box">
          <img
            class="tour__avatar"
            src="@/assets/image/common/tour-avatar.png"
            alt=""
          />
          <p class="tour__author">Mili Tour</p>
        </div>

        <div class="tour__reviews">
          <p class="tour__reviews-count">20 отзывов</p>
          <UiIcons icon="star" color="yellow-500" size="size-14"></UiIcons>
          <p class="tour__reviews-average">4,1</p>
        </div>
      </div>
      <div class="tour__content">
        <h3 class="tour__title">Кольсай</h3>
        <p class="tour__description">
          Погрузитесь в природу Казахстана посетив озеро Кольсай.
        </p>
        <div class="tour__box">
          <p class="tour__text">Осталось</p>
          <span class="tour__count">3 места</span>
        </div>
        <div class="tour__inner">
          <p class="tour__date">20-24 ноября 2024</p>
          <span class="tour__discount">-25%</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style scoped lang="scss">
.tour {
  &__wrapper {
    position: relative;
    padding: 16px;
    border-radius: 16px;
    max-width: 292px;
    width: 100%;
    background-color: $white;
  }
  &__header {
    position: relative;
    height: 138px;
    padding: 0 0 24px 0;
    display: inline-flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
  }
  &__img {
    position: absolute;
    top: 0;
    left: 0;
    object-fit: cover;
    cursor: pointer;
  }
  &__icon {
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 28px;
    height: 28px;
  }
  &__price-box {
    display: inline-flex;
    gap: 6px;
    background-color: $blue-500;
    padding: 8px 12px;
    border-radius: 26px;
    font-weight: 400;
  }
  &__new-price {
    color: $white;
  }
  &__old-price {
    color: $surface-900;
    font-size: 14px;
    margin-top: 5px;
  }
  &__info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    &-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }
  }
  &__author {
    font-size: 14px;
    font-weight: 400;
  }
  &__reviews {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 4px;
    &-count {
      font-size: 10px;
      color: $surface-400;
    }
    &-average {
      font-size: 10px;
    }
  }
  &__avatar {
    border-radius: 50%;
    width: 32px;
    height: 32px;
  }
  &__content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  &__title {
    font-size: 24px;
    font-weight: 700;
    color: $surface-900;
    cursor: pointer;
  }
  &__description {
    font-size: 14px;
    color: $surface-900;
  }
  &__inner {
    display: flex;
    gap: 4px;
    align-items: center;
    justify-content: space-between;
  }
  &__box {
    display: flex;
    gap: 4px;
    align-items: center;
  }
  &__text {
    font-size: 12px;
    color: $surface-400;
  }
  &__count {
    font-size: 14px;
    color: $blue-500;
    font-weight: 700;
  }
  &__date {
    font-size: 14px;
    font-weight: 400;
    color: $surface-900;
  }
  &__discount {
    padding: 8px 16px;
    border-radius: 26px;
    color: $white;
    font-size: 14px;
    background-color: $orange-200;
    font-weight: 400;
  }
}
</style>
