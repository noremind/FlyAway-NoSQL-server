<template>
  <section class="purchases">
    <div class="purchases__wrapper">
      <div class="purchases__blocks">
        <nuxt-link
          class="purchases__block"
          v-for="(block, index) in blocks"
          :key="index"
          :to="block.link"
        >
          <UiIcons :icon="block.icon" size="size-24" color="red-500"></UiIcons>
          <p class="purchases__text">{{ block.name }}</p>
        </nuxt-link>
      </div>
    </div>
  </section>
</template>

<script setup>
const blocks = [
  {
    icon: "map",
    name: "Мои туры",
    link: "/profile/my-tours",
  },
  {
    icon: "home",
    name: "Мои отели",
    link: "/profile/my-hotels",
  },
];
</script>

<style lang="scss" scoped>
.purchases {
  &__wrapper {
    color: $surface-900;
  }
  &__blocks {
    display: flex;
    flex-direction: column;
    gap: 16px;
    justify-content: center;
    align-items: center;
  }
  &__block {
    max-width: 327px;
    width: 100%;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
    padding: 20px 24px;
    background-color: $white;
    border-radius: 36px;
    display: flex;
    gap: 8px;
    cursor: pointer;
    color: $surface-900;
  }
}
</style>
