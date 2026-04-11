<template>
  <section>
    <TheAdminCommonPageHeader
      title="Создать отель"
      description="Основные данные отеля. Изображения сейчас выбираются в UI, а сохранение в Vercel Blob подключается следующим этапом."
    />

    <form class="admin-form" @submit.prevent="submitHotel">
      <div class="admin-form__grid">
        <UiInput label="Название отеля*" placeholder="Название" v-model.trim="form.name" />
        <UiInput label="Локация*" placeholder="Алматы" v-model.trim="form.location" />
        <UiInput label="Рейтинг" placeholder="4.8" v-model.trim="form.rating" />
      </div>

      <UiTextarea
        class="admin-form__field"
        label="Описание*"
        placeholder="Описание отеля"
        v-model.trim="form.description"
      />

      <UiTextarea
        class="admin-form__field"
        label="Контент*"
        placeholder="Детальная информация"
        v-model.trim="form.content"
      />

      <UiFileUpload class="admin-form__field" v-model="files" multiple />

      <button class="admin-form__button" type="submit" :disabled="isLoading">
        {{ isLoading ? "Сохраняем..." : "Создать отель" }}
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
  name: "",
  location: "",
  rating: "",
  description: "",
  content: "",
});

const submitHotel = async () => {
  message.value = "";
  isLoading.value = true;

  try {
    await useApi().client({
      url: "/hotels/create",
      method: "post",
      data: {
        name: form.name,
        location: form.location,
        rating: Number(form.rating) || 0,
        description: form.description,
        content: form.content,
      },
    });
    message.value = "Отель создан";
  } catch (error) {
    message.value = error?.message || "Не удалось создать отель";
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
    grid-template-columns: repeat(3, minmax(0, 1fr));
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

@media (max-width: 800px) {
  .admin-form {
    &__grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
