<template>
  <div class="menu">
    <div class="menu__wrapper">
      <div class="menu__avatar">
        <button class="menu__avatar-default" type="button">
          <UiIcons icon="profile-user" color="red-500" size="size-32"></UiIcons>
        </button>
      </div>

      <div class="menu__auth">
        <UiButton
          label="Войти"
          before-icon="login"
          icon-color="red-500"
          @click="openAuthModal"
          class="menu__auth-login"
        ></UiButton>
        <UiButton
          background-color="red-500"
          label="Зарегестрироваться"
          @click="openAuthModal"
          class="menu__auth-register button-primary"
        ></UiButton>
      </div>

      <ul class="menu__list">
        <li class="menu__item" v-for="(list, index) in lists" :key="index">
          <nuxt-link
            :to="list.link"
            class="menu__link"
            :class="{ 'menu__link--active': list.link === route.path }"
          >
            <UiIcons size="size-20" color="red-500" :icon="list.icon"></UiIcons>
            <p class="menu__text">{{ list.name }}</p>
          </nuxt-link>
        </li>
      </ul>

      <div class="menu__footer">
        <div class="menu__locales">
          <TheHeaderLocale></TheHeaderLocale>
        </div>
        <UiButton
          class="menu__leave-btn"
          label="Выйти"
          before-icon="login"
          icon-color="orange-200"
          @click="openLeaveModal"
        ></UiButton>
      </div>
    </div>
  </div>
  <UiModal
    :is-show="isOpenLeaveModal"
    max-width="327px"
    @close="closeLeaveModal"
  >
    <ModalsLeave></ModalsLeave>
  </UiModal>
</template>

<script setup>
const route = useRoute();
const userStore = useAuthStore();
const isOpenLeaveModal = ref(false);
const lists = [
  {
    icon: "profile-user",
    name: "Мой профиль",
    link: "/profile",
  },
  {
    icon: "heart",
    name: "Избранные",
    link: "/profile/favorite",
  },
  {
    icon: "map",
    name: "Туры",
    link: "/profile/my-tours",
  },
  {
    icon: "home",
    name: "Отели",
    link: "/profile/my-hotels",
  },
  {
    icon: "tablet-blog",
    name: "Мои покупки и брони",
    link: "/",
  },
  {
    icon: "wallet",
    name: "Кошелок и бонусы",
    link: "/profile/transactions",
  },
];

const openLeaveModal = () => {
  isOpenLeaveModal.value = true;
};

const closeLeaveModal = () => {
  isOpenLeaveModal.value = false;
};

const openAuthModal = () => {
  userStore.openAuthModal();
  userStore.isMobileModal = true;
};
</script>

<style lang="scss" scoped>
.menu {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
    color: $surface-900;
    position: relative;
    height: 85vh;
  }
  &__avatar {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
    &-img {
      width: 94px;
      height: 94px;
      border-radius: 50%;
      object-fit: cover;
    }
    &-default {
      width: 94px;
      height: 94px;
      border-radius: 50%;
      background-color: $surface-150;
    }
  }
  &__auth {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    &-login {
      background-color: $surface-150;
      font-weight: 100;
    }
  }
  &__list {
    display: flex;
    flex-direction: column;
  }
  &__link {
    display: flex;
    align-items: center;
    color: $surface-900;
    cursor: pointer;
    gap: 12px;
    padding: 18px 16px;
    &--active {
      background-color: $blue-200;
      font-weight: 400;
    }
  }
  &__footer {
    display: flex;
    justify-content: space-between;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 12px;
    padding: 0 12px;
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
