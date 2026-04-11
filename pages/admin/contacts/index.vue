<template>
  <section>
    <TheAdminCommonPageHeader
      title="Контакты"
      description="Раздел для управления публичными контактами FlyAway."
    />

    <form class="admin-contacts">
      <UiInput label="Email" placeholder="info@flyaway.kz" />
      <UiInput label="Телефон" placeholder="+7 700 000 00 00" />
      <UiInput label="Адрес" placeholder="Алматы" />
      <div class="admin-contacts__map">
        Yandex Map
      </div>
    </form>
  </section>
</template>

<script setup>
definePageMeta({
  layout: "admin",
  middleware: "admin",
});
</script>

<style lang="scss" scoped>
.admin-contacts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  padding: 24px;
  background: $white;
  border: 1px solid $surface-300;
  border-radius: 8px;

  &__map {
    grid-column: 1 / -1;
    min-height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $red-500;
    background: $surface-150;
    border: 1px dashed $surface-300;
    border-radius: 8px;
  }
}

@media (max-width: 800px) {
  .admin-contacts {
    grid-template-columns: 1fr;
  }
}
</style>
