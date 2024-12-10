<template>
  <div class="main">
    <BaseHeader></BaseHeader>
    <main class="main__wrapper">
      <NuxtPage></NuxtPage>
    </main>

    <BaseFooter></BaseFooter>
  </div>

  <UiModal
    :is-show="userStore.isRegistered"
    max-width="600px"
    @close="userStore.closeAuthModal"
  >
    <ModalsAuthStep></ModalsAuthStep>
  </UiModal>
</template>

<script setup>
const userStore = useAuthStore();
</script>
