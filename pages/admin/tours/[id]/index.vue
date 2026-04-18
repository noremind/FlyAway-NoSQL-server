<template>
  <section>
    <TheAdminCommonPageHeader title="Редактировать тур" />

    <TheAdminToursForm mode="edit" :tour-id="route.params.id" />
  </section>
</template>

<script setup>
definePageMeta({
  layout: "admin",
  middleware: "admin",
});

const route = useRoute();

useSeo({
  title: "Редактировать тур",
  description: "Редактирование тура в админ-панели FlyAway.",
});
</script>
