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
        <UiInput
          placeholder="Пароль"
          label="Введите пароль*"
          v-model.trim="password"
          :type="'password'"
        ></UiInput>

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

const props = defineProps({
  userId: {
    type: String,
    default: "",
  },
});

const tokenCookie = useCookie("token");

const errorMessage = ref("");
const isLoading = ref(false);

const password = ref("");

const disabledBtn = computed(() => {
  return password.value.length > 4 && password.value.length < 35;
});

const postLogin = () => {
  if (disabledBtn.value) {
    isLoading.value = true;
    useApi({
      url: "/users/auth/register/set-password",
      method: "post",
      data: {
        userId: props.userId,
        password: password.value,
      },
    }).then((res) => {
      tokenCookie.value = res.token;
      isLoading.value = false;
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
  }
  &__logo {
    width: 64px;
  }
}
</style>
