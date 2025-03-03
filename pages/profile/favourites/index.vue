<template>
  <div class="favourites">
    <div class="favourites__wrapper">
      <UiTabs
        class="favourites__tabs"
        :tabs="tabs"
        v-model="selectedTab"
        type="line"
      ></UiTabs>

      <div
        class="favourites__cards"
        :class="{
          'favourites__cards--hotels': selectedTab.id === 2,
        }"
      >
        <TheCommonTourCard
          v-if="selectedTab.id === 1"
          v-for="card in 15"
          :key="card"
          :view-type="screenWidth > 325 ? 'list' : 'tablet'"
        ></TheCommonTourCard>

        <TheHotelsBlock
          v-if="selectedTab.id === 2"
          v-for="hotel in 15"
          :key="hotel"
          :view-type="screenWidth > 325 ? 'list' : 'tablet'"
        ></TheHotelsBlock>

        <TheBaqytZoneBlock
          v-if="selectedTab.id === 3"
          v-for="zone in 15"
          :key="zone"
          :view-type="screenWidth > 325 ? 'list' : 'tablet'"
        ></TheBaqytZoneBlock>
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

useSeoMeta({
  title: "FlyAway - Избранное",
  ogTitle: "FlyAway - Избранное",
  description: "FlyAway - сайт для бронирования туров и отелей",
  ogDescription: "FlyAway - сайт для бронирования туров и отелей",
});

const windowWidth = ref(process.client ? window.innerWidth : null);

const updateWidth = () => {
  windowWidth.value = window.innerWidth;
};

const screenWidth = computed(() => {
  return windowWidth.value;
});

onMounted(() => {
  window.addEventListener("resize", updateWidth);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateWidth);
});
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
    &--hotels {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }
  &__pagination {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

@media (max-width: 375px) {
  .favourites {
    &__wrapper {
      background-color: transparent;
      padding: 0;
    }
    &__cards {
      padding: 0;
      grid-template-columns: repeat(2, 1fr);
      gap: 6px;
    }
  }
}
</style>
