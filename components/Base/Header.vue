<template>
  <header class="header">
    <div class="header__wrapper">
      <div class="header__inner">
        <nuxt-link to="/" class="header__link">
          <img
            class="header__logo"
            src="@/assets/image/logo/FlyAway-logo.png"
            alt="FlyAway Logo"
          />
          <img
            class="header__logo header__logo--mobile"
            src="@/assets/image/logo/FlyAway-logo.png"
            alt="FlyAway Logo"
          />
        </nuxt-link>

        <UiSelect
          class="header__city"
          v-model="selectCity"
          :options="cities"
        ></UiSelect>

        <ul class="header__list">
          <li
            v-for="list in navList"
            :key="list.id"
            :class="{ 'header__list-item--active': list.link === route.path }"
            class="header__list-item"
          >
            <nuxt-link :to="list.link" class="header__list-link">{{
              list.name
            }}</nuxt-link>
          </li>
        </ul>
      </div>
      <div class="header__box">
        <TheHeaderLocale></TheHeaderLocale>

        <UiInput
          custom-class="header__search"
          placeholder="Введите название"
          after-icon="lupa"
          icon-color="red-500"
        ></UiInput>

        <nuxt-link to="/profile/favourites" v-if="userStore.isLoggedIn">
          <UiIcons icon="heart" size="size-24" color="red-500"></UiIcons>
        </nuxt-link>

        <div class="header__profile" ref="headerDropdown">
          <button
            class="header__profile-btn"
            type="button"
            @click="openDropdownMenu"
            v-if="!userStore.isLoggedIn"
          >
            <UiIcons icon="profile-user" color="red-500"></UiIcons>
          </button>

          <img
            v-else
            class="header__avatar"
            @click="openDropdownMenu"
            :src="user?.avatar"
            alt="Avatar"
          />

          <TheHeaderDropdown
            v-if="isOpenDropdownMenu"
            @close-dropdown="closeDropdownMenu"
          ></TheHeaderDropdown>
        </div>
      </div>

      <UiIcons
        class="header__burger"
        icon="burger-menu"
        size="size-32"
        color="red-500"
        @click="openMobileNavMenu"
      ></UiIcons>
    </div>
  </header>

  <UiModal
    :is-show="isOpenMobileNavMenu"
    max-width="786px"
    :full-screen="true"
    @close="closeMobileNavMenu"
  >
    <ModalsNavMenuMobile></ModalsNavMenuMobile>
  </UiModal>
</template>

<script setup>
const route = useRoute();
const headerDropdown = ref(null);
const isOpenDropdownMenu = ref(false);
const isOpenMobileNavMenu = ref(false);
const userStore = useAuthStore();
const user = computed(() => userStore.getUser);
const cities = reactive([
  {
    id: 1,
    name: "Алматы",
  },
  {
    id: 2,
    name: "Астана",
  },
  {
    id: 3,
    name: "Қызылорда",
  },
]);
const selectCity = ref(cities[0]);
const navList = ref([
  {
    id: 1,
    name: "Туры",
    link: "/tours",
  },
  {
    id: 2,
    name: "Отели",
    link: "/hotels",
  },
]);

const clickOutsideDropdown = (event) => {
  if (headerDropdown.value && !headerDropdown.value?.contains(event.target)) {
    closeDropdownMenu();
  }
};

onMounted(() => {
  document.addEventListener("click", clickOutsideDropdown);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", clickOutsideDropdown);
});

const openDropdownMenu = () => {
  isOpenDropdownMenu.value = true;
};

const closeDropdownMenu = () => {
  isOpenDropdownMenu.value = false;
};

const openMobileNavMenu = () => {
  isOpenMobileNavMenu.value = true;
};

const closeMobileNavMenu = () => {
  isOpenMobileNavMenu.value = false;
};

watch(
  () => route.fullPath,
  () => {
    closeMobileNavMenu();
    closeDropdownMenu();
  }
);
</script>

<style lang="scss" scoped>
.header {
  position: relative;
  z-index: 2;
  background-color: $white;
  &__wrapper {
    width: 100%;
    max-width: 1240px;
    height: 110px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 auto;
    padding: 0 24px;
  }
  &__logo {
    width: 64px;
    margin: 0 12px 0 0;
    cursor: pointer;
    &--mobile {
      display: none;
    }
  }
  &__city {
    background-color: $surface-150;
    font-size: 14px;
    border-radius: 16px;
    border: none;
  }
  &__avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
  }
  &__inner {
    display: flex;
    gap: 26px;
    align-items: center;
  }
  &__box {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  &__list {
    display: flex;
    gap: 26px;
    &-link {
      color: inherit;
    }
    &-item {
      font-size: 14px;
      font-weight: 400;
      &--active {
        color: $red-500;
      }
    }
  }
  &__link {
    font-weight: 400;
    color: $surface-900;
    align-items: center;
    font-size: 14px;
    line-height: 17.5px;
  }
  &__search {
    background-color: $surface-150;
    border: none;
  }
  &__burger {
    display: none;
  }
  &__profile {
    position: relative;
    &-btn {
      width: 44px;
      height: 44px;
      background-color: $surface-150;
      border-radius: 50%;
    }
  }
}

@media (max-width: 768px) {
  .header {
    &__list,
    &__box {
      display: none;
    }

    &__burger {
      display: block;
      cursor: pointer;
    }
  }
}

@media (max-width: 375px) {
  .header {
    &__wrapper {
      padding: 0 6px;
    }
    &__logo {
      width: 64px;
      display: none;
      &--mobile {
        display: flex;
      }
    }
    &__inner {
      gap: 16px;
    }
    &__link {
      order: 2;
    }
    &__city {
      order: 1;
      background-color: transparent;
    }
  }
}
</style>
