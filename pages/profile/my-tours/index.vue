<template>
  <div class="my-tours">
    <div class="my-tours__wrapper">
      <UiTabs
        class="my-tours__tabs"
        :tabs="tabs"
        type="line"
        v-model="selectedTab"
      ></UiTabs>

      <div class="my-tours__cards">
        <TheProfileTourTicket
          v-for="card in 8"
          :key="card"
        ></TheProfileTourTicket>
      </div>
    </div>
    <br />
    <UiPagination class="my-tours__pagination"></UiPagination>
  </div>
</template>

<script setup>
const tabs = reactive([
  {
    id: 1,
    name: "Активные",
  },
  {
    id: 2,
    name: "Завершенные",
  },
]);
const selectedTab = ref(tabs[0]);

useSeoMeta({
  title: "FlyAway - Мой туры",
  ogTitle: "FlyAway - Мой туры",
  description: "FlyAway - сайт для бронирования туров и отелей",
  ogDescription: "FlyAway - сайт для бронирования туров и отелей",
});
</script>

<style lang="scss" scoped>
.my-tours {
  &__wrapper {
    background-color: $white;
    padding: 16px;
    border-radius: 16px;
  }
  &__tabs {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__cards {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin: 24px 0;
  }
  &__pagination {
    margin: 0 auto;
  }
}

@media (max-width: 375px) {
  .my-tours {
    &__wrapper {
      background-color: transparent;
      padding: 0;
    }
  }
}
</style>
