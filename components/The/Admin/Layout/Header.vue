<template>
  <header class="admin-header">
    <div>
      <p class="admin-header__eyebrow">Админ-панель</p>
      <p class="admin-header__title">Управление FlyAway</p>
    </div>

    <div class="admin-header__user">
      <span class="admin-header__role">{{ user?.role || "admin" }}</span>
      <span>{{ user?.name || "Администратор" }}</span>
      <button class="admin-header__logout" type="button" @click="logout">
        Выйти
      </button>
    </div>
  </header>
</template>

<script setup>
const userStore = useAuthStore();
const user = computed(() => userStore.getUser);

const logout = () => {
  userStore.logoutUser("/");
};
</script>

<style lang="scss" scoped>
.admin-header {
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 28px;
  background: $white;
  border-bottom: 1px solid $surface-300;

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

  &__user {
    display: flex;
    align-items: center;
    gap: 10px;
    color: $surface-900;
    font-size: 14px;
  }

  &__role {
    padding: 6px 10px;
    color: $white;
    background: $red-500;
    border-radius: 8px;
  }

  &__logout {
    padding: 8px 12px;
    color: $red-500;
    border: 1px solid $red-500;
    border-radius: 8px;
    font-weight: 700;
    transition:
      color 0.2s ease,
      background-color 0.2s ease;

    &:hover {
      color: $white;
      background: $red-500;
    }
  }
}

@media (max-width: 600px) {
  .admin-header {
    align-items: flex-start;
    flex-direction: column;
    padding: 16px;
  }
}
</style>
