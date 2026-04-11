<template>
  <UiModal
    :is-show="isShow"
    max-width="720px"
    title="Стать партнером"
    @close="emit('close')"
  >
    <form class="partner-form" @submit.prevent="submitPartner">
      <div class="partner-form__grid">
        <UiInput
          label="Название компании"
          placeholder="FlyAway Travel"
          v-model.trim="form.title"
          :is-error="!!errors.title"
        />
        <UiInput
          label="Почта партнера"
          placeholder="partner@example.com"
          v-model.trim="form.email"
          :is-error="!!errors.email"
        />
        <UiInput
          label="Телефон"
          placeholder="8 (___) ___ __ __"
          maska="8(###)-###-##-##"
          v-model.trim="form.phone"
          :is-error="!!errors.phone"
        />
        <UiInput
          label="Пароль партнера"
          placeholder="Минимум 6 символов"
          type="password"
          v-model.trim="form.password"
          :is-error="!!errors.password"
        />
        <UiInput
          label="БИН"
          placeholder="000000000000"
          v-model.trim="form.bin"
          :is-error="!!errors.bin"
        />
        <UiInput
          label="Имя владельца"
          placeholder="Иван Иванов"
          v-model.trim="form.ownerName"
          :is-error="!!errors.ownerName"
        />
      </div>

      <UiInput
        label="Адрес"
        placeholder="Город, улица, дом"
        v-model.trim="form.address"
        :is-error="!!errors.address"
      />

      <UiFileUpload
        v-model="logoFiles"
        title="Логотип компании"
        accept="image/png,image/jpeg,image/webp"
      />

      <p v-if="errorMessage" class="partner-form__error">
        {{ errorMessage }}
      </p>

      <div class="partner-form__actions">
        <UiButton
          label="Отмена"
          class="partner-form__btn"
          @click="emit('close')"
        />
        <UiButton
          label="Создать партнера"
          class="partner-form__btn button-primary"
          :disabled="isLoading"
          :is-loading="isLoading"
          @click="submitPartner"
        />
      </div>
    </form>
  </UiModal>
</template>

<script setup>
const props = defineProps({
  isShow: Boolean,
});

const emit = defineEmits(["close", "created"]);

const form = reactive({
  title: "",
  email: "",
  phone: "",
  password: "",
  bin: "",
  ownerName: "",
  address: "",
});

const logoFiles = ref([]);
const errors = reactive({});
const errorMessage = ref("");
const isLoading = ref(false);

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const buildLogoFile = async () => {
  const file = logoFiles.value?.[0];

  if (!file) return null;

  return {
    fileName: file.name,
    mimeType: file.type,
    size: file.size,
    base64Data: await fileToBase64(file),
  };
};

const validate = () => {
  Object.keys(errors).forEach((key) => {
    errors[key] = "";
  });

  const requiredFields = [
    "title",
    "email",
    "phone",
    "password",
    "bin",
    "ownerName",
    "address",
  ];

  requiredFields.forEach((field) => {
    if (!form[field]?.trim()) {
      errors[field] = "Заполните поле";
    }
  });

  if (form.email && !form.email.includes("@")) {
    errors.email = "Введите корректную почту";
  }

  if (form.password && form.password.length < 6) {
    errors.password = "Минимум 6 символов";
  }

  return !Object.values(errors).some(Boolean);
};

const submitPartner = async () => {
  if (isLoading.value || !validate()) return;

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const logoFile = await buildLogoFile();
    const response = await useApi().client({
      url: "/partners/apply",
      method: "post",
      data: {
        ...form,
        logoFile,
      },
    });

    emit("created", response);
  } catch (error) {
    errorMessage.value =
      error?.message || "Не удалось создать профиль партнера";
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => ({ ...form }),
  () => {
    errorMessage.value = "";
  },
);
</script>

<style lang="scss" scoped>
.partner-form {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }

  &__btn {
    min-height: 44px;
  }

  &__error {
    color: $orange-200;
    font-size: 14px;
  }
}

@media (max-width: 640px) {
  .partner-form {
    &__grid {
      grid-template-columns: 1fr;
    }

    &__actions {
      flex-direction: column;
    }
  }
}
</style>
