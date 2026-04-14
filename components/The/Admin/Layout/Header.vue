<template>
  <header class="admin-header">
    <div class="admin-header__title-box">
      <p class="admin-header__eyebrow">Админ-панель</p>
      <p class="admin-header__title">Управление FlyAway</p>
    </div>

    <div class="admin-header__profile" ref="profileRef">
      <button class="admin-header__user" type="button" @click="toggleDropdown">
        <img
          v-if="user?.avatar"
          class="admin-header__avatar"
          :src="user.avatar"
          :alt="userName"
        />
        <span v-else class="admin-header__avatar admin-header__avatar--empty">
          {{ userInitial }}
        </span>

        <span class="admin-header__meta">
          <span class="admin-header__name">{{ userName }}</span>
          <span class="admin-header__role">{{ roleLabel }}</span>
        </span>

        <UiIcons
          class="admin-header__chevron"
          icon="chevron"
          size="size-14"
          color="surface-400"
          :deg="isDropdownOpen ? 'up' : ''"
        />
      </button>

      <div v-if="isDropdownOpen" class="admin-header__dropdown">
        <NuxtLink
          class="admin-header__dropdown-link"
          to="/admin/profile"
          @click="closeDropdown"
        >
          <UiIcons icon="profile-user" size="size-17-5" color="red-500" />
          Профиль
        </NuxtLink>
        <button
          class="admin-header__dropdown-link"
          type="button"
          @click="logout"
        >
          <UiIcons icon="login" size="size-17-5" color="red-500" />
          Выйти
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
const userStore = useAuthStore();
const user = computed(() => userStore.getUser);
const isDropdownOpen = ref(false);
const profileRef = ref(null);

const roleNames = {
  admin: "Администратор",
  partner: "Партнер",
  user: "Пользователь",
};

const userName = computed(() => user.value?.name || "Администратор");
const roleLabel = computed(() => roleNames[user.value?.role] || "Администратор");
const userInitial = computed(() => userName.value.charAt(0).toUpperCase());

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const closeDropdown = () => {
  isDropdownOpen.value = false;
};

const logout = () => {
  closeDropdown();
  userStore.logoutUser("/");
};

const onDocumentClick = (event) => {
  if (!profileRef.value?.contains(event.target)) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener("click", onDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", onDocumentClick);
});
</script>

<style lang="scss" scoped>
.admin-header {
  min-height: 84px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 18px 28px;
  background: $white;
  border-bottom: 1px solid $surface-300;

  &__title-box {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__eyebrow {
    color: $red-500;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
  }

  &__title {
    color: $surface-900;
    font-size: 20px;
    font-weight: 700;
  }

  &__profile {
    position: relative;
  }

  &__user {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 220px;
    padding: 8px 12px;
    background: $surface-150;
    border: 1px solid $surface-300;
    border-radius: 8px;
    transition:
      border-color 0.2s ease,
      background-color 0.2s ease,
      transform 0.2s ease;

    &:hover {
      border-color: $red-500;
      background: $white;
      transform: translateY(-1px);
    }
  }

  &__avatar {
    width: 42px;
    height: 42px;
    flex: 0 0 42px;
    border-radius: 50%;
    object-fit: cover;

    &--empty {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: $white;
      background: $red-500;
      font-weight: 700;
    }
  }

  &__meta {
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
    flex: 1;
  }

  &__name {
    max-width: 132px;
    overflow: hidden;
    color: $surface-900;
    font-size: 14px;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__role {
    color: $surface-400;
    font-size: 12px;
  }

  &__chevron {
    transition: transform 0.2s ease;
  }

  &__dropdown {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    z-index: 20;
    width: 220px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 8px;
    background: $white;
    border: 1px solid $surface-300;
    border-radius: 8px;
    box-shadow: 0 14px 34px rgba(32, 36, 38, 0.12);
    animation: dropdownAppear 0.18s ease;
  }

  &__dropdown-link {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 12px;
    color: $surface-900;
    border-radius: 8px;
    font-size: 14px;
    transition:
      color 0.2s ease,
      background-color 0.2s ease;

    &:hover {
      color: $red-500;
      background: $surface-150;
    }
  }
}

@keyframes dropdownAppear {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 700px) {
  .admin-header {
    align-items: stretch;
    flex-direction: column;
    padding: 16px;

    &__user {
      width: 100%;
      min-width: 0;
    }

    &__dropdown {
      left: 0;
      right: auto;
      width: 100%;
    }
  }
}
</style>
