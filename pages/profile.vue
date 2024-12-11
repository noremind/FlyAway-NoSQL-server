<template>
  <section class="profile">
    <div class="profile__wrapper">
      <h1 class="profile__title title">Личный кабинет</h1>

      <div class="profile__content">
        <TheProfileNav></TheProfileNav>

        <div class="profile__main">
          <NuxtPage />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
.profile {
  &__wrapper {
    margin: 80px 0 40px 0;
    display: flex;
    flex-direction: column;
    gap: 36px;
  }
  &__content {
    display: flex;
    justify-content: space-between;
    gap: 18px;
  }
  &__main {
    padding: 0 24px 24px 24px;
    border-radius: 16px;
    flex-grow: 1;
    height: 100%;
  }
}
</style>
