<template>
  <TheAuthRegister
    v-if="userStore.isOpenRegisteredModal && currentStep === 1"
    @next-step="nextStepRegistered"
  />

  <TheAuthLogin
    v-if="userStore.isOpenLoginModal && currentStep === 2"
    @next-step="nextStepLogin"
  />

  <ModalsStatus
    v-if="currentStep === 5"
    title="Вы зарегистрированы"
    status="success"
    btn-label="Перейти в личный кабинет"
    :go-to="'/profile'"
    @action="userStore.closeAuthModalRegister()"
  />

  <ModalsStatus
    v-if="currentStep === 7"
    :title="loginStatus.title"
    status="success"
    :btn-label="loginStatus.btnLabel"
    :go-to="loginStatus.goTo"
    @action="userStore.closeAuthModalLogin()"
  />
</template>

<script setup>
const userStore = useAuthStore();
const currentStep = ref(userStore.isOpenRegisteredModal ? 1 : 2);
const loginStatus = reactive({
  title: "Вы вошли",
  btnLabel: "Перейти в личный кабинет",
  goTo: "/profile",
});

const nextStepRegistered = () => {
  currentStep.value = 5;
};

const nextStepLogin = (status = {}) => {
  loginStatus.title = status.title || "Вы вошли";
  loginStatus.btnLabel = status.btnLabel || "Перейти в личный кабинет";
  loginStatus.goTo = status.goTo || "/profile";
  currentStep.value = 7;
};
</script>

<style lang="scss" scoped></style>
