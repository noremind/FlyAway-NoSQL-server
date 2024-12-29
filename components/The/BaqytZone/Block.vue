<template>
  <section class="baqyt-block">
    <div class="baqyt-block__wrapper">
      <img
        class="baqyt-block__img"
        src="@/assets/image/content/tour-card.png"
        alt=""
      />
      <div class="baqyt-block__header">
        <div class="baqyt-block__header-box">
          <span class="baqyt-block__icon">
            <UiIcons icon="hot" color="orange-200" size="size-14"></UiIcons>
          </span>
          <UiIcons icon="heart-fill" color="white" size="size-24"></UiIcons>
        </div>
        <div>
          <div class="baqyt-block__price-box">
            <p class="baqyt-block__new-price">66 750 ₸</p>
            <p class="baqyt-block__old-price"><s>89 000 ₸</s></p>
          </div>
        </div>
      </div>

      <div class="baqyt-block__info">
        <div class="baqyt-block__info-box">
          <img
            class="baqyt-block__avatar"
            src="@/assets/image/common/tour-avatar.png"
            alt=""
          />
          <p class="baqyt-block__author">Mili Tour</p>
        </div>

        <div class="baqyt-block__reviews">
          <p class="baqyt-block__reviews-count">20 отзывов</p>
          <UiIcons icon="star" color="yellow-500" size="size-14"></UiIcons>
          <p class="baqyt-block__reviews-average">4,1</p>
        </div>
      </div>
      <div class="baqyt-block__content">
        <h3 class="baqyt-block__title">
          <nuxt-link class="baqyt-block__link" to="/baqyt-zone/1"
            >2 дня 1 ночь в горах</nuxt-link
          >
        </h3>
        <p class="baqyt-block__description">
          Погрузитесь в природу Казахстана посетив озеро Кольсай.
        </p>

        <div>
          <p class="baqyt-block__discount">-25%</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style scoped lang="scss">
.baqyt-block {
  &__wrapper {
    position: relative;
    padding: 0 16px 16px 16px;
    border-radius: 16px;
    max-width: 292px;
    width: 100%;
    background-color: $white;
    box-shadow: 0px 0px 20px 0px #0000001a;
  }
  &__header {
    position: relative;
    width: 100%;
    height: 138px;
    padding: 16px 0 16px 0;
    display: inline-flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
    &-box {
      display: flex;
      width: 100%;
      justify-content: space-between;
      gap: 6px;
      align-items: center;
    }
  }
  &__img {
    position: absolute;
    // top: 0;
    left: 0;
    object-fit: cover;
    cursor: pointer;
    width: 100%;
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
  &__link {
    color: inherit;
  }
  &__discount {
    padding: 4px 8px;
    border-radius: 16px;
    background-color: $orange-200;
    color: $white;
    display: inline;
    font-size: 14px;
    font-weight: 400;
    &--new {
      background-color: $green-400;
    }
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
    position: relative;
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

  &__text {
    font-size: 12px;
    color: $surface-400;
  }
  &__count {
    font-size: 14px;
    color: $blue-500;
    font-weight: 700;
  }
}

@media (max-width: 768px) {
  .baqyt-block {
    &__wrapper {
      max-width: 327px;
    }
    &__info {
      margin-top: 12px;
    }
  }
}
</style>
