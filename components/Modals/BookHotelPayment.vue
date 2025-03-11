<template>
  <section class="book">
    <div class="book__wrapper">
      <h3 class="book__title title">Подтвердите бронирование</h3>
      <p class="book__description">Business po kazakhsky</p>

      <div class="book__message">
        <UiIcons icon="circle-check" color="red-500" size="size-20"></UiIcons>
        <p class="book__message-text">Вы выбрали премиум номер</p>
      </div>

      <table class="book__table">
        <tbody>
          <tr class="book__tr">
            <td class="book__td">Дата от</td>
            <td class="book__td">25 декабря 2024</td>
          </tr>
          <tr class="book__tr">
            <td class="book__td">Дата до</td>
            <td class="book__td">26 декабря 2024</td>
          </tr>
          <tr class="book__tr book__tr--padding">
            <td class="book__td">Премиум</td>
            <td class="book__td">3 дня х 20 000 ₸</td>
          </tr>
          <tr class="book__tr book__tr--padding">
            <td class="book__td book__td--bold">Скидка</td>
            <td class="book__td">-20%</td>
          </tr>
          <tr class="book__tr">
            <td class="book__td book__td--bold">Промокод</td>
            <td class="book__td">0 ₸</td>
          </tr>
          <tr class="book__tr book__tr--padding">
            <td class="book__td book__td--bold">Итого</td>
            <td class="book__td">24 800 ₸</td>
          </tr>
        </tbody>
      </table>

      <UiButton
        @click="emit('nextStep')"
        class="book__btn button-primary"
        label="Оплатить"
      ></UiButton>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits(["nextStep"]);
</script>

<style lang="scss" scoped>
.book {
  &__wrapper {
    margin: 40px 26px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    justify-content: center;
    align-items: center;
    color: $surface-900;
  }
  &__title {
    margin-bottom: 16px;
  }
  &__description {
    font-size: 20px;
    font-weight: 700;
  }
  &__btn {
    width: 90%;
    margin-top: 12px;
    font-weight: 700;
  }
  &__message {
    display: flex;
    gap: 8px;
    align-items: center;
    &-text {
      color: $red-500;
      font-size: 16px;
      font-weight: 400;
    }
  }

  &__table {
    color: $surface-900;
    width: 90%;
  }
  &__tr &__td:last-child {
    text-align: right;
    font-weight: 400;
  }
  &__td {
    font-weight: 100;
    padding-top: 4px;
    &--bold {
      font-weight: 400;
    }
    &--box {
      display: flex;
      gap: 4px;
      align-items: center;
    }
  }
  &__tr {
    &--padding td {
      padding-top: 24px;
    }
    &--blue {
      color: $red-500;
      font-weight: 400;
      & td {
        padding-top: 16px;
      }
    }
  }
}
</style>
