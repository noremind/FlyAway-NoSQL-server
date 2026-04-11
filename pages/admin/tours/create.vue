<template>
  <section>
    <TheAdminCommonPageHeader
      title="Создать тур"
      description="Заполните основные данные тура. Загрузка cover/gallery будет подключена отдельным Blob-этапом."
    />

    <form class="admin-form" @submit.prevent="submitTour">
      <div class="admin-form__grid">
        <UiInput label="Название тура*" placeholder="Например, Алматы weekend" v-model.trim="form.title" />
        <UiInput label="Цена*" placeholder="120000" v-model.trim="form.price" />
        <UiInput label="Скидка" placeholder="10" v-model.trim="form.discount" />
        <UiInput label="Рейтинг" placeholder="4.8" v-model.trim="form.rating" />
      </div>

      <UiTextarea
        class="admin-form__field"
        label="Описание"
        placeholder="Коротко опишите программу тура"
        v-model.trim="form.description"
      />

      <UiFileUpload class="admin-form__field" v-model="files" multiple />

      <button class="admin-form__button" type="submit" :disabled="isLoading">
        {{ isLoading ? "Сохраняем..." : "Создать тур" }}
      </button>

      <p v-if="message" class="admin-form__message">{{ message }}</p>
    </form>
  </section>
</template>

<script setup>
definePageMeta({
  layout: "admin",
  middleware: "admin",
});

const isLoading = ref(false);
const message = ref("");
const files = ref([]);
const form = reactive({
  title: "",
  description: "",
  price: "",
  discount: "",
  rating: "",
});

const submitTour = async () => {
  message.value = "";
  isLoading.value = true;

  try {
    await useApi().client({
      url: "/tours/create",
      method: "post",
      data: {
        title: form.title,
        description: form.description,
        price: Number(form.price) || 0,
        discount: form.discount ? Number(form.discount) : null,
        rating: Number(form.rating) || 0,
      },
    });
    message.value = "Тур создан";
  } catch (error) {
    message.value = error?.message || "Не удалось создать тур";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.admin-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  background: $white;
  border: 1px solid $surface-300;
  border-radius: 8px;

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }

  &__field {
    width: 100%;
  }

  &__button {
    width: fit-content;
    padding: 12px 18px;
    color: $white;
    background: $red-500;
    border-radius: 8px;
    transition:
      background-color 0.2s ease,
      transform 0.2s ease;

    &:hover {
      background: $red-400;
      transform: translateY(-1px);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  }

  &__message {
    color: $red-500;
  }
}

@media (max-width: 700px) {
  .admin-form {
    &__grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
