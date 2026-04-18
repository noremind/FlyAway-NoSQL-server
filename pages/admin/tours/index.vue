<template>
  <section>
    <TheAdminCommonPageHeader
      title="Туры"
      description="Список туров с быстрым переходом к редактированию."
    />

    <UiTable :columns="columns" :rows="tours" :loading="isLoading" />
  </section>
</template>

<script setup>
definePageMeta({
  layout: "admin",
  middleware: "admin",
});

useSeo({
  title: "Туры",
  description: "Управление турами в админ-панели FlyAway.",
});

const tours = ref([]);
const isLoading = ref(false);
const columns = [
  { key: "title", label: "Название" },
  { key: "partner.title", label: "Партнер" },
  { key: "price", label: "Цена" },
  { key: "discount", label: "Скидка" },
  { key: "rating", label: "Рейтинг" },
  {
    key: "_id",
    label: "Действие",
    type: "link",
    to: (row) => `/admin/tours/${row._id}`,
    text: "Открыть",
  },
];

const loadTours = async () => {
  isLoading.value = true;

  try {
    const res = await useApi().client({ url: "/tours/manage" });
    tours.value = res.data || [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadTours);
</script>
