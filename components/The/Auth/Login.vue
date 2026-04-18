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
          placeholder="mail@example.com"
          label="Email"
          v-model.trim="email"
          name="email"
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

        <button
          class="login-user__switch"
          type="button"
          @click="toggleLoginType"
        >
          {{ isPartnerLogin ? "Войти как пользователь" : "Войти как партнер" }}
        </button>

        <UiButton
          :label="isPartnerLogin ? 'Войти как партнер' : 'Войти'"
          class="login-user__btn button-primary"
          :disabled="!disabledBtn"
          :is-loading="isLoading"
          @click="postLogin"
        ></UiButton>
      </form>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits(["nextStep"]);
const userStore = useAuthStore();

const password = ref("");
const email = ref("");
const isPartnerLogin = ref(false);

const isOpenEye = ref(false);

const errorMessage = ref("");
const isLoading = ref(false);

const disabledBtn = computed(() => {
  return password.value.length >= 6 && email.value.includes("@");
});

const toggleEye = () => {
  isOpenEye.value = !isOpenEye.value;
};

const toggleLoginType = () => {
  isPartnerLogin.value = !isPartnerLogin.value;
  errorMessage.value = "";
};

const postLogin = () => {
  if (disabledBtn.value) {
    isLoading.value = true;
    useApi()
      .client({
        url: isPartnerLogin.value ? "/auth/partner-login" : "/auth/login",
        method: "post",
        data: {
          email: email.value,
          password: password.value,
        },
      })
      .then((res) => {
        userStore.setToken(res.token);
        userStore.setUserData(res.user);
        isLoading.value = false;
        emit("nextStep", {
          goTo: res.user?.role === "partner" ? "/admin" : "/profile",
          title:
            res.user?.role === "partner" ? "Вы вошли как партнер" : "Вы вошли",
          btnLabel:
            res.user?.role === "partner"
              ? "Перейти в админ-панель"
              : "Перейти в личный кабинет",
        });
      })
      .catch((error) => {
        isLoading.value = false;
        errorMessage.value = error?.message || "Не удалось войти";
      });
  }
};

watch(
  () => email.value,
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
  &__title {
    font-size: 32px;
    font-weight: 700;
    margin: 16px 0 0;
  }
  &__switch {
    color: $red-500;
    font-size: 14px;
    font-weight: 700;
    transition: color 0.2s ease;
    &:hover {
      color: $orange-200;
    }
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
      top: 36px;
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
