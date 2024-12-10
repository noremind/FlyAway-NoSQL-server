<template>
  <header class="header">
    <div class="header__wrapper">
      <div class="header__inner">
        <nuxt-link to="/">
          <img
            class="header__logo"
            src="@/assets/image/logo/Sapar-time-logo.svg"
            alt="SaparTime Logo"
          />
        </nuxt-link>

        <!-- <UiSelect
          class="header__city"
          v-model="selectCity"
          :options="cities"
        ></UiSelect> -->

        <ul class="header__list">
          <li v-for="list in navList" :key="list.id" class="header__list-item">
            <nuxt-link class="header__list-link">{{ list.name }}</nuxt-link>
          </li>
        </ul>
      </div>
      <div class="header__box">
        <!-- <TheHeaderLocale></TheHeaderLocale> -->

        <UiInput
          class="header__search"
          placeholder="Введите название"
          label="Top"
          after-icon="lupa"
          icon-color="blue-500"
        ></UiInput>

        <div class="header__profile" ref="headerDropdown">
          <button
            class="header__profile-btn"
            type="button"
            @click="openDropdownMenu"
          >
            <UiIcons icon="profile" color="blue-500"></UiIcons>
          </button>

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
        color="blue-500"
      ></UiIcons>
    </div>
  </header>
</template>

<script setup>
const headerDropdown = ref(null);
const isOpenDropdownMenu = ref(false);
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
    link: "",
  },
  {
    id: 2,
    name: "Отели",
    link: "",
  },
  {
    id: 3,
    name: "BaqytZone",
    link: "",
  },
  {
    id: 4,
    name: "Блог и Статьи",
    link: "",
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
</script>

<style lang="scss" scoped>
.header {
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
    margin: 0 12px 0 0;
    cursor: pointer;
  }
  &__city {
    background-color: $surface-150;
    font-size: 14px;
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
</style>
