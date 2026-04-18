<template>
  <section>
    <TheAdminCommonPageHeader
      title="FAQ"
      description="Короткие ответы на частые вопросы."
    />

    <UiAccordion :items="items" />
  </section>
</template>

<script setup>
definePageMeta({
  layout: "admin",
  middleware: "admin",
});

useSeo({
  title: "FAQ",
  description: "Частые вопросы в админ-панели FlyAway.",
});

const items = [
  {
    title: "Бронирование",
    text: "Покупка, оплата и отмена будут собраны здесь в одном компактном блоке.",
  },
  {
    title: "Партнеры",
    text: "Здесь будут правила по доступам, публикации туров и редактированию предложений.",
  },
  {
    title: "Бонусы",
    text: "После запуска бонусного потока сюда можно вынести правила начисления и списания.",
  },
];
</script>
