<template>
  <section class="employee">
    <div class="employee__wrapper">
      <span class="employee__avatar employee__avatar--empty">Д</span>
      <h3 class="employee__title">Данагуль</h3>
      <p class="employee__prof">Гид</p>
    </div>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
.employee {
  &__wrapper {
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
    color: $surface-900;
  }
  &__avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;

    &--empty {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: $white;
      background: $red-500;
      font-size: 36px;
      font-weight: 700;
    }
  }
  &__title {
    font-size: 24px;
    text-align: center;
  }
  &__prof {
    color: $surface-400;
    font-size: 20px;
    font-weight: 400;
    text-align: center;
  }
}
</style>
