<template>
  <div class="dropdown">
    <div class="dropdown__wrapper">
      <div class="dropdown__box">
        <img
          v-if="userStore.isLoggedIn && user?.avatar"
          class="dropdown__avatar"
          :src="user?.avatar"
          alt="Avatar"
        />
        <span
          v-else-if="userStore.isLoggedIn"
          class="dropdown__avatar dropdown__avatar--empty"
        >
          {{ userInitial }}
        </span>

        <button class="dropdown__avatar" type="button" v-else>
          <UiIcons
            size="size-32"
            icon="profile-user"
            @click="userStore.openAuthModal"
            color="red-500"
          ></UiIcons>
        </button>
      </div>

      <div class="dropdown__auth" v-if="!userStore.isLoggedIn">
        <UiButton
          label="Войти"
          before-icon="login"
          icon-color="red-500"
          class="dropdown__auth-login"
          @click="userStore.openAuthModalLogin"
        ></UiButton>
        <UiButton
          background-color="red-500"
          label="Зарегестрироваться"
          class="dropdown__auth-register button-primary"
          @click="userStore.openAuthModalRegister"
        ></UiButton>
      </div>

      <p class="dropdown__user-name">{{ user?.name }}</p>

      <ul class="dropdown__list" v-if="userStore.isLoggedIn">
        <li
          class="dropdown__list-item"
          v-for="item in dropdownNav"
          :key="item.id"
        >
          <UiIcons :icon="item.icon" color="red-500" size="size-24"></UiIcons>
          <nuxt-link class="dropdown__link" :to="item.link">{{
            item.name
          }}</nuxt-link>
        </li>
      </ul>

      <UiButton
        v-if="userStore.isLoggedIn"
        class="dropdown__leave-btn"
        label="Выйти"
        before-icon="login"
        icon-color="orange-200"
        @click="userStore.logoutUser"
      ></UiButton>
    </div>
  </div>
</template>

<script setup>
const userStore = useAuthStore();
const user = computed(() => userStore.getUser);
const emit = defineEmits(["closeDropdown"]);
const userInitial = computed(() => {
  return (user.value?.name || "U").charAt(0).toUpperCase();
});
const dropdownNav = [
  {
    id: 1,
    name: "Личный кабинет",
    link: "/profile",
    icon: "profile-user",
  },
  {
    id: 2,
    name: "Избранные",
    link: "/profile/favourites",
    icon: "heart",
  },
  {
    id: 3,
    name: "Мои туры",
    link: "/profile/my-tours",
    icon: "map",
  },
  {
    id: 4,
    name: "Мои отели",
    link: "/profile/my-hotels",
    icon: "home",
  },
  {
    id: 5,
    name: "Кошелек и бонусы",
    link: "/profile/transactions",
    icon: "credit-card",
  },
];
</script>

<style lang="scss" scoped>
.dropdown {
  position: absolute;
  top: 35px;
  left: 45px;
  transform: translateX(-90%);
  z-index: 50;
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 290px;
    background-color: $white;
    padding: 26px 22px;
    border-radius: 12px 16px;
    box-shadow: 0px 0px 20px 0px #0000000a;
    position: relative;
    z-index: 50;
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

    &--empty {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: $white;
      background: $red-500;
      font-size: 24px;
      font-weight: 700;
    }
  }
  &__auth {
    display: flex;
    gap: 6px;
    font-size: 14px;
    align-items: center;
    &-login {
      background-color: $surface-150;
      font-weight: 100;
    }
    &-register {
      padding: 6px 10px !important;
    }
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
  &__link {
    color: $surface-900;
  }
}
</style>
