<template>
  <TheAuthRegister
    v-if="userStore.isOpenRegisteredModal && currentStep === 1"
    @next-step="nextStepSmsCode"
  />
  <TheAuthLogin
    v-if="userStore.isOpenLoginModal && currentStep === 2"
    @next-step="nextStepSuccessAuth"
    @forget-password="nextStepForgetPassword"
  />

  <TheAuthSmsCode
    v-if="currentStep === 3"
    @next-step="nextStepStatusAuth"
    @prev-step="prevStep"
    :email="emailReg"
    :phone="phoneReg"
  />

  <TheAuthPassword
    v-if="currentStep === 4"
    :userId="userId"
    :phone="phoneReg"
    @next-step="nextStepSuccessAuth"
    @prev-step="prevStep"
  />

  <TheAuthResetPassword
    v-if="currentStep === 6"
    @next-step="nextStepResetSms"
  ></TheAuthResetPassword>

  <ModalsStatus
    v-if="currentStep === 5"
    title="Вы зарегестрированы"
    status="success"
    btn-label="Перейти в личный кабинет"
    :go-to="'/profile'"
    @action="userStore.closeAuthModalLogin()"
  />
  <ModalsStatus
    v-if="currentStep === 7"
    title="Вы вошли"
    status="success"
    btn-label="Перейти в личный кабинет"
    :go-to="'/profile'"
    @action="userStore.closeAuthModalLogin()"
  />
</template>

<script setup>
const router = useRouter();
const route = useRoute();
const userStore = useAuthStore();
const currentStep = ref(userStore.isOpenRegisteredModal ? 1 : 2);

const phoneReg = ref("");
const nameReg = ref("");
const emailReg = ref("");

const userId = ref("");

const nextStepSmsCode = (phone, name, email) => {
  phoneReg.value = phone;
  nameReg.value = name;
  emailReg.value = email;
  currentStep.value = 3;
};

const nextStepResetSms = (phone, email) => {
  emailReg.value = email;
  phoneReg.value = phone;
  currentStep.value = 3;
};

const nextStepStatusAuth = (id) => {
  userId.value = id;
  currentStep.value = 4;
};

const nextStepForgetPassword = () => {
  router.push({ path: route.path, query: { "reset-password": null } });
  currentStep.value = 6;
};

const nextStepSuccessAuth = () => {
  currentStep.value = 7;
};

const prevStep = () => {
  if (currentStep.value === 3) return (currentStep.value = 1);
  --currentStep.value;
};
</script>

<style lang="scss" scoped></style>
