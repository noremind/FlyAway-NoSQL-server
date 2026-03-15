<template>
  <div class="main">
    <BaseHeader></BaseHeader>
    <main class="main__wrapper">
      <NuxtPage />
    </main>

    <BaseFooter></BaseFooter>
  </div>

  <UiModal
    :is-show="userStore.isOpenRegisteredModal || userStore.isOpenLoginModal"
    max-width="600px"
    @close="checkModal"
    :full-screen="userStore.isMobileModal"
  >
    <ModalsAuthStep></ModalsAuthStep>
  </UiModal>

  <UiLoader />
</template>

<script setup>
const userStore = useAuthStore();
const checkModal = computed(() =>
  userStore.isOpenRegisteredModal
    ? userStore.closeAuthModalRegister
    : userStore.closeAuthModalLogin,
);
</script>
