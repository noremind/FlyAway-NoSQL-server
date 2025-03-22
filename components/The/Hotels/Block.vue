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
            <swiper-slide v-for="slider in hotel.images">
              <img class="block__img" :src="slider" alt="Кольсай" />
            </swiper-slide>
          </UiSwiper>
        </div>
        <button class="block__price block__price--mobile">
          66 750 ₸ <span class="block__old-price">89 000 ₸</span>
        </button>
      </div>

      <div class="block__content">
        <div class="block__content-top">
          <img
            class="block__avatar"
            :src="hotel?.partner?.logo"
            alt="Avatar"
            :class="{ 'block__avatar--laptop': viewType === 'tablet' }"
          />

          <div class="block__reviews">
            <p class="block__count">{{ hotel.reviews }} отзывов</p>
            <UiIcons icon="star" color="yellow-500" size="size-14"></UiIcons>
            <p class="block__average">{{ hotel.rating }}</p>
          </div>
        </div>

        <div
          class="block__tags"
          :class="{
            'block__tags--laptop': viewType === 'tablet',
            'block__tags--hide': viewType === 'list',
          }"
        >
          <p
            class="block__discount"
            :class="{ 'block__discount--order': viewType === 'tablet' }"
          >
            -25%
          </p>

          <div
            class="block__location"
            :class="{ 'block__location--order': viewType === 'tablet' }"
          >
            <UiIcons icon="location" size="size-20"></UiIcons>
            <p class="block__region">{{ hotel.city }}</p>
          </div>
        </div>

        <div class="block__box">
          <div class="block__texts">
            <nuxt-link :to="`/hotels/${hotel.id}`">
              <h2 class="block__title">{{ hotel.name }}</h2>
            </nuxt-link>
            <div
              class="block__ratings"
              :class="{ 'block__ratings--laptop': viewType === 'tablet' }"
            >
              <UiIcons
                v-for="star in 5"
                icon="star"
                color="yellow-500"
                size="size-20"
              ></UiIcons>
            </div>
            <p class="block__description">
              {{ hotel.description }}
              <span class="block__more">еще...</span>
            </p>

            <UiButton
              v-if="viewType === 'list'"
              class="block__btn block__btn--mobile button-secondary"
              label="Забронировать"
            ></UiButton>

            <div
              class="block__tags"
              :class="{ 'block__tags--mobile': viewType === 'tablet' }"
            >
              <p class="block__discount">-25%</p>

              <div class="block__location">
                <UiIcons icon="location" size="size-20"></UiIcons>
                <p class="block__region">{{ hotel.city }}</p>
              </div>
            </div>
          </div>

          <div class="block__benefits">
            <ul class="block__list">
              <li class="block__list-item">
                <UiIcons icon="check" color="red-500" size="size-20"></UiIcons>
                <p class="block__benefits-text">Одноместный номер в Лоло</p>
              </li>
              <li class="block__list-item">
                <UiIcons icon="check" color="red-500" size="size-20"></UiIcons>
                <p class="block__benefits-text">Одноместный номер в Лоло</p>
              </li>
              <li class="block__list-item">
                <UiIcons icon="check" color="red-500" size="size-20"></UiIcons>
                <p class="block__benefits-text">Одноместный номер в Лоло</p>
              </li>
            </ul>

            <button class="block__price">
              66 750 ₸ <span class="block__old-price">89 000 ₸</span>
            </button>

            <div>
              <UiButton
                label="Забронировать"
                class="block__btn button-primary"
              ></UiButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  viewType: {
    type: String,
    default: "list",
  },
  hotel: {
    type: Object,
    default: () => {},
  },
});
</script>

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
  &__region {
    font-size: 12.5px;
    color: $surface-400;
  }
  &__more {
    color: $red-500;
    font-weight: 400;
    font-size: 14px;
    cursor: pointer;
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
    &--laptop {
      display: block;
    }
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
  &__ratings {
    &--laptop {
      display: flex;
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
    &--laptop {
      display: none;
    }
    &--hide {
      display: none;
    }
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
  &__price {
    background-color: $red-500;
    padding: 8px 12px;
    border-radius: 24px;
    color: $white;
    font-size: 20px;
    font-weight: 600;
    &--mobile {
      display: none;
    }
  }
  &__old-price {
    font-size: 14px;
    color: $surface-900;
    text-decoration: line-through;
  }
  &__btn {
    &--mobile {
      display: none;
    }
  }
}

.block__swiper :deep(.custom-swiper::part(pagination)) {
  position: absolute !important;
}

@media (max-width: 375px) {
  .block {
    &__wrapper {
      display: flex;
      height: 100%;
      flex-direction: column;
      position: relative;
    }
    &__preview {
      position: relative;
      height: 140px;
      max-width: 100%;
    }
    &__ratings {
      &--laptop {
        display: none;
      }
    }
    &__img {
      max-width: 100%;
      height: 140px;
    }
    &__benefits {
      display: none;
    }
    &__texts {
      gap: 12px;
    }
    &__avatar {
      &--laptop {
        display: none;
      }
    }
    &__content {
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    &__tags {
      display: flex;
      justify-content: space-between;
      &--laptop {
        display: flex;
      }
      &--mobile {
        display: none;
      }
      &--hide {
        display: none;
      }
    }
    &__discount {
      order: 2;
      &--order {
        order: 1;
      }
    }
    &__location {
      order: 1;
      &--order {
        order: 2;
      }
    }
    &__btn {
      display: none;
      &--mobile {
        display: flex;
      }
    }
    &__price {
      &--mobile {
        position: absolute;
        bottom: 8px;
        z-index: 2;
        display: flex;
        gap: 4px;
      }
    }
  }
}
</style>
