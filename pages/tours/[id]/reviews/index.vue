<template>
  <section class="reviews">
    <div class="reviews__wrapper">
      <UiGoBack label="Однодневный тур на Кольсай"></UiGoBack>

      <h1 class="reviews__title title">Все отзывы путешественников</h1>

      <div class="reviews__rating">
        <p class="reviews__count">20 отзывов</p>
        <UiIcons icon="star" color="yellow-500" size="size-14"></UiIcons>
        <p class="reviews__average">4,1</p>
      </div>

      <div class="reviews__blocks">
        <TheCommonReview
          v-for="review in 6"
          :key="review"
          type="single"
        ></TheCommonReview>
      </div>

      <UiPagination class="reviews__pagination"></UiPagination>
    </div>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
.reviews {
  &__wrapper {
    margin: 36px 0;
  }
  &__title {
    margin-top: 40px;
  }
  &__rating {
    display: flex;
    gap: 4px;
    align-items: center;
    margin-top: 12px;
  }
  &__count {
    font-size: 14px;
    color: $surface-400;
    font-weight: 400;
  }
  &__average {
    font-weight: 400;
    color: $surface-900;
    font-size: 14px;
  }
  &__blocks {
    margin: 12px 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  &__pagination {
    margin: 0 auto;
  }
}
</style>
