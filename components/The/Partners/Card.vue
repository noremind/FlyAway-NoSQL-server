<template>
  <section class="card">
    <div class="card__wrapper">
      <img class="card__avatar" :src="partner?.logo" :alt="partner?.name" />
      <div class="card__box">
        <nuxt-link to="/partners/1">
          <h2 class="card__author">{{ partner?.name }}</h2>
        </nuxt-link>
        <div class="card__reviews card__reviews--laptop">
          <p class="card__count">{{ partner?.reviews_count }} отзывов</p>
          <UiIcons icon="star" color="yellow-500" size="size-14"></UiIcons>
          <p class="card__average">{{ partner?.rating }}</p>
        </div>
        <ul class="card__list card__list--mobile">
          <li class="card__list-item">
            <p class="card__text">Количество туров</p>
            <p class="card__number">{{ partner?.tours_count }}</p>
          </li>
          <li class="card__list-item">
            <p class="card__text">Количество отелей</p>
            <p class="card__number">{{ partner?.hotels_count }}</p>
          </li>
          <li class="card__list-item">
            <p class="card__text">Количество активностей</p>
            <p class="card__number">3</p>
          </li>
        </ul>
      </div>
      <ul class="card__list card__list--laptop">
        <li class="card__list-item">
          <p class="card__text">Количество туров</p>
          <p class="card__number">{{ partner?.tours_count }}</p>
        </li>
        <li class="card__list-item">
          <p class="card__text">Количество отелей</p>
          <p class="card__number">{{ partner?.hotels_count }}</p>
        </li>
        <li class="card__list-item">
          <p class="card__text">Количество активностей</p>
          <p class="card__number">3</p>
        </li>
      </ul>

      <div class="card__reviews card__reviews--mobile">
        <p class="card__count">{{ partner?.reviews_count }} отзывов</p>
        <UiIcons icon="star" color="yellow-500" size="size-14"></UiIcons>
        <p class="card__average">{{ partner?.rating }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  partner: {
    type: Object,
    defautl: () => {},
  },
});
</script>

<style lang="scss" scoped>
.card {
  &__wrapper {
    background-color: $white;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
    padding: 36px 16px;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    color: $surface-900;
  }
  &__avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    margin: 0 auto;
  }
  &__author {
    font-size: 24px;
    font-weight: 700;
    margin: 0 auto;
    color: $surface-900;
  }
  &__reviews {
    display: flex;
    gap: 4px;
    align-items: center;
    margin: 0 auto;
    &--mobile {
      display: none;
    }
  }
  &__count {
    font-size: 12.5px;
    color: $surface-400;
  }
  &__average {
    font-size: 12.5px;
    font-weight: 400;
  }
  &__list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    &--mobile {
      display: none;
    }
    &-item {
      display: flex;
      gap: 4px;
      align-items: center;
    }
  }
  &__text {
    font-size: 12px;
    color: $surface-400;
  }
  &__number {
    color: $blue-500;
    font-weight: 400;
    font-size: 14px;
  }
  &__box {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

@media (max-width: 375px) {
  .card {
    &__wrapper {
      display: flex;
      flex-direction: row;
      padding: 6px;
      gap: 6px;
    }
    &__avatar {
      margin: auto;
    }
    &__author {
      font-size: 16px;
      margin: 0;
    }
    &__reviews {
      white-space: nowrap;

      &--laptop {
        display: none;
      }
      &--mobile {
        display: flex;
        align-items: flex-start;
      }
    }
    &__list {
      font-size: 10px;
      gap: 2px;
      &-item {
        white-space: nowrap;
      }
      &--mobile {
        display: flex;
      }
      &--laptop {
        display: none;
      }
    }
  }
}
</style>
