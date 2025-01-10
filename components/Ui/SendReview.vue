<template>
  <div class="comment">
    <div class="comment__wrapper">
      <div class="comment__rating">
        <p class="comment__text">Поставьте оценку</p>
        <div class="comment__stars">
          <UiIcons
            v-for="star in 5"
            :key="star"
            icon="star"
            size="size-20"
            color="yellow-500"
            class="comment__star"
          ></UiIcons>
        </div>
      </div>

      <div class="comment__field">
        <p class="comment__text">Напишите отзыв</p>
        <textarea
          class="comment__textarea"
          rows=""
          cols=""
          placeholder="Напишите отзыв"
        ></textarea>
      </div>

      <UiButton
        class="comment__btn button-primary"
        label="Оставить отзыв"
      ></UiButton>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.comment {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  &__text {
    color: $blue-500;
    font-weight: 400;
  }
  &__stars {
    display: flex;
    gap: 4px;
    align-items: center;
  }
  &__star {
    cursor: pointer;
  }
  &__rating,
  &__field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  &__textarea {
    height: 220px;
    border: 1px solid $surface-300;
    border-radius: 24px;
    padding: 16px;
  }
  &__btn {
  }
}
</style>
