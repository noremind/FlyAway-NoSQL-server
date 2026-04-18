<template>
  <section>
    <TheAdminCommonPageHeader
      title="Создать отель"
      description="Подготовьте отель для каталога: привязка к партнеру, локация, описание и фото."
    />

    <form class="admin-form" @submit.prevent="submitHotel">
      <div class="admin-form__intro">
        <p class="admin-form__eyebrow">Каталог и карточка</p>
        <p class="admin-form__text">
          Отель должен быть готов для списка, детальной страницы и будущего
          бронирования через сайт.
        </p>
      </div>

      <div class="admin-form__grid">
        <UiInput
          label="Название отеля*"
          placeholder="Название"
          v-model.trim="form.name"
        />
        <UiSelect
          label="Партнер*"
          placeholder="Выберите партнера"
          :options="partnerOptions"
          option-label="label"
          option-value="value"
          v-model="selectedPartner"
        />
        <UiInput
          label="Локация*"
          placeholder="Алматы"
          v-model.trim="form.location"
        />
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

      <div class="admin-form__upload">
        <UiFileUpload class="admin-form__field" v-model="files" multiple />
        <button
          class="admin-form__ghost"
          type="button"
          :disabled="isUploading || !files.length"
          @click="uploadImages"
        >
          {{ isUploading ? "Загружаем..." : "Загрузить" }}
        </button>
      </div>

      <div class="admin-form__actions">
        <button class="admin-form__button" type="submit" :disabled="isLoading">
          {{ isLoading ? "Сохраняем..." : "Создать отель" }}
        </button>
      </div>

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
const isUploading = ref(false);
const message = ref("");
const files = ref([]);
const partners = ref([]);
const selectedPartner = ref("");
const images = ref([]);
const { uploadFiles } = useBlobFiles();
const form = reactive({
  name: "",
  location: "",
  description: "",
  content: "",
});

const partnerOptions = computed(() =>
  partners.value.map((partner) => ({
    label: partner.title,
    value: partner._id,
  })),
);

const loadPartners = async () => {
  const response = await useApi().client({ url: "/partners" });
  partners.value = response.data || [];
};

const submitHotel = async () => {
  message.value = "";

  if (!selectedPartner.value) {
    message.value = "Выберите партнера для отеля";
    return;
  }

  isLoading.value = true;

  try {
    await useApi().client({
      url: "/hotels/create",
      method: "post",
      data: {
        name: form.name,
        location: form.location,
        description: form.description,
        content: form.content,
        images: images.value,
        partner: selectedPartner.value,
      },
    });
    message.value = "Отель создан";
    form.name = "";
    form.location = "";
    form.description = "";
    form.content = "";
    files.value = [];
    images.value = [];
    selectedPartner.value = "";
  } catch (error) {
    message.value = error?.message || "Не удалось создать отель";
  } finally {
    isLoading.value = false;
  }
};

const uploadImages = async () => {
  isUploading.value = true;
  message.value = "";

  try {
    const uploaded = await uploadFiles({
      files: files.value,
      bucket: "hotels",
      entityId: selectedPartner.value || "draft",
      scope: "gallery",
    });

    images.value = uploaded.map((item) => item.url).filter(Boolean);
    message.value = "Фото загружены";
  } catch (error) {
    message.value = error?.message || "Не удалось загрузить фото";
  } finally {
    isUploading.value = false;
  }
};

onMounted(async () => {
  try {
    await loadPartners();
  } catch (error) {
    message.value = error?.message || "Не удалось загрузить партнеров";
  }
});
</script>

<style lang="scss" scoped>
.admin-form {
  display: flex;
  flex-direction: column;
  gap: 20px;

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  &__field {
    width: 100%;
  }

  &__intro {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-bottom: 4px;
    border-bottom: 1px solid rgba($red-500, 0.1);
  }

  &__eyebrow {
    color: $red-500;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  &__text {
    color: $surface-500;
    font-size: 14px;
    line-height: 1.5;
  }

  &__actions {
    display: flex;
    justify-content: flex-start;
  }

  &__upload {
    display: grid;
    gap: 10px;
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
    font-size: 14px;
    font-weight: 600;
  }

  &__ghost {
    width: fit-content;
    min-height: 40px;
    padding: 0 14px;
    color: $red-500;
    background: rgba($red-500, 0.06);
    border: 1px solid rgba($red-500, 0.14);
    border-radius: 10px;
    font-size: 14px;
    font-weight: 700;
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
