<template>
  <div class="profile-main">
    <div class="profile-main__wrapper">
      <div class="profile-main__side">
        <div class="profile-main__box">
          <img
            v-if="avatar"
            class="profile-main__avatar"
            :src="avatar"
            alt="Avatar"
          />
          <span v-else class="profile-main__avatar profile-main__avatar--empty">
            {{ userInitial }}
          </span>
          <div class="profile-main__inner">
            <label class="profile-main__inner-box">
              <UiIcons color="red-500" icon="upload"></UiIcons>
              <p class="profile-main__box-text profile-main__box-text--upload">
                Загрузить другое фото
              </p>
              <input
                class="profile-main__file"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                @change="handleAvatarChange"
              />
            </label>
            <div class="profile-main__inner-box" @click="deleteAvatar()">
              <UiIcons color="orange-200" icon="trash" size="size-14"></UiIcons>
              <p class="profile-main__box-text profile-main__box-text--delete">
                Удалить аватарку
              </p>
            </div>
          </div>
        </div>

        <div>
          <UiInput
            class="profile-main__input"
            label="Ваше имя*"
            placeholder="Дана"
            v-model.trim="name"
          ></UiInput>
          <p class="profile-main__input-error" v-if="errorMessage.name">
            {{ errorMessage.name }}
          </p>
        </div>
        <UiInput
          class="profile-main__input"
          label="Номер телефона*"
          maska="8(###)-###-##-##"
          v-model.trim="phone"
          :disabled="true"
        ></UiInput>

        <UiButton
          class="profile-main__btn button-primary"
          label="Сохранить"
          @click="postProfile"
          :is-loading="isLoading"
        ></UiButton>

        <UiButton
          v-if="userStore.getUser?.role !== 'partner'"
          class="profile-main__btn profile-main__btn--partner"
          label="Стать партнером"
          @click="openPartnerModal"
        ></UiButton>
      </div>
      <div class="profile-main__side">
        <UiInput
          class="profile-main__input profile-main__input--mobile"
          label="Ваше имя*"
          v-model.trim="name"
        ></UiInput>

        <div>
          <UiInput
            class="profile-main__input"
            label="Ваша почта*"
            v-model.trim="email"
            placeholder="Не указан"
            :disabled="true"
          ></UiInput>
        </div>

        <UiInput
          class="profile-main__input profile-main__input--mobile"
          label="Номер телефона*"
          placeholder="8 (___) ___ __ __"
          v-model.trim="phone"
        ></UiInput>

        <UiInput
          class="profile-main__input profile-main__input--mobile"
          label="Ваша почта"
          :placeholder="email"
          v-model.trim="email"
          :disabled="true"
        ></UiInput>

        <UiCalendar
          label="Дата рождения"
          class="profile-main__calendar"
          placeholder="dd.mm.yyyy"
          v-model.trim="birthDate"
        />

        <UiSelect
          class="profile-main__select"
          v-model.trim="selectedGender"
          :options="genders.slice(0, 3)"
          label="Пол"
          placeholder="Не указан"
        ></UiSelect>

        <UiButton
          class="profile-main__btn profile-main__btn--mobile button-primary"
          label="Сохранить"
          @click="postProfile"
          :is-loading="isLoading"
        ></UiButton>

        <UiButton
          v-if="userStore.getUser?.role !== 'partner'"
          class="profile-main__btn profile-main__btn--mobile"
          label="Стать партнером"
          @click="openPartnerModal"
        ></UiButton>
      </div>
    </div>

    <TheProfileBecomePartnerModal
      :is-show="isPartnerModalOpen"
      @close="closePartnerModal"
      @created="handlePartnerCreated"
    />
  </div>
</template>

<script setup>
const userCookie = useCookie("user");
const userStore = useAuthStore();
const { fileToBase64 } = useBlobFiles();
const user = ref(userStore.getUser);
const name = ref(user.value?.name || null);
const email = ref(user.value?.email || null);
const phone = ref(user.value?.phone || null);
const birthDate = ref(user.value?.birthday || null);
const avatar = ref(user.value?.avatar || null);
const avatarFile = ref(null);
const userInitial = computed(() =>
  String(name.value || user.value?.name || "U")
    .charAt(0)
    .toUpperCase(),
);

const isLoading = ref(false);
const isPartnerModalOpen = ref(false);

const genders = reactive([
  {
    id: 1,
    name: "Мужской",
    value: "men",
  },
  {
    id: 2,
    name: "Женский",
    value: "woman",
  },
  {
    id: 3,
    name: "Другой",
    value: "another",
  },
  {
    id: 4,
    name: "Не указан",
    value: null,
  },
]);
const selectedGender = ref(genders[3]);

