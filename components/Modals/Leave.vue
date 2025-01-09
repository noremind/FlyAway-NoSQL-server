<template>
  <div class="leave">
    <div class="leave__wrapper">
      <p class="leave__title">Выйти из аккаунта</p>
      <p class="leave__description">
        Вы уверены, что хотите выйти из аккаунта?
      </p>
      <div class="leave__btns">
        <UiButton
          class="leave__cancel-btn button-primary"
          label="Вернуться"
          before-icon="arrow"
          icon-color="white"
        ></UiButton>
        <UiButton
          class="leave__leave-btn"
          label="Выйти"
          before-icon="login"
          icon-color="orange-200"
        ></UiButton>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.leave {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
    color: $surface-900;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  &__title {
    font-weight: 500;
  }
  &__description {
    font-size: 14px;
  }
  &__btns {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }
  &__cancel-btn {
    padding: 6px 12px !important;
    font-size: 14px;
  }
  &__leave-btn {
    width: 92px;
    color: $orange-200;
    font-weight: 100;
    background-color: transparent;
    border: 1px solid $orange-200;
    font-size: 14px;
  }
}
</style>
