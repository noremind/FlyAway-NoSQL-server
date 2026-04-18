<template>
  <section>
    <TheAdminCommonPageHeader
      title="Создать тур"
      description="Соберите карточку тура и сразу подготовьте ее для витрины."
    />

    <TheAdminToursForm mode="create" />
  </section>
</template>

<script setup>
definePageMeta({
  layout: "admin",
  middleware: "admin",
});

useSeo({
  title: "Создать тур",
  description: "Создание тура в админ-панели FlyAway.",
});
</script>
