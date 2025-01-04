<template>
  <div class="status">
    <div class="status__wrapper">
      <img
        class="status__logo"
        src="@/assets/image/logo/Sapar-time-logo-full.svg"
        alt="Sapartime"
      />
      <UiIcons
        icon="circle-check"
        size="size-160"
        :color="checkStatus"
      ></UiIcons>

      <h4 class="status__title">{{ title }}</h4>

      <nuxt-link :to="goTo" @click="emit('action')" class="status__link">
        <UiButton :label="btnLabel" class="status__btn"></UiButton>
      </nuxt-link>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["action"]);
const props = defineProps({
  title: String,
  status: String,
  btnLabel: String,
  goTo: String,
});

const checkStatus = computed(() => {
  switch (props.status) {
    case "success":
      return "green-400";
    case "error":
      return "orange-200";
    default:
      return "";
  }
});
</script>

<style lang="scss" scoped>
.status {
  &__wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    margin: 40px auto 60px auto;
    max-width: 400px;
  }
  &__title {
    color: $blue-500;
    font-size: 32px;
    font-weight: 400;
    text-align: center;
  }
  &__btn {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $blue-500;
    color: $white;
    padding: 12px;
  }
  &__link {
    width: 100%;
  }
}
</style>
