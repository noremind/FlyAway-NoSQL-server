<template>
  <section class="register">
    <div class="register__wrapper">
      <img
        class="register__logo"
        src="@/assets/image/logo/Sapar-time-logo-full.svg"
        alt="TravelTime"
      />

      <h4 class="register__title">Регистрация</h4>

      <form class="register__form">
        <UiInput
          placeholder="Введите"
          label="Ваше имя"
          v-model="name"
        ></UiInput>
        <UiInput
          placeholder="+7 (_ _ _) - _ _ _ - _ _ - _ _"
          label="Номер телефона"
          v-model="phone"
          maska="+7(###)-###-##-##"
        ></UiInput>

        <UiButton
          label="Зарегестрироваться"
          @click="postSignUp"
          class="register__btn button-primary"
          :disabled="!disabledBtn"
        ></UiButton>
      </form>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits(["nextStep"]);

const name = ref("");
const phone = ref("");

const disabledBtn = computed(() => {
  return name.value.length > 3 && phone.value.length === 17;
});

const postSignUp = () => {
  if (disabledBtn.value) {
    useApi({
      url: "/users/auth/register/send-code",
      method: "post",
      data: {
        phone: phone.value,
        fullName: name.value,
      },
    }).then((res) => {
      emit("nextStep", phone.value, name.value);
    });
  }
};
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
