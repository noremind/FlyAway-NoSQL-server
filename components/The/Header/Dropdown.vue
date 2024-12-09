<template>
  <div class="dropdown">
    <div class="dropdown__wrapper">
      <div class="dropdown__box">
        <img
          class="dropdown__avatar"
          src="@/assets/image/common/avatar-user.jpeg"
          alt="Avatar"
        />

        <button class="dropdown__avatar" type="button">
          <UiIcons size="size-32" icon="profile" color="blue-500"></UiIcons>
        </button>
      </div>

      <div class="dropdown__auth">
        <UiButton
          label="Войти"
          before-icon="login"
          icon-color="blue-500"
        ></UiButton>
        <UiButton
          background-color="blue-500"
          label="Зарегестрироваться"
        ></UiButton>
      </div>

      <p class="dropdown__user-name">Дана</p>

      <ul class="dropdown__list">
        <li
          class="dropdown__list-item"
          v-for="item in dropdownNav"
          :key="item.id"
        >
          <UiIcons :icon="item.icon" color="blue-500" size="size-24"></UiIcons>
          <nuxt-link class="dropdown__link">{{ item.name }}</nuxt-link>
        </li>
      </ul>

      <UiButton
        class="dropdown__leave-btn"
        label="Выйти"
        before-icon="login"
        icon-color="orange-200"
      ></UiButton>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["closeDropdown"]);
const dropdownNav = [
  {
    id: 1,
    name: "Личный кабинет",
    link: "",
    icon: "profile",
  },
  {
    id: 2,
    name: "Избранные",
    link: "",
    icon: "heart",
  },
  {
    id: 3,
    name: "Мои туры",
    link: "",
    icon: "map",
  },
  {
    id: 4,
    name: "Мои отели",
    link: "",
    icon: "home",
  },
  {
    id: 5,
    name: "BaqytZone",
    link: "",
    icon: "smile",
  },
  {
    id: 5,
    name: "Кошелек и бонусы",
    link: "",
    icon: "credit-card",
  },
];
</script>

<style lang="scss" scoped>
.dropdown {
  position: absolute;
  top: 55px;
  left: 13px;
  transform: translateX(-90%);
  z-index: 50;
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 340px;
    width: 100%;
    background-color: $white;
    padding: 26px 22px;
    border-radius: 12px 16px;
    box-shadow: 0px 0px 20px 0px #0000000a;
  }
  &__box {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__user-name {
    color: $surface-900;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
    font-weight: 400;
  }
  &__avatar {
    width: 68px;
    height: 68px;
    border-radius: 50%;
    cursor: pointer;
    background-color: $surface-150;
    object-fit: cover;
  }
  &__auth {
    display: flex;
    gap: 6px;
    align-items: center;
  }
  &__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    &-item {
      color: $surface-900;
      font-size: 14px;
      display: flex;
      gap: 12px;
      align-items: center;
      cursor: pointer;
    }
  }
  &__leave-btn {
    width: 92px;
    color: $orange-200;
    font-weight: 100;
    background-color: transparent;
    border: 1px solid $orange-200;
  }
}
</style>
