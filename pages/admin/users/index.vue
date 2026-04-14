<template>
  <section>
    <TheAdminCommonPageHeader
      title="Пользователи"
      description="Управление аккаунтами и ролями пользователей."
    />

    <UiTable :columns="columns" :rows="users" :loading="isLoading" />
  </section>
</template>

<script setup>
definePageMeta({
  layout: "admin",
  middleware: "admin",
});

const users = ref([]);
const isLoading = ref(false);
const columns = [
  { key: "name", label: "Имя" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Телефон" },
  { key: "role", label: "Роль" },
  { key: "createdAt", label: "Создан" },
];

const loadUsers = async () => {
  isLoading.value = true;

  try {
    const res = await useApi().client({ url: "/users" });
    users.value = res.data || [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadUsers);
</script>