const errorMessage = reactive({
  name: "",
});

const checkFields = () => {
  if (
    !String(name.value || "").trim() ||
    String(name.value || "").trim().length < 2
  ) {
    errorMessage.name = "Минимум 2 букв";
    return false;
  }
  return true;
};

const postProfile = async () => {
  if (checkFields()) {
    isLoading.value = true;
    const formatBirthdate = formatBirthDate(birthDate.value);
    try {
      const payload = {
        name: name.value,
        phone: phone.value,
        birthDate: formatBirthdate,
        gender: selectedGender.value.value,
      };

      if (avatarFile.value) {
        payload.avatarFile = {
          fileName: avatarFile.value.name,
          mimeType: avatarFile.value.type,
          size: avatarFile.value.size,
          base64Data: await fileToBase64(avatarFile.value),
        };
      } else if (avatar.value === null) {
        payload.avatar = null;
      }

      const res = await useApi().client({
        url: "/users/update",
        method: "put",
        data: payload,
      });

      userStore.setUserData(res.data);
      userCookie.value = res.data;
      user.value = res.data;
      avatar.value = res.data.avatar || null;
      avatarFile.value = null;
    } finally {
      isLoading.value = false;
    }
  }
};

const deleteAvatar = () => {
  avatar.value = null;
  avatarFile.value = null;
};

const handleAvatarChange = (event) => {
  const file = event.target.files?.[0] || null;

  if (!file) return;

  avatarFile.value = file;
  avatar.value = URL.createObjectURL(file);
};

const openPartnerModal = () => {
  isPartnerModalOpen.value = true;
};

const closePartnerModal = () => {
  isPartnerModalOpen.value = false;
};

const handlePartnerCreated = () => {
  closePartnerModal();
  userStore.logoutUser("/");
};

watch(
  () => name.value,
  () => {
    errorMessage.name = "";
  },
);

watch(
  () => userStore.getUser,
  (nextUser) => {
    user.value = nextUser;
    name.value = nextUser?.name || null;
    email.value = nextUser?.email || null;
    phone.value = nextUser?.phone || null;
    birthDate.value = nextUser?.birthday || nextUser?.birthDate || null;
    avatar.value = nextUser?.avatar || null;
    selectedGender.value =
      genders.find((gender) => gender.value === nextUser?.gender) || genders[3];
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
.profile-main {
  &__wrapper {
    display: flex;
    justify-content: space-between;
    gap: 46px;
    margin: 12px 0;
    background-color: $white;
    padding: 16px;
    border-radius: 16px;
  }
  &__side {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    height: 100%;
    &:last-child {
      margin-top: 14px;
    }
  }
  &__input {
    display: block;
    &--mobile {
      display: none;
    }
    &-error {
      color: $orange-200;
      font-size: 14px;
      &--mobile {
        display: none;
      }
    }
  }
  &__select {
    border-radius: 26px;
    background-color: transparent;
  }
  &__btn {
    margin-top: 16px;
    &--partner {
      justify-content: center;
      color: $red-500;
      border: 1px solid $red-500;
    }
    &--mobile {
      display: none;
    }
  }
  &__calendar {
    border-radius: 26px;
    background-color: transparent;
    width: 100%;
    padding: 4px;
    &-text {
      color: $surface-900;
      font-size: 14px;
      font-weight: 400;
    }
  }
  &__box {
    display: flex;
    gap: 12px;
    align-items: center;
    &-text {
      font-size: 12px;
      cursor: pointer;
      &--upload {
        color: $red-500;
      }
      &--delete {
        color: $orange-200;
      }
    }
  }
  &__inner {
    display: flex;
    gap: 8px;
    flex-direction: column;
    &-box {
      position: relative;
      display: flex;
      gap: 6px;
      align-items: center;
    }
  }
  &__file {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }
  &__avatar {
    width: 66px;
    height: 66px;
    border-radius: 50%;
    object-fit: cover;

    &--empty {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: $white;
      background: $red-500;
      font-size: 24px;
      font-weight: 700;
    }
  }
}

@media (max-width: 375px) {
  .profile-main {
    padding: 0;
    &__wrapper {
      display: flex;
      flex-direction: column;
      background-color: transparent;
      padding: 0;
      gap: 12px;
    }
    &__side:last-child,
    &__box {
      padding: 16px;
      border-radius: 16px;
      box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
      background-color: $white;
    }
    &__btn,
    &__input {
      display: none;
    }
    &__select,
    &__calendar {
      display: block;
    }
    &__btn {
      &--mobile {
        display: flex;
      }
    }
    &__input {
      &--mobile {
        display: block;
      }
      &-error {
        &--mobile {
          display: block;
        }
      }
    }
  }
}
</style>
