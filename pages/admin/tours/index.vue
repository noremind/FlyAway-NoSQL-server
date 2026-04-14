<template>
  <section>
    <TheAdminCommonPageHeader
      title="Туры"
      description="Каталог туров, цены, скидки и привязка к партнерам."
      action-to="/admin/tours/create"
      action-label="Создать тур"
    />

    <UiTable :columns="columns" :rows="tours" :loading="isLoading" />
  </section>
</template>

<script setup>
definePageMeta({
  layout: "admin",
  middleware: "admin",
});

const tours = ref([]);
const isLoading = ref(false);
const columns = [
  { key: "title", label: "Название" },
  { key: "partner.title", label: "Партнер" },
  { key: "price", label: "Цена" },
  { key: "discount", label: "Скидка" },
  { key: "rating", label: "Рейтинг" },
];

const loadTours = async () => {
  isLoading.value = true;

  try {
    const res = await useApi().client({ url: "/tours" });
    tours.value = res.data || [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadTours);
</script>
