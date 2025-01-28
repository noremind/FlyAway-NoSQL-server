<template>
  <section class="tour">
    <div class="tour__wrapper">
      <img
        class="tour__img"
        src="@/assets/image/content/tour-card.png"
        alt=""
      />
      <div class="tour__header">
        <div class="tour__header-box">
          <span class="tour__icon">
            <UiIcons icon="hot" color="orange-200" size="size-14"></UiIcons>
          </span>
          <UiIcons icon="heart-fill" color="white" size="size-24"></UiIcons>
        </div>
        <div>
          <div class="tour__price-box">
            <p class="tour__new-price">{{ tour.min_price }} ₸</p>
            <p class="tour__old-price"><s>89 000 ₸</s></p>
          </div>
        </div>
      </div>

      <div class="tour__info">
        <div class="tour__info-box" v-if="viewType === 'tablet'">
          <img class="tour__avatar" :src="tour.partner?.logo" alt="" />
          <p class="tour__author">{{ tour.partner?.name }}</p>
        </div>

        <div class="tour__reviews">
          <p class="tour__reviews-count">20 отзывов</p>
          <UiIcons icon="star" color="yellow-500" size="size-14"></UiIcons>
          <p class="tour__reviews-average">{{ tour?.rating }}</p>
        </div>
      </div>
      <span
        v-if="viewType === 'tablet'"
        class="tour__discount tour__discount--new tour__discount--mobile"
        >Новинка</span
      >
      <div class="tour__content">
        <h3 class="tour__title">
          <nuxt-link class="tour__link" to="/tours/1">{{
            tour?.name
          }}</nuxt-link>
        </h3>
        <p class="tour__description">
          {{ tour?.description_mini }}
        </p>
        <div class="tour__box">
          <p class="tour__text">Осталось</p>
          <span class="tour__count">{{ tour.ticket_count }} места</span>
        </div>
        <div class="tour__inner">
          <div class="tour__inner-box">
            <p class="tour__date">24 декабря</p>
            <span @click="toggleDropdown" class="tour__date-plus">+5 дат</span>
            <div v-if="isOpenDropdown" class="tour__date-dropdown">
              <ul class="tour__date-list">
                <li class="tour__date-item">24 декабря</li>
                <li class="tour__date-item">24 декабря</li>
                <li class="tour__date-item">24 декабря</li>
              </ul>
            </div>
          </div>
          <span
            :class="{ 'tour__discount--show': viewType === 'list' }"
            class="tour__discount tour__discount--new"
            >Новинка</span
          >
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const isOpenDropdown = ref(false);
const props = defineProps({
  tour: {
    type: Object,
    default: () => {},
  },
  viewType: {
    type: String,
    default: "list",
  },
});

const toggleDropdown = () => {
  isOpenDropdown.value = !isOpenDropdown.value;
};
</script>

<style scoped lang="scss">
.tour {
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
    height: 200px;
    justify-content: space-between;
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
    &-box {
      display: flex;
      gap: 6px;
      align-items: center;
    }
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
  &__date-plus {
    padding: 4px 8px;
    background-color: $surface-150;
    white-space: nowrap;
    font-size: 14px;
    border-radius: 16px;
    font-weight: 100;
    color: $surface-900;
    cursor: pointer;
  }
  &__date {
    font-size: 14px;
    font-weight: 400;
    color: $surface-900;
    position: relative;
    &-dropdown {
      position: absolute;
      bottom: 25px;
      left: 62px;
      background-color: $white;
      padding: 4px 8px;
      border-radius: 12px;
      box-shadow: 0px 0px 20px 8px rgba(0, 0, 0, 0.1);
    }
    &__list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      color: $surface-900;
    }
  }
  &__discount {
    padding: 8px 16px;
    border-radius: 26px;
    color: $white;
    font-size: 14px;
    background-color: $orange-200;
    font-weight: 400;
    &--new {
      background-color: $green-400;
      padding: 4px 8px;
    }
    &--mobile {
      display: none;
    }
  }
}

@media (max-width: 768px) {
  .tour {
    &__wrapper {
      max-width: 327px;
    }
    &__info {
      margin-top: 12px;
    }
  }
}

@media (max-width: 375px) {
  .tour {
    &__wrapper {
      padding: 0 6px 6px 6px;
      max-width: 180px;
      height: 100%;
    }
    &__header {
      padding-top: 6px;
      padding-bottom: 6px;
    }
    &__title {
      font-size: 16px;
    }
    &__date-item,
    &__date {
      white-space: nowrap;
    }
    &__img {
      // width: 160px;
      height: 140px;
      max-width: 100%;
      border-radius: 16px;
    }
    &__old-price,
    &__new-price {
      white-space: nowrap;
    }
    &__info {
      margin-top: 12px;
    }
    &__discount {
      display: none;
      &--mobile {
        display: inline-block;
        margin-bottom: 6px;
      }
      &--show {
        display: inline-block;
      }
    }
    &__box {
      display: none;
    }
  }
}
</style>
