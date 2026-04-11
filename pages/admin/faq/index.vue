<template>
  <section>
    <TheAdminCommonPageHeader
      title="FAQ"
      description="Раздел для будущего управления частыми вопросами."
    />

    <div class="admin-list">
      <div v-for="item in items" :key="item.title" class="admin-list__item">
        <h2 class="admin-list__title">{{ item.title }}</h2>
        <p class="admin-list__text">{{ item.text }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
definePageMeta({
  layout: "admin",
  middleware: "admin",
});

const items = [
  {
    title: "Бронирование",
    text: "Здесь появятся вопросы о турах, оплате и отмене.",
  },
  {
    title: "Партнеры",
    text: "Здесь появятся вопросы для партнерских аккаунтов.",
  },
];
</script>

<style lang="scss" scoped>
.admin-list {
  display: grid;
  gap: 14px;

  &__item {
    padding: 18px;
    background: $white;
    border: 1px solid $surface-300;
    border-radius: 8px;
  }

  &__title {
    color: $surface-900;
    font-size: 18px;
    font-weight: 700;
  }

  &__text {
    margin-top: 8px;
    color: $surface-400;
  }
}
</style>
