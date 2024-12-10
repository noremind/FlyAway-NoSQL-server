<template>
  <TheAuthRegister v-if="currentStep === 1" @next-step="nextStep" />
  <TheAuthSmsCode
    v-if="currentStep === 2"
    @next-step="nextStep"
    @prev-step="prevStep"
  />
  <TheAuthStatus v-if="currentStep === 3" />
</template>

<script setup>
const currentStep = ref(1);

const nextStep = () => {
  currentStep.value++;
};

const prevStep = () => {
  currentStep.value--;
};
</script>

<style lang="scss" scoped></style>
