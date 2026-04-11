<template>
  <section>
    <TheAdminCommonPageHeader
      title="Профиль партнера"
      description="Данные компании, контакты и логотип для публичных страниц FlyAway."
    />

    <div v-if="user?.role !== 'partner'" class="partner-profile__empty">
      Профиль партнера доступен после входа как партнер.
    </div>

    <form
      v-else
      class="partner-profile"
      @submit.prevent="savePartnerProfile"
    >
      <div class="partner-profile__grid">
        <UiInput label="Название компании" v-model.trim="form.title" />
        <UiInput label="Почта партнера" v-model.trim="form.email" />
        <UiInput
          label="Телефон"
          maska="8(###)-###-##-##"
          v-model.trim="form.phone"
        />
        <UiInput label="БИН" v-model.trim="form.bin" />
        <UiInput label="Имя владельца" v-model.trim="form.ownerName" />
        <UiInput
          label="Новый пароль"
          placeholder="Оставьте пустым, если не меняете"
          type="password"
          v-model.trim="form.password"
        />
      </div>

      <UiInput label="Адрес" v-model.trim="form.address" />
      <UiTextarea
        label="Описание"
        placeholder="Коротко о компании"
        v-model="form.description"
      />

      <div v-if="form.logo" class="partner-profile__logo">
        <img :src="form.logo" alt="Логотип партнера" />
      </div>

      <UiFileUpload
        v-model="logoFiles"
        title="Заменить логотип"
        accept="image/png,image/jpeg,image/webp"
      />

      <p v-if="message" class="partner-profile__message">
        {{ message }}
      </p>
      <p v-if="errorMessage" class="partner-profile__error">
        {{ errorMessage }}
      </p>

      <UiButton
        label="Сохранить"
        class="partner-profile__button button-primary"
        :is-loading="isLoading"
        @click="savePartnerProfile"
      />
    </form>
  </section>
</template>

<script setup>
definePageMeta({
  layout: "admin",
  middleware: "admin",
});

const userStore = useAuthStore();
const user = computed(() => userStore.getUser);
const logoFiles = ref([]);
const isLoading = ref(false);
const message = ref("");
const errorMessage = ref("");

const form = reactive({
  title: "",
  email: "",
  phone: "",
  password: "",
  bin: "",
  ownerName: "",
  address: "",
  description: "",
  logo: "",
});

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

const fillForm = (partner) => {
  form.title = partner?.title || "";
  form.email = partner?.email || "";
  form.phone = partner?.contacts?.phone || "";
  form.bin = partner?.bin || "";
  form.ownerName = partner?.ownerName || "";
  form.address = partner?.contacts?.address || "";
  form.description = partner?.description || "";
  form.logo = partner?.logo || partner?.avatar || "";
};

const loadPartnerProfile = async () => {
  if (user.value?.role !== "partner") return;

  try {
    const response = await useApi().client({ url: "/partners/me" });
    fillForm(response.data);
  } catch (error) {
    errorMessage.value =
      error?.message || "Не удалось загрузить профиль партнера";
  }
};

const savePartnerProfile = async () => {
  if (isLoading.value || user.value?.role !== "partner") return;

  isLoading.value = true;
  message.value = "";
  errorMessage.value = "";

  try {
    const logoFile = await buildLogoFile();
    const payload = {
      title: form.title,
      email: form.email,
      phone: form.phone,
      bin: form.bin,
      ownerName: form.ownerName,
      address: form.address,
      description: form.description,
      logo: form.logo,
      logoFile,
    };

    if (form.password) {
      payload.password = form.password;
    }

    const response = await useApi().client({
      url: "/partners/me",
      method: "patch",
      data: payload,
    });

    fillForm(response.data);
    logoFiles.value = [];
    form.password = "";
    message.value = "Профиль партнера обновлен";
  } catch (error) {
    errorMessage.value =
      error?.message || "Не удалось сохранить профиль партнера";
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadPartnerProfile);
</script>

<style lang="scss" scoped>
.partner-profile,
.partner-profile__empty {
  padding: 20px;
  background: $white;
  border-radius: 8px;
}

.partner-profile {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  &__logo {
    width: 120px;
    height: 120px;
    overflow: hidden;
    border: 1px solid $surface-300;
    border-radius: 8px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__message {
    color: $green-400;
    font-size: 14px;
  }

  &__error {
    color: $orange-200;
    font-size: 14px;
  }

  &__button {
    justify-content: center;
    width: fit-content;
    min-height: 44px;
  }
}

@media (max-width: 700px) {
  .partner-profile {
    &__grid {
      grid-template-columns: 1fr;
    }

    &__button {
      width: 100%;
    }
  }
}
</style>
