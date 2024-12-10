<template>
  <section class="review">
    <div class="review__wrapper">
      <div class="review__inner">
        <div class="review__header">
          <div class="review__header-box">
            <img
              class="review__avatar"
              src="@/assets/image/common/avatar-user.jpeg"
              alt="Avatar"
            />
            <div class="review__header-inner">
              <p class="review__name">Дана Дайланова</p>
              <span class="review__date">сегодня в 12:00</span>
            </div>
          </div>
          <div class="review__stars">
            <UiIcons
              v-for="star in 5"
              :key="star"
              icon="star"
              size="size-14"
              color="yellow-500"
            ></UiIcons>
          </div>
        </div>

        <p class="review__comment">
          "Недавно вернулись из потрясающего путешествия на Кольсайские озера, и
          эмоции до сих пор переполняют! 🌲🏞️ Это место, где природа словно
          сошла с открытки — кристально чистые озера, окруженные величественными
          горами и густыми хвойными лесами. Маршрут был отлично продуман: нам
          удалось увидеть все три озера, и каждое из них по-своему уникально.
          Особенно понравилось второе озеро — дорога к нему немного
          <span class="review__more">...еще</span>
        </p>
      </div>

      <div class="review__footer">
        <div class="review__footer-box">
          <img
            class="review__avatar review__avatar--small"
            src="@/assets/image/common/tour-avatar.png"
            alt="Avatar"
          />
          <p class="review__name review__name--small">Mili Tour</p>
        </div>
        <p class="review__info">Поход в горы 2 дня</p>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
.review {
  &__wrapper {
    background-color: $white;
    padding: 16px;
    border-radius: 16px;
    border: 0.5px solid $surface-300;
    // height: 315px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    max-width: 480px;
    min-width: 327px;
  }
  &__header {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    &-box {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
  &__avatar {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 50%;
    &--small {
      width: 24px;
      height: 24px;
    }
  }
  &__date {
    font-size: 12px;
    color: $surface-400;
    font-weight: 400;
  }
  &__name {
    color: $surface-900;
    font-weight: 400;
    &--small {
      font-size: 14px;
    }
  }
  &__comment {
    font-size: 14px;
    font-weight: 100;
    color: $surface-900;
    padding: 16px 0;
  }
  &__more {
    color: $blue-500;
    font-weight: 100;
    font-size: 14px;
    cursor: pointer;
  }
  &__footer {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    &-box {
      display: flex;
      gap: 8px;
      align-items: center;
    }
  }
  &__info {
    color: $blue-500;
    font-weight: 700;
    line-height: 17.5px;
    font-size: 14px;
    cursor: pointer;
  }
}
</style>
