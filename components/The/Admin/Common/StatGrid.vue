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
  gap: 14px;

  &__item {
    position: relative;
    padding: 20px;
    min-height: 136px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    background: linear-gradient(180deg, rgba($red-500, 0.05) 0, #fff 58%);
    border: 1px solid rgba($red-500, 0.12);
    border-radius: 8px;
    overflow: hidden;
    transition:
      border-color 0.2s ease,
      transform 0.2s ease,
      box-shadow 0.2s ease;

    &::before {
      content: "";
      position: absolute;
      inset: 0 auto auto 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, $red-500 0, rgba($red-500, 0.24) 100%);
    }

    &:hover {
      border-color: $red-500;
      transform: translateY(-2px);
      box-shadow: 0 18px 30px rgba(32, 36, 38, 0.08);
    }
  }

  &__value {
    color: $red-500;
    font-size: 34px;
    font-weight: 700;
    line-height: 1;
  }

  &__label {
    margin-top: 10px;
    color: $surface-900;
    font-size: 14px;
    font-weight: 600;
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
