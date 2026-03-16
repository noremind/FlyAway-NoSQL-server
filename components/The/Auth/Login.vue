<template>
  <section class="login-user">
    <div class="login-user__wrapper">
      <img
        class="login-user__logo"
        src="@/assets/image/logo/FlyAway-logo.png"
        alt="FlyAway"
      />

      <h4 class="login-user__title">Войти</h4>

      <form class="login-user__form">
        <UiInput
          placeholder="8 (_ _ _) - _ _ _ - _ _ - _ _"
          label="Номер телефона"
          v-model.trim="phone"
          maska="8(###)-###-##-##"
          name="phone"
          :is-error="!!errorMessage"
        ></UiInput>
        <div class="login-user__form-box">
          <UiInput
            placeholder="Пароль"
            label="Введите пароль"
            v-model.trim="password"
            :type="isOpenEye ? 'text' : 'password'"
            name="password"
            :is-error="!!errorMessage"
          ></UiInput>
          <UiIcons
            @click="toggleEye"
            :icon="isOpenEye ? 'eye' : 'eye-open'"
            class="login-user__form-eye"
            size="size-20"
          >
          </UiIcons>

          <p class="login-user__error" v-if="errorMessage">
            {{ errorMessage }}
          </p>
        </div>

        <p @click="emit('forgetPassword')" class="login-user__forget-password">
          Забыли пароль?
        </p>

        <UiButton
          label="Войти"
          @click="postLogin"
          class="login-user__btn button-primary"
          :disabled="!disabledBtn"
          :is-loading="isLoading"
        ></UiButton>
      </form>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits(["nextStep", "forgetPassword"]);
const userStore = useAuthStore();

const password = ref("");
const phone = ref("");

const isOpenEye = ref(false);

const errorMessage = ref("");
const isLoading = ref(false);

const disabledBtn = computed(() => {
  return (
    password.value.length > 3 &&
    password.value.length < 25 &&
    phone.value.length === 16
  );
});

const toggleEye = () => {
  isOpenEye.value = !isOpenEye.value;
};

const postLogin = () => {
  if (disabledBtn.value) {
    isLoading.value = true;
    useApi()
      .client({
        url: "/users/auth/login",
        method: "post",
        data: {
          phone: phone.value.replace(/\D/g, ""),
          password: password.value,
        },
      })
      .then((res) => {
        userStore.setToken(res.token);
        userStore.setUser();
      })
      .then(() => {
        isLoading.value = false;
        emit("nextStep");
      })
      .catch((error) => {
        isLoading.value = false;
        errorMessage.value = error.message;
      });
  }
};

watch(
  () => phone.value,
  () => {
    errorMessage.value = "";
  },
);

watch(
  () => password.value,
  () => {
    errorMessage.value = "";
  },
);
</script>

<style lang="scss" scoped>
.login-user {
  &__wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 26px;
    padding: 40px 0 60px 0;
  }
  &__forget-password {
    color: $red-500;
    cursor: pointer;
    text-align: center;
    font-size: 12px;
  }
  &__title {
    font-size: 32px;
    font-weight: 700;
    margin: 16px 0;
  }
  &__form {
    max-width: 352px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
    &-box {
      position: relative;
    }
    &-eye {
      position: absolute;
      top: 28px;
      right: 13px;
      cursor: pointer;
    }
  }
  &__logo {
    width: 64px;
  }
  &__error {
    font-size: 14px;
    color: $orange-200;
  }
}
</style>
