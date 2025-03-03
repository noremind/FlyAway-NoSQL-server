<template>
  <section class="login-user">
    <div class="login-user__wrapper">
      <img
        class="login-user__logo"
        src="@/assets/image/logo/FlyAway-logo.png"
        alt="TravelTime"
      />

      <h4 class="login-user__title">Войти</h4>

      <form class="login-user__form">
        <UiInput
          placeholder="+7 (_ _ _) - _ _ _ - _ _ - _ _"
          label="Номер телефона"
          v-model="phone"
          maska="+7(###)-###-##-##"
        ></UiInput>
        <UiInput
          placeholder="Пароль"
          label="Введите пароль"
          v-model="password"
          :type="'password'"
        ></UiInput>

        <UiButton
          label="Войти"
          @click="postLogin"
          class="login-user__btn button-primary"
          :disabled="!disabledBtn"
        ></UiButton>
      </form>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits(["nextStep"]);

const tokenCookie = useCookie("token");
const userCookie = useCookie("user");

const password = ref("");
const phone = ref("");

const disabledBtn = computed(() => {
  return password.value.length > 3 && phone.value.length === 17;
});

const postLogin = () => {
  if (disabledBtn.value) {
    useApi({
      url: "/auth/login",
      method: "post",
      data: {
        phone: phone.value,
        password: password.value,
      },
    }).then((res) => {
      tokenCookie.value = res.data.token;
      userCookie.value = res.data.user;
      emit("nextStep", phone.value, password.value);
    });
  }
};

watch(
  () => password.value,
  () => {
    nextTick(() => {
      if (password.value.length > 3) {
        password.value = password.value.slice(0, 4);
      }
    });
  }
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
    margin: 16px 0;
  }
  &__form {
    max-width: 352px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}
</style>
