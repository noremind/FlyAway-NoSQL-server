<template>
  <div class="status">
    <div class="status__wrapper">
      <img
        class="status__logo"
        src="@/assets/image/logo/sapartime-logo.png"
        alt="Sapartime"
      />

      <img
        class="status__img status__img--success"
        src="@/assets/image/common/success.png"
        alt="Success"
      />

      <h4 class="status__title">Вы зарегестрированы</h4>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.status {
  &__wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    margin: 40px 0 60px 0;
  }
  &__title {
    color: $blue-500;
    font-size: 32px;
    font-weight: 400;
    text-align: center;
  }
}
</style>
