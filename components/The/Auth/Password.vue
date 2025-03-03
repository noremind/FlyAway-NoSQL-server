<template>
  <section class="password">
    <div class="password__wrapper">
      <img
        class="password__logo"
        src="@/assets/image/logo/FlyAway-logo.png"
        alt="TravelTime"
      />

      <h4 class="password__title">Задайте пароль</h4>

      <form class="password__form">
        <UiInput
          placeholder="Пароль"
          label="Введите пароль"
          v-model="password"
          :type="'password'"
        ></UiInput>

        <UiButton
          label="Войти"
          @click="postLogin"
          class="password__btn button-primary"
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

const disabledBtn = computed(() => {
  return password.value.length > 3;
});

const postLogin = () => {
  if (disabledBtn.value) {
    useApi({
      url: "/auth/login",
      method: "post",
      data: {
        password: password.value,
      },
    }).then((res) => {
      tokenCookie.value = res.data.token;
      userCookie.value = res.data.user;
      emit("nextStep", password.value);
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
}
</style>
