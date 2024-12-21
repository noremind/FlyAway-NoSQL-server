<template>
  <div class="go-back">
    <div class="go-back__wrapper">
      <UiIcons
        icon="arrow"
        class="go-back__icon down"
        size="size-24"
        color="surface-900"
        @click="goTo"
      ></UiIcons>
      <p class="go-back__text">{{ label }}</p>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();
const props = defineProps({
  goBack: {
    type: String,
    default: "/",
  },
  label: String,
});

const goTo = () => {
  router.push(props.goBack);
};
</script>

<style lang="scss" scoped>
.go-back {
  &__wrapper {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  &__text {
    font-size: 20px;
    font-weight: 400;
    color: $surface-900;
  }
  &__icon {
    cursor: pointer;
  }
}
</style>
