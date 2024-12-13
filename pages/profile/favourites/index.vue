<template>
  <div class="favourites">
    <div class="favourites__wrapper">
      <UiTabs
        class="favourites__tabs"
        :tabs="tabs"
        v-model="selectedTab"
        type="line"
      ></UiTabs>

      <div class="favourites__cards">
        <TheCommonTourCard v-for="card in 15"></TheCommonTourCard>
      </div>
    </div>
    <br />
    <UiPagination class="favourites__pagination"></UiPagination>
  </div>
</template>

<script setup>
const tabs = reactive([
  {
    id: 1,
    name: "Tyры",
  },
  {
    id: 2,
    name: "Отели",
  },
  {
    id: 3,
    name: "BaqytZone",
  },
]);
const selectedTab = ref(tabs[0]);
</script>

<style lang="scss" scoped>
.favourites {
  &__wrapper {
    background-color: $white;
    padding: 16px;
    border-radius: 16px;
  }
  &__tabs {
    display: flex;
    justify-content: center;
  }
  &__cards {
    padding: 10px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    margin: 26px 0;
    gap: 16px;
  }
  &__pagination {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
