<template>
  <section class="admin-stat-grid">
    <article v-for="item in items" :key="item.label" class="admin-stat-grid__item">
      <p class="admin-stat-grid__value">{{ item.value }}</p>
      <p class="admin-stat-grid__label">{{ item.label }}</p>
    </article>
  </section>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});
</script>

<style lang="scss" scoped>
.admin-stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  &__item {
    padding: 20px;
    background: $white;
    border: 1px solid $surface-300;
    border-radius: 8px;
    transition:
      border-color 0.2s ease,
      transform 0.2s ease;

    &:hover {
      border-color: $red-500;
      transform: translateY(-2px);
    }
  }

  &__value {
    color: $red-500;
    font-size: 30px;
    font-weight: 700;
  }

  &__label {
    margin-top: 8px;
    color: $surface-900;
  }
}

@media (max-width: 900px) {
  .admin-stat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .admin-stat-grid {
    grid-template-columns: 1fr;
  }
}
</style>
