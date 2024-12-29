<template>
  <section class="certificate">
    <div class="certificate__wrapper">
      <div class="certificate__box">
        <h3 class="certificate__title">Однодневный тур в озеро Кольсай</h3>
        <ul class="certificate__list">
          <li class="certificate__list-item" v-for="list in 3" :key="list">
            Горы, леса и поля позволяют отдалиться от городского шума и
            окунуться в мир, где царят тишина, пение птиц и шелест листьев.
          </li>
        </ul>
      </div>
      <div class="certificate__inner">
        <UiButton label="15 000 ₸" class="certificate__price"></UiButton>
        <div class="certificate__count">
          <UiIcons
            class="certificate__arrow down"
            size="size-20"
            icon="chevron"
          ></UiIcons>
          <UiInput class="certificate__input" :is-center="true"></UiInput>
          <UiIcons
            class="certificate__arrow"
            size="size-20"
            icon="chevron"
          ></UiIcons>
        </div>
        <UiButton
          label="Добавить"
          before-icon="plus"
          icon-color="blue-500"
          icon-size="size-24"
          class="certificate__btn-add"
        ></UiButton>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
.certificate {
  &__wrapper {
    padding: 16px;
    border-radius: 16px;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    gap: 16px;
    color: $surface-900;
  }
  &__title {
    font-weight: 600;
  }
  &__box {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  &__inner {
    max-width: 240px;
    flex-grow: 1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  &__list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    &-item {
      list-style: disc;
      margin-left: 20px;
      font-size: 12px;
    }
  }
  &__count {
    display: flex;
    justify-content: space-between;
    gap: 4px;
    align-items: center;
  }
  &__arrow {
    cursor: pointer;
  }
  &__price {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    font-weight: 700;
    background-color: $blue-500;
    color: $white;
  }
  &__btn-add {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid $blue-500;
    background-color: transparent;
    color: $blue-500;
    font-weight: 600;
  }
}
</style>
