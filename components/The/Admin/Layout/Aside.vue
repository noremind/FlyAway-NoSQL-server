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
      <section
        v-for="section in navSections"
        :key="section.title"
        class="admin-aside__section"
      >
        <p class="admin-aside__section-title">{{ section.title }}</p>

        <div class="admin-aside__links">
          <NuxtLink
            v-for="item in section.items"
            :key="item.to"
            class="admin-aside__link"
            :to="item.to"
          >
            <span class="admin-aside__icon">
              <UiIcons :icon="item.icon" size="size-17-5" color="red-500" />
            </span>
            <span>{{ item.label }}</span>
          </NuxtLink>
        </div>
      </section>
    </nav>
  </aside>
</template>

<script setup>
const navSections = [
  {
    title: "Обзор",
    items: [
      { label: "Главная", to: "/admin", icon: "home" },
      { label: "Профиль", to: "/admin/profile", icon: "profile-user" },
    ],
  },
  {
    title: "Управление",
    items: [
      { label: "Пользователи", to: "/admin/users", icon: "side-bar" },
      { label: "Партнеры", to: "/admin/partners", icon: "globe" },
      { label: "Туры", to: "/admin/tours", icon: "hot" },
      { label: "Создать тур", to: "/admin/tours/create", icon: "plus" },
      { label: "Отели", to: "/admin/hotels", icon: "home-hotel" },
      { label: "Создать отель", to: "/admin/hotels/create", icon: "plus" },
    ],
  },
  {
    title: "Помощь",
    items: [
      { label: "FAQ", to: "/admin/faq", icon: "smile" },
      { label: "Контакты", to: "/admin/contacts", icon: "phone" },
    ],
  },
];
</script>

<style lang="scss" scoped>
.admin-aside {
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 20px 16px;
  color: $surface-900;
  background: $white;
  border-right: 1px solid $surface-300;

  &__brand {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    color: $surface-900;
    background: $surface-150;
    border-radius: 8px;
    font-size: 20px;
    font-weight: 700;
    transition:
      color 0.2s ease,
      background-color 0.2s ease;

    &:hover {
      color: $red-500;
      background: $white;
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
    gap: 18px;
    overflow-y: auto;
    padding-right: 2px;
  }

  &__section {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px;
    background: $surface-150;
    border-radius: 8px;
  }

  &__section-title {
    padding: 6px 10px;
    color: $red-500;
    background: $white;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
  }

  &__links {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 12px;
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

      .admin-aside__icon {
        background: rgba(255, 255, 255, 0.18);
      }

      :deep(.icon) {
        background-color: $white !important;
      }
    }
  }

  &__icon {
    width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 32px;
    background: $white;
    border-radius: 8px;
    transition: background-color 0.2s ease;
  }
}

@media (max-width: 1024px) {
  .admin-aside {
    gap: 14px;
    border-right: 0;
    border-bottom: 1px solid $surface-300;

    &__nav {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      overflow: visible;
      padding-right: 0;
    }
  }
}

@media (max-width: 760px) {
  .admin-aside {
    padding: 14px;

    &__nav {
      grid-template-columns: 1fr;
    }
  }
}
</style>
