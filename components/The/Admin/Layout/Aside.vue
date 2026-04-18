<template>
  <aside class="admin-aside" :class="{ 'admin-aside--open': isNavOpen }">
    <div class="admin-aside__panel">
      <div class="admin-aside__top">
        <NuxtLink class="admin-aside__brand" to="/admin" @click="closeNav">
          <img
            class="admin-aside__logo"
            src="@/assets/image/logo/FlyAway-logo.png"
            alt="FlyAway"
          />
          <strong>FlyAway</strong>
        </NuxtLink>

        <button
          class="admin-aside__close"
          type="button"
          aria-label="Закрыть меню"
          @click="closeNav"
        >
          <UiIcons icon="circle-close" size="size-20" color="surface-900" />
        </button>
      </div>

      <nav class="admin-aside__nav">
        <section
          v-for="section in navSections"
          :key="section.id"
          class="admin-aside__section"
        >
          <button
            class="admin-aside__section-toggle"
            type="button"
            @click="toggleSection(section.id)"
          >
            <span>{{ section.title }}</span>
            <UiIcons
              icon="chevron"
              size="size-14"
              color="surface-400"
              :deg="isSectionOpen(section.id) ? 'up' : ''"
            />
          </button>

          <div v-if="isSectionOpen(section.id)" class="admin-aside__links">
            <NuxtLink
              v-for="item in section.items"
              :key="item.to"
              class="admin-aside__link"
              :to="item.to"
              @click="closeNav"
            >
              <span class="admin-aside__icon">
                <UiIcons :icon="item.icon" size="size-17-5" color="red-500" />
              </span>
              <span class="admin-aside__label">{{ item.label }}</span>
            </NuxtLink>
          </div>
        </section>
      </nav>

      <NuxtLink class="admin-aside__back-link" to="/" @click="closeNav">
        Перейти на сайт
      </NuxtLink>
    </div>
  </aside>
</template>

<script setup>
const isNavOpen = useState("admin-nav-open", () => false);
const userStore = useAuthStore();
const user = computed(() => userStore.getUser);
const openSections = ref(["overview", "content", "catalog", "site"]);

const closeNav = () => {
  isNavOpen.value = false;
};

const navSections = computed(() => {
  if (user.value?.role === "partner") {
    return [
      {
        id: "overview",
        title: "Профиль",
        items: [
          { label: "Обзор", to: "/admin", icon: "home" },
          { label: "Профиль", to: "/admin/profile", icon: "profile-user" },
        ],
      },
      {
        id: "content",
        title: "Каталог",
        items: [
          { label: "Создать тур", to: "/admin/tours/create", icon: "plus" },
          { label: "Мои туры", to: "/admin/tours", icon: "hot" },
          { label: "Создать отель", to: "/admin/hotels/create", icon: "plus" },
          { label: "Мои отели", to: "/admin/hotels", icon: "home-hotel" },
        ],
      },
    ];
  }

  return [
    {
      id: "overview",
      title: "Профиль",
      items: [
        { label: "Обзор", to: "/admin", icon: "home" },
        { label: "Профиль", to: "/admin/profile", icon: "profile-user" },
      ],
    },
    {
      id: "content",
      title: "Создание",
        items: [
          { label: "Создать тур", to: "/admin/tours/create", icon: "plus" },
          { label: "Создать отель", to: "/admin/hotels/create", icon: "plus" },
        ],
      },
    {
      id: "catalog",
      title: "Управление",
      items: [
        { label: "Пользователи", to: "/admin/users", icon: "side-bar" },
        { label: "Партнеры", to: "/admin/partners", icon: "globe" },
        { label: "Туры", to: "/admin/tours", icon: "hot" },
        { label: "Отели", to: "/admin/hotels", icon: "home-hotel" },
      ],
    },
    {
      id: "site",
      title: "Главная и сайт",
      items: [
        { label: "Баннеры", to: "/admin/banners", icon: "copy" },
        { label: "FAQ", to: "/admin/faq", icon: "smile" },
        { label: "Контакты", to: "/admin/contacts", icon: "phone" },
      ],
    },
  ];
});

const isSectionOpen = (sectionId) => openSections.value.includes(sectionId);

const toggleSection = (sectionId) => {
  openSections.value = isSectionOpen(sectionId)
    ? openSections.value.filter((item) => item !== sectionId)
    : [...openSections.value, sectionId];
};
</script>

<style lang="scss" scoped>
.admin-aside {
  min-height: 100%;

  &__panel {
    position: sticky;
    top: 12px;
    height: calc(100vh - 24px);
    margin: 12px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 18px 14px;
    color: $surface-900;
    background: rgba(255, 255, 255, 0.96);
    border: 1px solid rgba($red-500, 0.08);
    border-radius: 18px;
    box-shadow: 0 18px 42px rgba(32, 36, 38, 0.08);
    backdrop-filter: blur(10px);
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 10px;
    color: $surface-900;

    strong {
      font-size: 18px;
      font-weight: 700;
      line-height: 1;
    }
  }

  &__logo {
    width: 38px;
    height: 38px;
    object-fit: contain;
  }

  &__close {
    display: none;
    width: 34px;
    height: 34px;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: rgba($red-500, 0.08);
  }

  &__nav {
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-y: auto;
    min-height: 0;
  }

  &__section {
    display: grid;
    gap: 8px;
  }

  &__section-toggle {
    width: 100%;
    min-height: 34px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 0 10px;
    color: $surface-500;
    background: transparent;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  &__links {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  &__link {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 42px;
    padding: 0 12px;
    color: $surface-900;
    border-radius: 12px;
    transition:
      color 0.2s ease,
      background-color 0.2s ease,
      transform 0.2s ease;

    &:hover,
    &.router-link-active {
      color: $red-500;
      background: rgba($red-500, 0.07);
      transform: translateX(2px);
    }
  }

  &__icon {
    width: 30px;
    height: 30px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: rgba($red-500, 0.05);
    flex: 0 0 30px;
  }

  &__label {
    font-size: 14px;
    font-weight: 600;
  }

  &__back-link {
    margin-top: auto;
    min-height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: $surface-900;
    background: rgba($red-500, 0.05);
    border-radius: 12px;
    font-size: 13px;
    font-weight: 700;
  }
}

@media (max-width: 1024px) {
  .admin-aside {
    position: fixed;
    inset: 0 auto 0 0;
    z-index: 20;
    width: min(84vw, 260px);
    transform: translateX(-100%);
    transition: transform 0.24s ease;

    &--open {
      transform: translateX(0);
    }

    &__panel {
      height: calc(100vh - 16px);
      margin: 8px;
    }

    &__close {
      display: inline-flex;
    }
  }
}
</style>
