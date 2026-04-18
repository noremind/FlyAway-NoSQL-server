<template>
  <section class="admin-home">
    <div class="admin-home__header">
      <h1 class="admin-home__title">Обзор</h1>
      <p class="admin-home__text">Ключевые сущности проекта в одном месте.</p>
    </div>
    <TheAdminCommonStatGrid :items="stats" />
  </section>
</template>

<script setup>
definePageMeta({
  layout: "admin",
  middleware: "admin",
});

useSeo({
  title: "Админ-панель",
  description: "Рабочий стол админ-панели FlyAway.",
});

const stats = ref([
  { label: "Пользователи", value: 0 },
  { label: "Партнеры", value: 0 },
  { label: "Туры", value: 0 },
  { label: "Отели", value: 0 },
]);

const loadStats = async () => {
  const api = useApi();
  const [users, partners, tours, hotels] = await Promise.allSettled([
    api.client({ url: "/users" }),
    api.client({ url: "/partners" }),
    api.client({ url: "/tours" }),
    api.client({ url: "/hotels" }),
  ]);

  stats.value = [
    { label: "Пользователи", value: users.value?.data?.length || 0 },
    { label: "Партнеры", value: partners.value?.data?.length || 0 },
    { label: "Туры", value: tours.value?.data?.length || 0 },
    { label: "Отели", value: hotels.value?.data?.length || 0 },
  ];
};

onMounted(loadStats);
</script>

<style lang="scss" scoped>
.admin-home {
  display: grid;
  gap: 16px;

  &__header {
    display: grid;
    gap: 4px;
  }

  &__title {
    color: $surface-900;
    font-size: 28px;
    font-weight: 700;
    line-height: 1.05;
  }

  &__text {
    color: $surface-500;
    font-size: 14px;
    line-height: 1.45;
  }
}
</style>
