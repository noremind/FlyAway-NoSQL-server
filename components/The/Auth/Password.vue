<template>
  <section class="password">
    <div class="password__wrapper">
      <img
        class="password__logo"
        src="@/assets/image/logo/FlyAway-logo.png"
        alt="FlyAway"
      />

      <h4 class="password__title">Задайте пароль</h4>

      <form class="password__form">
        <div class="password__form-box">
          <UiInput
            placeholder="Пароль"
            label="Введите пароль*"
            v-model.trim="password"
            :type="isOpenEye ? 'text' : 'password'"
          ></UiInput>
          <UiIcons
            @click="toggleEye"
            :icon="isOpenEye ? 'eye' : 'eye-open'"
            class="password__form-eye"
            size="size-20"
          >
          </UiIcons>
        </div>

        <UiButton
          label="Войти"
          @click="postLogin"
          class="password__btn button-primary"
          :disabled="!disabledBtn"
          :is-loading="isLoading"
        ></UiButton>
      </form>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits(["nextStep"]);
const isOpenEye = ref(false);
const userStore = useAuthStore();

const route = useRoute();

const props = defineProps({
  userId: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
});

const isLoading = ref(false);

const password = ref("");

const disabledBtn = computed(() => {
  return password.value.length > 4 && password.value.length < 35;
});

const toggleEye = () => {
  isOpenEye.value = !isOpenEye.value;
};

const postLogin = () => {
  if (disabledBtn.value) {
    isLoading.value = true;
    let data = {};
    if (route.query?.["reset-password"] === null) {
      data.newPassword = password.value;
      data.phone = props.phone.replace(/\D/g, "");
    } else {
      data.password = password.value;
      data.userId = props.userId;
    }
    useApi()
      .client({
        url:
          route.query?.["reset-password"] !== null
            ? "/users/auth/register/set-password"
            : "/users/reset-password",
        method: "post",
        data,
      })
      .then((res) => {
        userStore.setToken(res.token);
        isLoading.value = false;
        userStore.setUser();
        emit("nextStep");
      });
  }
};
</script>

<style lang="scss" scoped>
.password {
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
    margin: 16px 0;
  }
  &__form {
    max-width: 352px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
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
}
</style>
