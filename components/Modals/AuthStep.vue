<template>
  <TheAuthRegister
    v-if="userStore.isOpenRegisteredModal && currentStep === 1"
    @next-step="nextStepSmsCode"
  />
  <TheAuthLogin
    v-if="userStore.isOpenLoginModal && currentStep === 2"
    @next-step="nextStepSuccessAuth"
  />

  <TheAuthSmsCode
    v-if="currentStep === 3"
    @next-step="nextStepStatusAuth"
    @prev-step="prevStep"
    :phone="phoneReg"
  />

  <TheAuthPassword
    v-if="currentStep === 4"
    :userId="userId"
    @next-step="nextStepSuccessAuth"
    @prev-step="prevStep"
  />

  <ModalsStatus
    v-if="currentStep === 5"
    title="Вы зарегестрированы"
    status="success"
    btn-label="Перейти в личный кабинет"
    go-to="/profile"
    @action="userStore.closeAuthModalRegister()"
  />
</template>

<script setup>
const userStore = useAuthStore();
const currentStep = ref(userStore.isOpenRegisteredModal ? 1 : 2);
const phoneReg = ref("");
const nameReg = ref("");
const userId = ref("");

const nextStepSmsCode = (phone, name) => {
  phoneReg.value = phone;
  nameReg.value = name;
  currentStep.value = 3;
  console.log(currentStep.value);
};

const nextStepStatusAuth = (id) => {
  userId.value = id;
  currentStep.value = 4;
};

const nextStepSuccessAuth = () => {
  currentStep.value = 5;
};

const prevStep = () => {
  if (currentStep.value === 3) return (currentStep.value = 1);
  --currentStep.value;
};
</script>

<style lang="scss" scoped></style>
