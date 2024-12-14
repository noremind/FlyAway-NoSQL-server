<template>
  <TheAuthRegister v-if="currentStep === 1" @next-step="nextStep" />
  <TheAuthSmsCode
    v-if="currentStep === 2"
    @next-step="nextStep"
    @prev-step="prevStep"
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

const nextStep = () => {
  currentStep.value++;
};

const prevStep = () => {
  currentStep.value--;
};
</script>

<style lang="scss" scoped></style>
