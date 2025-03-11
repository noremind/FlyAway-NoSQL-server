<template>
  <section class="ticket">
    <div class="ticket__wrapper">
      <div class="ticket__info">
        <p class="ticket__number">Билет №12345</p>
        <div class="ticket__title-box">
          <nuxt-link to="/profile/my-hotels/1">
            <h2 class="ticket__title title">Звездный Комфорт</h2>
          </nuxt-link>
          <UiIcons
            icon="star"
            color="yellow-500"
            size="size-14"
            v-for="star in 5"
          ></UiIcons>
        </div>
        <div class="ticket__info-box">
          <p class="ticket__date">Дата</p>
          <p class="ticket__day">25 декабря 2024</p>
        </div>
        <div class="ticket__info-box">
          <p class="ticket__date ticket__date--mobile ticket__date--bold">
            Сумма
          </p>
          <p class="ticket__price ticket__price--mobile ticket__price--mobile">
            24 800 ₸
          </p>
        </div>
      </div>
      <div class="ticket__total">
        <p class="ticket__total-text">Итого</p>
        <p class="ticket__price">24 800 ₸</p>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
.ticket {
  width: 100%;
  border-radius: 16px;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
  padding: 16px;
  border-right: 40px solid $red-500;
  &--nonactive {
    border-right: 40px solid $surface-400;
  }
  &__wrapper {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    width: 90%;
  }
  &__title {
    font-size: 24px;
  }
  &__number {
    color: $surface-900;
    font-weight: 400;
  }
  &__date {
    &--mobile {
      display: none;
    }
    &--bold {
      font-weight: 400;
      font-size: 12px;
    }
  }
  &__info {
    max-width: 500px;
    width: 100%;
  }
  &__info-box {
    max-width: 350px;
    width: 100%;
    display: flex;
    color: $surface-900;
    justify-content: space-between;
    margin-top: 8px;
  }
  &__total {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    &-text {
      font-size: 14px;
      color: $surface-900;
      font-weight: 400;
    }
  }
  &__price {
    color: $red-500;
    font-size: 24px;
    font-weight: 700;
    &--mobile {
      display: none;
      font-size: 14px;
    }
  }
}

@media (max-width: 375px) {
  .ticket {
    border-right: 20px solid $red-500;
    font-size: 12px;
    &__total {
      display: none;
    }
    &__title {
      font-size: 14px;
      line-height: 28px;
    }
    &__price {
      &--mobile {
        display: block;
      }
    }
    &__date {
      &--mobile {
        display: block;
      }
    }
  }
}
</style>
