<template>
  <section class="register">
    <div class="register__wrapper">
      <img
        class="register__logo"
        src="@/assets/image/logo/FlyAway-logo.png"
        alt="FlyAway"
      />

      <h4 class="register__title">Регистрация</h4>

      <form class="register__form">
        <UiInput
          placeholder="Введите"
          label="Ваше имя*"
          v-model.trim="name"
        ></UiInput>
        <div>
          <UiInput
            placeholder="8 (_ _ _) - _ _ _ - _ _ - _ _"
            label="Номер телефона*"
            v-model.trim="phone"
            maska="8(###)-###-##-##"
          ></UiInput>
        </div>

        <UiInput
          label="Ваше email*"
          placeholder="Введите email для подтверждения"
          v-model.trim="email"
        ></UiInput>

        <p class="register__error" v-if="!!errorMessage">
          {{ errorMessage }}
        </p>

        <UiButton
          label="Зарегестрироваться"
          @click="postSignUp"
          class="register__btn button-primary"
          :disabled="!disabledBtn"
          :is-loading="isLoading"
        ></UiButton>
      </form>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits(["nextStep"]);

const name = ref("");
const phone = ref("");
const email = ref("");

const errorMessage = ref("");
const isLoading = ref(false);

const disabledBtn = computed(() => {
  const isValidEmail =
    email.value.includes("@") &&
    email.value.includes(".") &&
    email.value.split(".").pop().length >= 2;

  return (
    name.value.length > 1 &&
    name.value.length < 50 &&
    phone.value.length === 16 &&
    isValidEmail
  );
});

const postSignUp = () => {
  if (disabledBtn.value) {
    isLoading.value = true;
    useApi()
      .client({
        url: "/users/auth/register/send-code",
        method: "post",
        data: {
          phone: phone.value.replace(/\D/g, ""),
          name: name.value,
          email: email.value,
        },
      })
      .then((res) => {
        emit("nextStep", phone.value, name.value, email.value);
        isLoading.value = false;
      })
      .catch((res) => {
        errorMessage.value = res.message;
        isLoading.value = false;
      });
  }
};

watch(
  () => phone.value,
  () => {
    if (errorMessage.value) errorMessage.value = "";
  },
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
  &__error {
    font-size: 12px;
    color: $orange-200;
  }
  &__logo {
    width: 64px;
  }
}
</style>
