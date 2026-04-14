<template>
  <section>
    <TheAdminCommonPageHeader
      title="Отели"
      description="Список отелей, локации, рейтинг и описание."
      action-to="/admin/hotels/create"
      action-label="Создать отель"
    />

    <UiTable :columns="columns" :rows="hotels" :loading="isLoading" />
  </section>
</template>

<script setup>
definePageMeta({
  layout: "admin",
  middleware: "admin",
});

const hotels = ref([]);
const isLoading = ref(false);
const columns = [
  { key: "name", label: "Название" },
  { key: "partner.title", label: "Партнер" },
  { key: "location", label: "Локация" },
  { key: "rating", label: "Рейтинг" },
];

const loadHotels = async () => {
  isLoading.value = true;

  try {
    const res = await useApi().client({ url: "/hotels" });
    hotels.value = res.data || [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadHotels);
</script>
