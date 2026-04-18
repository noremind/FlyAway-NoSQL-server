<template>
  <section class="admin-profile">
    <TheAdminCommonPageHeader
      :title="isPartnerSession ? 'Профиль партнера' : 'Мой профиль'"
      :description="
        isPartnerSession
          ? 'Данные компании, контакты и логотип для витрины и кабинета партнера.'
          : 'Личные данные администратора и аватар профиля.'
      "
    />

    <form v-if="!isPartnerSession" class="admin-profile__card" @submit.prevent="saveUserProfile">
      <div class="admin-profile__identity">
        <img
          v-if="userForm.avatar"
          class="admin-profile__avatar"
          :src="userForm.avatar"
          alt="Аватар"
        />
        <span v-else class="admin-profile__avatar admin-profile__avatar--empty">
          {{ userInitial }}
        </span>

        <div class="admin-profile__identity-actions">
          <label class="admin-profile__action admin-profile__action--upload">
            Загрузить аватар
            <input
              class="admin-profile__file"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              @change="handleUserAvatarChange"
            />
          </label>
          <button class="admin-profile__action admin-profile__action--danger" type="button" @click="removeUserAvatar">
            Удалить
          </button>
        </div>
      </div>

      <div class="admin-profile__grid">
        <UiInput label="Имя" v-model.trim="userForm.name" />
        <UiInput label="Почта" :model-value="userForm.email" disabled />
        <UiInput label="Телефон" v-model.trim="userForm.phone" />
      </div>

      <div class="admin-profile__actions">
        <button class="admin-profile__submit" type="submit" :disabled="isLoading">
          {{ isLoading ? "Сохраняем..." : "Сохранить профиль" }}
        </button>
      </div>
    </form>

    <form v-else class="admin-profile__card" @submit.prevent="savePartnerProfile">
      <div class="admin-profile__identity">
        <img
          v-if="partnerForm.logo"
          class="admin-profile__avatar admin-profile__avatar--logo"
          :src="partnerForm.logo"
          alt="Логотип"
        />
        <span v-else class="admin-profile__avatar admin-profile__avatar--logo admin-profile__avatar--empty">
          {{ partnerInitial }}
        </span>

        <div class="admin-profile__identity-actions">
          <label class="admin-profile__action admin-profile__action--upload">
            Загрузить логотип
            <input
              class="admin-profile__file"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              @change="handlePartnerLogoChange"
            />
          </label>
          <button class="admin-profile__action admin-profile__action--danger" type="button" @click="removePartnerLogo">
            Удалить
          </button>
        </div>
      </div>

      <div class="admin-profile__grid">
        <UiInput label="Название компании" v-model.trim="partnerForm.title" />
        <UiInput label="Почта партнера" v-model.trim="partnerForm.email" />
        <UiInput label="Телефон" maska="8(###)-###-##-##" v-model.trim="partnerForm.phone" />
        <UiInput label="БИН" v-model.trim="partnerForm.bin" />
        <UiInput label="Имя владельца" v-model.trim="partnerForm.ownerName" />
        <UiInput
          label="Новый пароль"
          placeholder="Оставьте пустым, если не меняете"
          type="password"
          v-model.trim="partnerForm.password"
        />
      </div>

      <UiInput label="Адрес" v-model.trim="partnerForm.address" />
      <UiTextarea
        label="Описание"
        placeholder="Коротко о компании"
        v-model="partnerForm.description"
      />

      <div class="admin-profile__actions">
        <button class="admin-profile__submit" type="submit" :disabled="isLoading">
          {{ isLoading ? "Сохраняем..." : "Сохранить профиль партнера" }}
        </button>
      </div>
    </form>

    <p v-if="message" class="admin-profile__message">{{ message }}</p>
    <p v-if="errorMessage" class="admin-profile__error">{{ errorMessage }}</p>
  </section>
</template>

<script setup>
definePageMeta({
  layout: "admin",
  middleware: "admin",
});

const authStore = useAuthStore();
const userCookie = useCookie("user");
const { fileToBase64 } = useBlobFiles();

const isLoading = ref(false);
const message = ref("");
const errorMessage = ref("");
const user = computed(() => authStore.getUser);
const isPartnerSession = computed(() => user.value?.role === "partner");
const userInitial = computed(() => String(userForm.name || user.value?.name || "U").charAt(0).toUpperCase());
const partnerInitial = computed(() => String(partnerForm.title || "P").charAt(0).toUpperCase());

const userAvatarFile = ref(null);
const partnerLogoFile = ref(null);

const userForm = reactive({
  name: "",
  email: "",
  phone: "",
  avatar: "",
});

