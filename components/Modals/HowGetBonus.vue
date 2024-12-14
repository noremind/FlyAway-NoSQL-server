<template>
  <section class="bonus">
    <div class="bonus__wrapper">
      <img
        class="bonus__logo"
        src="@/assets/image/logo/sapartime-logo.png"
        alt="Sapartime"
      />

      <h3 class="bonus__title title">Приглашайте друзей, получайте бонусы</h3>

      <div class="bonus__box">
        <div class="bonus__card">
          <p class="bonus__text">Вы получите</p>
          <p class="bonus__summa">+ 1 000 бонусов</p>
          <p class="bonus__info">за одного приглашенного друга</p>
        </div>
        <div class="bonus__card">
          <p class="bonus__text">Вы получите</p>
          <p class="bonus__summa">+ 1 000 бонусов</p>
          <p class="bonus__info">за одного приглашенного друга</p>
        </div>
      </div>

      <UiButton
        label="Поделиться с друзьями ссылкой"
        class="bonus__btn"
        before-icon="copy"
        icon-color="white"
        icon-size="size-20"
      ></UiButton>
    </div>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
.bonus {
  &__wrapper {
    max-width: 700px;
    width: 100%;
    display: flex;
    flex-direction: column;
    // justify-content: center;
    gap: 20px;
    margin: 0 auto;
    padding: 30px 10px;
  }
  &__logo {
    margin-bottom: 40px;
    max-width: 180px;
    width: 100%;
    margin: 0 auto;
    padding-bottom: 40px;
  }
  &__title {
    text-align: center;
    max-width: 400px;
    width: 100%;
    margin: 0 auto;
  }
  &__text {
    color: $surface-900;
    font-size: 14px;
    font-weight: 700;
  }
  &__summa {
    color: $blue-500;
    font-size: 20px;
    font-weight: 700;
  }
  &__info {
    font-size: 14px;
    font-weight: 100;
    color: $surface-900;
  }
  &__btn {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 10px;
    color: $white;
    background-color: $blue-500;
    font-weight: 400;
    margin-top: 16px;
  }
  &__box {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: center;
  }
  &__card {
    border: 1px solid $surface-300;
    padding: 10px;
    border-radius: 16px;
    max-width: 340px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
}
</style>
