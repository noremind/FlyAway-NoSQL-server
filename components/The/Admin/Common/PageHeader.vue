<template>
  <div class="admin-page-header">
    <div>
      <h1 class="admin-page-header__title">{{ title }}</h1>
      <p v-if="description" class="admin-page-header__description">
        {{ description }}
      </p>
    </div>

    <NuxtLink v-if="actionTo" class="admin-page-header__action" :to="actionTo">
      {{ actionLabel }}
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
  margin-bottom: 24px;

  &__title {
    color: $surface-900;
    font-size: 32px;
    font-weight: 700;
  }

  &__description {
    max-width: 680px;
    margin-top: 8px;
    color: $surface-400;
    font-size: 15px;
    line-height: 1.5;
  }

  &__action {
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
}

@media (max-width: 700px) {
  .admin-page-header {
    flex-direction: column;

    &__title {
      font-size: 26px;
    }
  }
}
</style>