const partnerForm = reactive({
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

const fillUserForm = (payload) => {
  userForm.name = payload?.name || "";
  userForm.email = payload?.email || "";
  userForm.phone = payload?.phone || "";
  userForm.avatar = payload?.avatar || "";
};

const fillPartnerForm = (partner) => {
  partnerForm.title = partner?.title || "";
  partnerForm.email = partner?.email || "";
  partnerForm.phone = partner?.contacts?.phone || "";
  partnerForm.password = "";
  partnerForm.bin = partner?.bin || "";
  partnerForm.ownerName = partner?.ownerName || "";
  partnerForm.address = partner?.contacts?.address || "";
  partnerForm.description = partner?.description || "";
  partnerForm.logo = partner?.logo || partner?.avatar || "";
};

const handleUserAvatarChange = (event) => {
  const file = event.target.files?.[0] || null;
  if (!file) return;
  userAvatarFile.value = file;
  userForm.avatar = URL.createObjectURL(file);
};

const removeUserAvatar = () => {
  userAvatarFile.value = null;
  userForm.avatar = null;
};

const handlePartnerLogoChange = (event) => {
  const file = event.target.files?.[0] || null;
  if (!file) return;
  partnerLogoFile.value = file;
  partnerForm.logo = URL.createObjectURL(file);
};

const removePartnerLogo = () => {
  partnerLogoFile.value = null;
  partnerForm.logo = null;
};

const loadPartnerProfile = async () => {
  const response = await useApi().client({ url: "/partners/me" });
  fillPartnerForm(response.data);
};

const saveUserProfile = async () => {
  isLoading.value = true;
  message.value = "";
  errorMessage.value = "";

  try {
    const payload = {
      name: userForm.name,
      phone: userForm.phone,
    };

    if (userAvatarFile.value) {
      payload.avatarFile = {
        fileName: userAvatarFile.value.name,
        mimeType: userAvatarFile.value.type,
        size: userAvatarFile.value.size,
        base64Data: await fileToBase64(userAvatarFile.value),
      };
    } else if (userForm.avatar === null) {
      payload.avatar = null;
    }

    const response = await useApi().client({
      url: "/users/update",
      method: "put",
      data: payload,
    });

    authStore.setUserData(response.data);
    userCookie.value = response.data;
    fillUserForm(response.data);
    userAvatarFile.value = null;
    message.value = "Профиль обновлен";
  } catch (error) {
    errorMessage.value = error?.message || "Не удалось сохранить профиль";
  } finally {
    isLoading.value = false;
  }
};

const savePartnerProfile = async () => {
  isLoading.value = true;
  message.value = "";
  errorMessage.value = "";

  try {
    const payload = {
      title: partnerForm.title,
      email: partnerForm.email,
      phone: partnerForm.phone,
      bin: partnerForm.bin,
      ownerName: partnerForm.ownerName,
      address: partnerForm.address,
      description: partnerForm.description,
      logo: partnerForm.logo,
    };

    if (partnerForm.password) {
      payload.password = partnerForm.password;
    }

    if (partnerLogoFile.value) {
      payload.logoFile = {
        fileName: partnerLogoFile.value.name,
        mimeType: partnerLogoFile.value.type,
        size: partnerLogoFile.value.size,
        base64Data: await fileToBase64(partnerLogoFile.value),
      };
    } else if (partnerForm.logo === null) {
      payload.logo = null;
    }

    const response = await useApi().client({
      url: "/partners/me",
      method: "patch",
      data: payload,
    });

    const nextUser = {
      ...authStore.getUser,
      partner: response.data,
    };
    authStore.setUserData(nextUser);
    userCookie.value = nextUser;
    fillPartnerForm(response.data);
    partnerLogoFile.value = null;
    message.value = "Профиль партнера обновлен";
  } catch (error) {
    errorMessage.value = error?.message || "Не удалось сохранить профиль партнера";
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  try {
    fillUserForm(user.value);

    if (isPartnerSession.value) {
      await loadPartnerProfile();
    }
  } catch (error) {
    errorMessage.value = error?.message || "Не удалось загрузить профиль";
  }
});
</script>

<style lang="scss" scoped>
.admin-profile {
  display: grid;
  gap: 16px;

  &__card {
    display: grid;
    gap: 18px;
  }

  &__identity {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  &__avatar {
    width: 84px;
    height: 84px;
    object-fit: cover;
    border-radius: 50%;
    border: 1px solid rgba($red-500, 0.1);

    &--empty {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: $white;
      background: $red-500;
      font-size: 28px;
      font-weight: 700;
    }

    &--logo {
      border-radius: 16px;
    }
  }

  &__identity-actions {
    display: grid;
    gap: 8px;
  }

  &__action {
    position: relative;
    width: fit-content;
    min-height: 38px;
    display: inline-flex;
    align-items: center;
    padding: 0 14px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 700;

    &--upload {
      color: $red-500;
      background: rgba($red-500, 0.06);
    }

    &--danger {
      color: $orange-200;
      background: rgba($orange-200, 0.08);
    }
  }

  &__file {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  &__actions {
    display: flex;
  }

  &__submit {
    min-height: 46px;
    padding: 0 18px;
    color: $white;
    background: $red-500;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 700;
  }

  &__message {
    color: $green-400;
    font-size: 14px;
    font-weight: 600;
  }

  &__error {
    color: $orange-200;
    font-size: 14px;
    font-weight: 600;
  }
}

@media (max-width: 700px) {
  .admin-profile {
    &__identity,
    &__grid,
    &__actions {
      grid-template-columns: 1fr;
    }

    &__identity {
      flex-direction: column;
      align-items: flex-start;
    }

    &__submit {
      width: 100%;
    }
  }
}
</style>
