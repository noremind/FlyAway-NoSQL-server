<template>
  <section class="register">
    <div class="register__wrapper">
      <img
        class="register__logo"
        src="@/assets/image/logo/FlyAway-logo.png"
        alt="TravelTime"
      />

      <h4 class="register__title">Регистрация</h4>

      <form class="register__form">
        <UiInput
          placeholder="Введите"
          label="Ваше имя*"
          v-model="name"
        ></UiInput>
        <div>
          <UiInput
            placeholder="+7 (_ _ _) - _ _ _ - _ _ - _ _"
            label="Номер телефона*"
            v-model="phone"
            maska="+7(###)-###-##-##"
            :is-error="!!errorMessage"
          ></UiInput>
          <p class="register__error" v-if="!!errorMessage">
            {{ errorMessage }}
          </p>
        </div>

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

const errorMessage = ref("");
const isLoading = ref(false);

const disabledBtn = computed(() => {
  return (
    name.value.length > 1 && name.value.length < 50 && phone.value.length === 17
  );
});

const postSignUp = () => {
  if (disabledBtn.value) {
    isLoading.value = true;
    useApi({
      url: "/users/auth/register/send-code",
      method: "post",
      data: {
        phone: phone.value,
        name: name.value,
      },
    })
      .then((res) => {
        emit("nextStep", phone.value, name.value);
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
  &__error {
    font-size: 12px;
    color: $orange-200;
  }
}
</style>
