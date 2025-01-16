<template>
  <section class="register">
    <div class="register__wrapper">
      <img
        class="register__logo"
        src="@/assets/image/logo/Sapar-time-logo-full.svg"
        alt="Sapartime"
      />

      <h4 class="register__title">Войти</h4>

      <form class="register__form">
        <UiInput
          placeholder="+7 (_ _ _) - _ _ _ - _ _ - _ _"
          label="Номер телефона"
          v-model="phone"
          maska="+7(###)-###-##-##"
        ></UiInput>
        <UiInput
          placeholder="_ _ _ _"
          label="Введите код"
          v-model="code"
        ></UiInput>

        <UiButton
          label="Войти"
          @click="postLogin"
          class="register__btn button-primary"
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

const code = ref("");
const phone = ref("");

const disabledBtn = computed(() => {
  return code.value.length > 3 && phone.value.length === 17;
});

const postLogin = () => {
  if (disabledBtn.value) {
    useApi({
      url: "/auth/login",
      method: "post",
      data: {
        phone: phone.value,
        code: code.value,
      },
    }).then((res) => {
      tokenCookie.value = res.data.token;
      userCookie.value = res.data.user;
      emit("nextStep", phone.value, code.value);
    });
  }
};

watch(
  () => code.value,
  () => {
    nextTick(() => {
      if (code.value.length > 3) {
        code.value = code.value.slice(0, 4);
      }
    });
  }
);
</script>

<style lang="scss" scoped>
.register {
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
