<template>
  <section class="register">
    <div class="register__wrapper">
      <img
        class="register__logo"
        src="@/assets/image/logo/sapartime-logo.png"
        alt="Sapartime"
      />

      <h4 class="register__title">Регистрация</h4>

      <form class="register__form">
        <UiInput placeholder="Введите" label="Ваше имя"></UiInput>
        <UiInput
          placeholder="+7 (7__) ___ __ __"
          label="Номер телефона"
        ></UiInput>

        <UiButton
          label="Зарегестрироваться"
          @click="emit('nextStep')"
          class="register__btn"
        ></UiButton>
      </form>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits(["nextStep"]);
</script>

<style lang="scss" scoped>
.register {
  &__wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 26px;
    padding: 40px 0 60px 0;
  }
  &__title {
    font-size: 32px;
    font-weight: 700;
    margin: 16px 0;
  }
  &__form {
    max-width: 352px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  &__btn {
    background-color: $blue-500;
    display: flex;
    justify-content: center;
    color: $white;
    padding: 8px 0;
  }
}
</style>
