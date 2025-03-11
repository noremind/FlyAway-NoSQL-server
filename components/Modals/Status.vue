<template>
  <div class="status">
    <div class="status__wrapper">
      <img
        class="status__logo"
        src="@/assets/image/logo/FlyAway-logo.png"
        alt="FlyAway"
      />
      <UiIcons
        icon="circle-check"
        size="size-160"
        :color="checkStatus"
      ></UiIcons>

      <h4 class="status__title">{{ title }}</h4>

      <nuxt-link :to="goTo" @click="emit('action')" class="status__link">
        <UiButton
          :label="btnLabel"
          class="status__btn button-primary"
        ></UiButton>
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
    color: $red-500;
    font-size: 32px;
    font-weight: 400;
    text-align: center;
  }
  &__btn {
    width: 100%;
  }
  &__link {
    width: 100%;
  }
  &__logo {
    width: 64px;
  }
}
</style>
