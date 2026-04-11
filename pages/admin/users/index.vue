<template>
  <section>
    <TheAdminCommonPageHeader
      title="Пользователи"
      description="Управление аккаунтами и ролями пользователей."
    />

    <UiTable :columns="columns" :rows="users" />
  </section>
</template>

<script setup>
definePageMeta({
  layout: "admin",
  middleware: "admin",
});

const users = ref([]);
const columns = [
  { key: "name", label: "Имя" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Телефон" },
  { key: "role", label: "Роль" },
  { key: "createdAt", label: "Создан" },
];

const loadUsers = async () => {
  const res = await useApi().client({ url: "/users" });
  users.value = res.data || [];
};

onMounted(loadUsers);
</script>
