<template>
  <aside class="nav">
    <div class="nav__wrapper">
      <ul class="nav__list">
        <li
          class="nav__list-item"
          v-for="list in navList"
          :key="list.id"
          :class="{
            'nav__list-item--active': isActive(list.link),
          }"
        >
          <nuxt-link class="nav__link" :to="list.link">
            <UiIcons
              color="blue-500"
              size="size-24"
              :icon="list.icon"
            ></UiIcons>
            <p class="nav__list-text">{{ list.name }}</p>
          </nuxt-link>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const navList = reactive([
  {
    id: 1,
    icon: "profile-user",
    value: "",
    name: "Мои данные",
    link: "/profile",
  },
  {
    id: 2,
    icon: "heart",
    value: "",
    name: "Избранные",
    link: "/profile/favourites",
  },
  {
    id: 3,
    icon: "map",
    value: "",
    name: "Мои туры",
    link: "/profile/my-tours",
  },
  {
    id: 4,
    icon: "home-hotel",
    value: "",
    name: "Мои отели",
    link: "/profile/my-hotels",
  },
  {
    id: 5,
    icon: "smile",
    value: "",
    name: "BaqytZone",
    link: "/profile/baqyt-zone",
  },
  {
    id: 6,
    icon: "credit-card",
    value: "",
    name: "Кошелек и бонусы",
    link: "/profile/transaction",
  },
]);

// Utility function to check active state
const isActive = (link) => {
  if (route.path === link) {
    return true; // Exact match
  }
  if (route.path.startsWith(link) && link !== "/profile") {
    return true; // Nested match for non-root routes
  }
  return false;
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
  &__link {
    display: flex;
    gap: 8px;
    align-items: center;
    color: $surface-900;
  }
  &__list-item {
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
