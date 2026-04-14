<template>
  <section>
    <TheAdminCommonPageHeader
      title="Партнеры"
      description="Список партнеров, контакты и связанные туры."
    />

    <UiTable :columns="columns" :rows="partners" :loading="isLoading" />
  </section>
</template>

<script setup>
definePageMeta({
  layout: "admin",
  middleware: "admin",
});

const partners = ref([]);
const isLoading = ref(false);
const columns = [
  { key: "title", label: "Название" },
  { key: "email", label: "Email" },
  { key: "bin", label: "БИН" },
  { key: "ownerName", label: "Владелец" },
  { key: "rating", label: "Рейтинг" },
  { key: "tour_count", label: "Туры" },
  { key: "contacts.phone", label: "Телефон" },
  { key: "contacts.website", label: "Сайт" },
];

const loadPartners = async () => {
  isLoading.value = true;

  try {
    const res = await useApi().client({ url: "/partners" });
    partners.value = res.data || [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadPartners);
</script>
