<template>
  <div class="profile-main">
    <div class="profile-main__wrapper">
      <div class="profile-main__side">
        <div class="profile-main__box">
          <img
            class="profile-main__avatar"
            src="@/assets/image/common/avatar-user.jpeg"
            alt="Avatar"
          />
          <div class="profile-main__inner">
            <div class="profile-main__inner-box">
              <UiIcons color="blue-500" icon="upload"></UiIcons>
              <p class="profile-main__box-text profile-main__box-text--upload">
                Загрузить другое фото
              </p>
            </div>
            <div class="profile-main__inner-box" @click="deleteAvatar()">
              <UiIcons color="orange-200" icon="trash" size="size-14"></UiIcons>
              <p class="profile-main__box-text profile-main__box-text--delete">
                Удалить аватарку
              </p>
            </div>
          </div>
        </div>

        <UiInput
          class="profile-main__input"
          label="Ваше имя"
          placeholder="Дана"
          v-model="name"
        ></UiInput>
        <UiInput
          class="profile-main__input"
          label="Номер телефона"
          :placeholder="user.phone"
          maska="+7(###)-###-##-##"
          v-model="phone"
        ></UiInput>

        <UiButton
          class="profile-main__btn button-primary"
          label="Сохранить"
          @click="postProfile"
        ></UiButton>
      </div>
      <div class="profile-main__side">
        <UiInput
          class="profile-main__input profile-main__input--mobile"
          label="Ваше имя"
          v-model="name"
        ></UiInput>

        <UiInput
          class="profile-main__input profile-main__input--mobile"
          label="Номер телефона"
          placeholder="+7 (---) --- -- --"
          v-model="phone"
        ></UiInput>

        <UiInput
          class="profile-main__input profile-main__input--mobile"
          label="Ваша почта"
          :placeholder="email"
          v-model="email"
        ></UiInput>

        <UiCalendar
          label="Дата рождения"
          class="profile-main__calendar"
          v-model="birthDate"
        />

        <UiSelect
          class="profile-main__select"
          v-model="selectedGender"
          :options="genders"
          label="Пол"
        ></UiSelect>

        <UiButton
          class="profile-main__btn profile-main__btn--mobile button-primary"
          label="Сохранить"
          @click="postProfile"
        ></UiButton>
      </div>
    </div>
  </div>
</template>

<script setup>
const userCookie = useCookie("user");
const userStore = useAuthStore();
const user = ref(userStore.getUser);
const name = ref(user.value?.name || null);
const email = ref(user.value?.email || null);
const phone = ref(user.value?.phone || null);
const birthDate = ref(user.value?.birthday || null);
const avatar = ref(user.value?.avatar || null);

const genders = reactive([
  {
    id: 1,
    name: "Мужской",
  },
  {
    id: 2,
    name: "Женский",
  },
]);
const selectedGender = ref(genders[0]);

const postProfile = () => {
  useApi({
    url: "/personal-cabinet/profile",
    method: "post",
    data: {
      name: name.value,
      email: email.value,
      phone: phone.value,
      avatar: null,
      birthday: birthDate.value,
    },
  }).then((res) => {
    userCookie.value = res.data;
  });
};

const deleteAvatar = () => {
  user.value.avatar = null;
};
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
  }
  &__select {
    border-radius: 26px;
    background-color: transparent;
    border: 1px solid $surface-300;
  }
  &__btn {
    margin-top: 16px;
    &--mobile {
      display: none;
    }
  }
  &__calendar {
    border-radius: 26px;
    background-color: transparent;
    border: 1px solid $surface-300;
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
        color: $blue-500;
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
      display: flex;
      gap: 6px;
      align-items: center;
    }
  }
  &__avatar {
    width: 66px;
    height: 66px;
    border-radius: 50%;
    object-fit: cover;
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
    }
  }
}
</style>
