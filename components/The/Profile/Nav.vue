<template>
  <aside class="nav">
    <div class="nav__wrapper">
      <ul class="nav__list">
        <li
          class="nav__list-item"
          v-for="list in navList"
          :key="list.id"
          @click="updateSelectedNav(list)"
          :class="{ 'nav__list-item--active': list.id === selectedNav.id }"
        >
          <UiIcons color="blue-500" size="size-24" :icon="list.icon"></UiIcons>
          <p class="nav__list-text">{{ list.name }}</p>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
const navList = reactive([
  {
    id: 1,
    icon: "profile-user",
    value: "",
    name: "Мои данные",
    link: "",
  },
  {
    id: 2,
    icon: "heart",
    value: "",
    name: "Избранные",
    link: "",
  },
  {
    id: 3,
    icon: "map",
    value: "",
    name: "Мои туры",
    link: "",
  },
  {
    id: 4,
    icon: "home-hotel",
    value: "",
    name: "Мои отели",
    link: "",
  },
  {
    id: 5,
    icon: "smile",
    value: "",
    name: "BaqytZone",
    link: "",
  },
  {
    id: 6,
    icon: "credit-card",
    value: "",
    name: "Кошелек и бонусы",
    link: "",
  },
]);
const selectedNav = ref(navList[0]);

const updateSelectedNav = (nav) => {
  selectedNav.value = nav;
};
</script>

<style lang="scss" scoped>
.nav {
  &__wrapper {
    background-color: $white;
    width: 254px;
    border-radius: 16px;
    box-shadow: 0px 0px 20px 0px #0000000a;
  }
  &__list {
    display: flex;
    flex-direction: column;
  }
  &__list-item {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 16px;
    font-size: 14px;
    cursor: pointer;
    &--active {
      background-color: $blue-200;
      color: $surface-900;
      font-weight: 600;
    }
    &:first-child {
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
    }
    &:last-child {
      border-bottom-left-radius: 16px;
      border-bottom-right-radius: 16px;
    }
  }
}
</style>
