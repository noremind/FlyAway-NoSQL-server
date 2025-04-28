<template>
  <section class="sms-code">
    <div class="sms-code__wrapper">
      <img
        class="sms-code__logo"
        src="@/assets/image/logo/FlyAway-logo.png"
        alt="FlyAway"
      />

      <h4 class="sms-code__title">СМС-код</h4>

      <div class="sms-code__box">
        <p class="sms-code__message">Введите СМС-код отправленный на почту</p>
        <p class="sms-code__number">{{ email }}</p>
      </div>

      <client-only>
        <form class="sms-code__form">
          <venCodeInput
            v-model.trim="sms"
            :upper="true"
            :lower="false"
            :length="4"
            :disallow="/[^a-zA-Z0-9]/g"
            :class="{ error: errorSms ? 'sms-code__fields-error' : '' }"
          />
          <p class="sms-code__error" v-if="errorSms">
            {{ errorSms }}
          </p>
          <div class="sms-code__btns">
            <UiButton
              label="Назад"
              class="sms-code__btn sms-code__btn--cancel"
              @click="emit('prevStep')"
            ></UiButton>
            <UiButton
              label="Подтвердить"
              class="sms-code__btn sms-code__btn--confirm"
              @click="postLogin"
              :disabled="disabledBtn"
              :is-loading="isLoading"
            ></UiButton>
          </div>
        </form>
      </client-only>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits(["nextStep", "prevStep"]);

const route = useRoute();

const props = defineProps({
  email: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
});

const sms = ref(null);
const errorSms = ref("");
const isLoading = ref(false);

const disabledBtn = computed(() => {
  return !(sms.value?.length === 4);
});

const postLogin = () => {
  if (!disabledBtn.value) {
    isLoading.value = true;
    useApi({
      url:
        route.query?.["reset-password"] !== null
          ? "/users/auth/register/verify-code"
          : "/users/verify-reset-code",
      method: "post",
      data: {
        phone: props.phone.replace(/\D/g, ""),
        code: sms.value,
      },
    })
      .then((res) => {
        emit("nextStep", res.userId);
        isLoading.value = false;
      })
      .catch((error) => {
        errorSms.value = error.message;
        sms.value = null;
        isLoading.value = false;
      });
  }
};

watch(
  () => sms.value,
  (newVal) => {
    if (newVal?.length >= 1 && errorSms.value) errorSms.value = "";
  }
);
</script>

<style lang="scss" scoped>
.sms-code {
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
    color: $orange-200;
    font-size: 14px;
    transform: translateY(-15px);
  }
  &__fields-error {
    border: 1px solid $orange-200;
  }
  &__btns {
    display: flex;
    gap: 6px;
    align-items: center;
    width: 100%;
  }
  &__btn {
    display: flex;
    justify-content: center;
    color: $white;
    padding: 10px 0;
    width: 100%;
    &--cancel {
      background-color: transparent;
      color: $surface-900;
    }
    &--confirm {
      background-color: $red-500;
    }
  }
  &__box {
    text-align: center;
  }
  &__logo {
    width: 64px;
  }
}

:global(.code-field__input) {
  background-color: $white !important;
  border: 1px solid $surface-300;
  color: $surface-900;
}
</style>
