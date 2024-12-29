<template>
  <section class="payment">
    <div class="payment__wrapper">
      <h3 class="payment__title title">Платежи</h3>
      <p class="payment__description">Однодевный тур на Кольсай</p>

      <table class="payment__table">
        <tbody>
          <tr class="payment__tr">
            <td class="payment__td">Дата</td>
            <td class="payment__td">25 декабря 2024</td>
          </tr>
          <tr class="payment__tr payment__tr--blue">
            <td>Ваши билеты</td>
          </tr>
          <tr class="payment__tr">
            <td class="payment__td">Однодневный тур в озеро Кольсай</td>
            <td class="payment__td">1 билет х 15 000 ₸</td>
          </tr>
          <tr class="payment__tr">
            <td class="payment__td">Однодневный тур на Чарынский каньон</td>
            <td class="payment__td">2 билета х 8 000 ₸</td>
          </tr>
          <tr class="payment__tr payment__tr--padding">
            <td class="payment__td payment__td--bold">Скидка</td>
            <td class="payment__td">-20%</td>
          </tr>
          <tr class="payment__tr">
            <td class="payment__td payment__td--bold">Промокод</td>
            <td class="payment__td">0 ₸</td>
          </tr>
          <tr class="payment__tr payment__tr--padding">
            <td class="payment__td payment__td--bold">Итого</td>
            <td class="payment__td">24 800 ₸</td>
          </tr>
          <tr class="payment__tr payment__tr--blue">
            <td>Способ оплаты</td>
          </tr>
          <tr class="payment__tr">
            <td class="payment__td payment__td--box">
              <UiCheckbox
                type="checkmark"
                label="Банковская карта"
              ></UiCheckbox>
            </td>
            <td class="payment__td"></td>
          </tr>
          <tr class="payment__tr">
            <td class="payment__td payment__td--box">
              <UiCheckbox
                type="checkmark"
                label="Рассрочка на 3 месяца"
              ></UiCheckbox>
              <img src="@/assets/icons/freedom-bank.svg" alt="Freedom Bank" />
            </td>
            <td class="payment__td"></td>
          </tr>
        </tbody>
      </table>

      <UiButton
        @click="emit('payed')"
        class="payment__btn"
        label="Оплатить"
      ></UiButton>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits(["payed"]);
</script>

<style lang="scss" scoped>
.payment {
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
    display: flex;
    justify-content: center;
    padding: 10px;
    background-color: $blue-500;
    color: $white;
    font-weight: 700;
  }

  &__table {
    color: $surface-900;
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
      color: $blue-500;
      font-weight: 400;
      & td {
        padding-top: 16px;
      }
    }
  }
}
</style>
