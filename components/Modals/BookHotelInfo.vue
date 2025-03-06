<template>
  <section class="info">
    <div class="info__wrapper">
      <img
        class="info__logo"
        src="@/assets/image/logo/FlyAway-logo.png"
        alt="FlyAway"
      />

      <h4 class="info__title">Заполните поля</h4>
      <p class="info__description">Заполните поля, чтобы забронировать номер</p>

      <form class="info__form">
        <UiInput placeholder="Введите" label="Ваше имя"></UiInput>
        <UiInput
          placeholder="+7 (7__) ___ __ __"
          label="Номер телефона"
        ></UiInput>

        <UiButton
          label="Отправить"
          @click="emit('nextStep')"
          class="info__btn button-primary"
        ></UiButton>
      </form>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits(["nextStep"]);
</script>

<style lang="scss" scoped>
.info {
  &__wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 26px;
    padding: 40px 0 60px 0;
    color: $surface-900;
  }
  &__title {
    font-size: 32px;
    font-weight: 700;
    margin: 16px 0;
  }
  &__decription {
    font-weight: 400;
  }
  &__form {
    max-width: 352px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  &__logo {
    width: 64px;
  }
}
</style>
