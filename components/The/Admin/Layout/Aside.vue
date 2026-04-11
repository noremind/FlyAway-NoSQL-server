<template>
  <aside class="admin-aside">
    <NuxtLink class="admin-aside__brand" to="/admin">
      <img
        class="admin-aside__logo"
        src="@/assets/image/logo/FlyAway-logo.png"
        alt="FlyAway"
      />
      <span>FlyAway</span>
    </NuxtLink>

    <nav class="admin-aside__nav">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        class="admin-aside__link"
        :to="item.to"
      >
        {{ item.label }}
      </NuxtLink>
    </nav>
  </aside>
</template>

<script setup>
const navItems = [
  { label: "Главная", to: "/admin" },
  { label: "Профиль", to: "/admin/profile" },
  { label: "Пользователи", to: "/admin/users" },
  { label: "Партнеры", to: "/admin/partners" },
  { label: "Туры", to: "/admin/tours" },
  { label: "Создать тур", to: "/admin/tours/create" },
  { label: "Отели", to: "/admin/hotels" },
  { label: "Создать отель", to: "/admin/hotels/create" },
  { label: "FAQ", to: "/admin/faq" },
  { label: "Контакты", to: "/admin/contacts" },
];
</script>

<style lang="scss" scoped>
.admin-aside {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 24px 18px;
  color: $surface-900;
  background: $white;
  border-right: 1px solid $surface-300;

  &__brand {
    display: flex;
    align-items: center;
    gap: 10px;
    color: $surface-900;
    font-size: 20px;
    font-weight: 700;
    transition: color 0.2s ease;

    &:hover {
      color: $red-500;
    }
  }

  &__logo {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }

  &__nav {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__link {
    padding: 12px 14px;
    border-radius: 8px;
    color: $surface-900;
    transition:
      color 0.2s ease,
      background-color 0.2s ease,
      transform 0.2s ease;

    &:hover,
    &.router-link-active {
      color: $white;
      background: $red-500;
      transform: translateX(2px);
    }
  }
}

@media (max-width: 900px) {
  .admin-aside {
    gap: 14px;
    border-right: 0;
    border-bottom: 1px solid $surface-300;

    &__nav {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}
</style>
