<template>
  <section>
    <TheAdminCommonPageHeader
      title="Главная"
      description="Короткая сводка по основным разделам FlyAway."
    />

    <TheAdminCommonStatGrid :items="stats" />
  </section>
</template>

<script setup>
definePageMeta({
  layout: "admin",
  middleware: "admin",
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
