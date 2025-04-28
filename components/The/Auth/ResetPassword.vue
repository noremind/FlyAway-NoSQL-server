<template>
  <section class="password-reset">
    <div class="password-reset__wrapper">
      <img
        class="password-reset__logo"
        src="@/assets/image/logo/FlyAway-logo.png"
        alt="FlyAway"
      />

      <div>
        <h4 class="password-reset__title">Сбросить пароля</h4>
        <p class="password-reset__description">
          Введите номер телефона чтобы получить код по почте
        </p>
      </div>

      <form class="password-reset__form">
        <div>
          <UiInput
            placeholder="8 (_ _ _) - _ _ _ - _ _ - _ _"
            label="Номер телефона"
            v-model.trim="phone"
            maska="8(###)-###-##-##"
            name="phone"
            :is-error="!!errorMessage"
          ></UiInput>

          <p class="password-reset__error" v-if="errorMessage">
            {{ errorMessage }}
          </p>
        </div>

        <UiButton
          label="Получить код"
          @click="postPhone"
          class="password-reset__btn button-primary"
          :disabled="!disabledBtn"
          :is-loading="isLoading"
        ></UiButton>
      </form>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits(["nextStep"]);

const phone = ref("");

const errorMessage = ref("");
const isLoading = ref(false);

const disabledBtn = computed(() => {
  return phone.value.length === 16;
});

const postPhone = () => {
  if (disabledBtn.value) {
    isLoading.value = true;
    useApi({
      url: "/users/send-reset-code",
      method: "post",
      data: {
        phone: phone.value.replace(/\D/g, ""),
      },
    })
      .then((res) => {
        isLoading.value = false;
        emit("nextStep", phone.value, res.email);
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
  }
);
</script>

<style lang="scss" scoped>
.password-reset {
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
    text-align: center;
  }
  &__description {
    font-size: 14px;
    text-align: center;
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
  &__error {
    font-size: 14px;
    color: $orange-200;
  }
}
</style>
