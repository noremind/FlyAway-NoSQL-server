<template>
  <section class="block">
    <div class="block__wrapper">
      <div class="block__preview">
        <span class="block__icon-hot">
          <UiIcons icon="hot" size="size-20" color="orange-200"></UiIcons>
        </span>
        <UiIcons
          class="block__icon-heart"
          icon="heart"
          size="size-30"
          color="white"
        ></UiIcons>

        <div class="block__swiper">
          <UiSwiper :pagination="{ clickable: true }">
            <swiper-slide v-for="slider in 5">
              <img
                class="block__img"
                src="@/assets/image/content/main-image.png"
                alt="Кольсай"
              />
            </swiper-slide>
          </UiSwiper>
        </div>
      </div>

      <div class="block__content">
        <div class="block__content-top">
          <img
            class="block__avatar"
            src="@/assets/image/common/tour-avatar.png"
            alt="Avatar"
          />

          <div class="block__reviews">
            <p class="block__count">20 отзывов</p>
            <UiIcons icon="star" color="yellow-500" size="size-14"></UiIcons>
            <p class="block__average">4,1</p>
          </div>
        </div>

        <div class="block__box">
          <div class="block__texts">
            <nuxt-link to="/hotels/1">
              <h2 class="block__title">Звездный Комфорт</h2>
            </nuxt-link>
            <div class="block__ratings">
              <UiIcons
                v-for="star in 5"
                icon="star"
                color="yellow-500"
                size="size-20"
              ></UiIcons>
            </div>
            <p class="block__description">
              Погрузитесь в природу Казахстана посетив озеро Кольсай.
              Погрузитесь в природу Казахстана посетив озеро Кольсай.
              Погрузитесь в природу Казахстана посетив озеро Кольсай ...еще
            </p>
            <div class="block__tags">
              <p class="block__discount">-25%</p>

              <div class="block__location">
                <UiIcons icon="location" size="size-20"></UiIcons>
                <p class="block__region">Алматы</p>
              </div>
            </div>
          </div>

          <div class="block__benefits">
            <ul class="block__list">
              <li class="block__list-item">
                <UiIcons icon="check" color="blue-500" size="size-20"></UiIcons>
                <p class="block__benefits-text">Одноместный номер в Лоло</p>
              </li>
              <li class="block__list-item">
                <UiIcons icon="check" color="blue-500" size="size-20"></UiIcons>
                <p class="block__benefits-text">Одноместный номер в Лоло</p>
              </li>
              <li class="block__list-item">
                <UiIcons icon="check" color="blue-500" size="size-20"></UiIcons>
                <p class="block__benefits-text">Одноместный номер в Лоло</p>
              </li>
            </ul>

            <button class="block__price">
              66 750 ₸ <span class="block__old-price">89 000 ₸</span>
            </button>

            <div>
              <UiButton label="Забронировать" class="block__btn"></UiButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
.block {
  &__wrapper {
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
    border-radius: 16px;
    height: 240px;
    display: flex;
    width: 100%;
  }
  &__preview {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 8px;
    max-width: 320px;
    width: 100%;
  }
  &__swiper {
    position: absolute;
    top: 0;
    z-index: 1;
    left: 0;
    width: 100%;
  }
  &__img {
    max-width: 320px;
    width: 100%;
    height: 240px;
    object-fit: cover;
    border-radius: 16px;
  }
  &__icon-hot {
    width: 28px;
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-color: $surface-150;
    position: relative;
    z-index: 2;
  }
  &__icon-heart {
    position: relative;
    z-index: 2;
  }
  &__avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }
  &__content {
    padding: 16px;
    width: 100%;
    &-top {
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }
  }
  &__reviews {
    display: flex;
    gap: 4px;
    align-items: center;
    font-size: 12px;
  }
  &__count {
    font-size: 12px;
    color: $surface-300;
  }
  &__average {
    font-weight: 400;
  }
  &__box {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }
  &__texts {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 4px 0;
    max-width: 346px;
    width: 100%;
  }
  &__title {
    font-size: 24px;
    font-weight: 700;
    color: $surface-900;
  }
  &__description {
    font-size: 14px;
    color: $surface-900;
  }
  &__tags {
    display: flex;
    gap: 12px;
    align-items: center;
    margin: auto 0 0 0;
  }
  &__discount {
    padding: 4px 6px;
    border-radius: 16px;
    background-color: $orange-200;
    // width: 100%;
    font-size: 14px;
    font-weight: 400;
    color: $white;
  }
  &__location {
    display: flex;
    gap: 4px;
    align-items: center;
  }
  &__list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    &-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
  &__benefits {
    display: flex;
    flex-direction: column;
    gap: 4px;
    justify-content: space-between;
    &-text {
      font-size: 10px;
      color: $surface-900;
    }
  }
  &__btn {
    border: 1px solid $blue-500;
    border-radius: 24px;
    padding: 12px 16px;
    display: flex;
    justify-content: center;
    background-color: $white;
    color: $blue-500;
    font-weight: 400;
  }
  &__price {
    background-color: $blue-500;
    padding: 8px 12px;
    border-radius: 24px;
    color: $white;
    font-size: 20px;
    font-weight: 600;
  }
  &__old-price {
    font-size: 14px;
    color: $surface-900;
    text-decoration: line-through;
  }
}

.block__swiper :deep(.custom-swiper::part(pagination)) {
  position: absolute !important;
}
</style>
