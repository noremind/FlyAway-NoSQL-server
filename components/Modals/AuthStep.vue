<template>
  <TheAuthRegister
    v-if="userStore.isOpenRegisteredModal && currentStep === 1"
    @next-step="nextStepSmsCode"
  />
  <TheAuthLogin
    v-if="userStore.isOpenLoginModal && currentStep === 2"
    @next-step="nextStepStatusAuth"
  />
  <TheAuthSmsCode
    v-if="currentStep === 3"
    @next-step="nextStepStatusAuth"
    @prev-step="prevStep"
    :phone="phoneReg"
  />
  <ModalsStatus
    v-if="currentStep === 4"
    title="Вы зарегестрированы"
    status="success"
    btn-label="Перейти в личный кабинет"
    go-to="/profile"
    @action="userStore.closeAuthModal()"
  />
</template>

<script setup>
const userStore = useAuthStore();
const currentStep = ref(userStore.isOpenRegisteredModal ? 1 : 2);
const phoneReg = ref("");
const nameReg = ref("");

const nextStepSmsCode = (phone, name) => {
  phoneReg.value = phone;
  nameReg.value = name;
  currentStep.value = 3;
};

const nextStepStatusAuth = () => {
  currentStep.value = 4;
};

const prevStep = () => {
  currentStep.value--;
};
</script>

<style lang="scss" scoped></style>
