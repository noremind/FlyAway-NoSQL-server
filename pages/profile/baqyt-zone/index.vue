<template>
  <div class="baqyt-zone">
    <div class="baqyt-zone__wrapper">
      <UiTabs
        class="baqyt-zone__tabs"
        :tabs="tabs"
        type="line"
        v-model="selectedTab"
      ></UiTabs>

      <div class="baqyt-zone__cards">
        <TheProfileBaqytZoneTicket
          v-for="card in 8"
          :key="card"
        ></TheProfileBaqytZoneTicket>
      </div>
    </div>
    <br />

    <UiPagination class="baqyt-zone__pagination"></UiPagination>
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
</script>

<style lang="scss" scoped>
.baqyt-zone {
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
</style>
