<template>
  <div class="admin-page-header">
    <div class="admin-page-header__meta">
      <h1 class="admin-page-header__title">{{ title }}</h1>
      <p v-if="description" class="admin-page-header__description">
        {{ description }}
      </p>
    </div>

    <NuxtLink v-if="actionTo" class="admin-page-header__action" :to="actionTo">
      <span>{{ actionLabel }}</span>
      <span class="admin-page-header__action-icon">+</span>
    </NuxtLink>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
  actionTo: String,
  actionLabel: {
    type: String,
    default: "Создать",
  },
});
</script>

<style lang="scss" scoped>
.admin-page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 8px;

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__title {
    color: $surface-900;
    font-size: 34px;
    font-weight: 700;
    line-height: 1.05;
  }

  &__description {
    max-width: 680px;
    color: $surface-500;
    font-size: 15px;
    line-height: 1.5;
  }

  &__action {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-height: 44px;
    padding: 12px 18px;
    color: $white;
    background: $red-500;
    border-radius: 8px;
    transition:
      background-color 0.2s ease,
      transform 0.2s ease;

    &:hover {
      background: $red-400;
      transform: translateY(-1px);
    }
  }

  &__action-icon {
    width: 20px;
    height: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.18);
    border-radius: 999px;
    font-weight: 700;
  }
}

@media (max-width: 700px) {
  .admin-page-header {
    flex-direction: column;
    margin-bottom: 4px;

    &__title {
      font-size: 28px;
    }

    &__action {
      width: 100%;
      justify-content: center;
    }
  }
}
</style>
