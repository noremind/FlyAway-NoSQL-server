<template>
  <TheAuthRegister v-if="currentStep === 1" @next-step="nextStepSmsCode" />
  <TheAuthSmsCode
    v-if="currentStep === 2"
    @next-step="nextStepStatusAuth"
    @prev-step="prevStep"
    :phone="phoneReg"
  />
  <ModalsStatus
    v-if="currentStep === 3"
    title="Вы зарегестрированы"
    status="success"
    btn-label="Перейти в личный кабинет"
    go-to="/profile"
    @action="userStore.closeAuthModal()"
  />
</template>

<script setup>
const currentStep = ref(1);
const userStore = useAuthStore();
const phoneReg = ref("");
const nameReg = ref("");

const nextStepSmsCode = (phone, name) => {
  phoneReg.value = phone;
  nameReg.value = name;
  currentStep.value++;
};

const nextStepStatusAuth = () => {
  currentStep.value++;
};

const prevStep = () => {
  currentStep.value--;
};
</script>

<style lang="scss" scoped></style>
