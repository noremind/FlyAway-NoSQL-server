<template>
  <section class="locations">
    <div class="locations__wrapper">
      <div class="locations__top">
        <UiInput
          class="locations__top-search"
          placeholder="Введите название"
          after-icon="lupa"
          v-model="search"
        ></UiInput>
        <p class="locations__top-text" @click="openFilterMobile">Фильтр</p>
      </div>
      <div class="locations__header">
        <h1 class="locations__title title">Локации</h1>
      </div>

      <div class="locations__content">
        <div class="locations__content-left">
          <section class="locations__filters">
            <div class="locations__filters-header">
              <UiIcons
                icon="filter-burger"
                size="size-36"
                color="blue-500"
              ></UiIcons>
              <h2 class="locations__filters-title">Фильтр</h2>
            </div>

            <div class="locations__filters-box">
              <UiInput
                placeholder="Введите название"
                after-icon="lupa"
                icon-color="surface-900"
                label="Поиск по названию"
                v-model="search"
              ></UiInput>

              <UiHashTag :tags="tags"></UiHashTag>
            </div>
          </section>
          <TheCommonAdBanner class="locations__ad"></TheCommonAdBanner>
        </div>
        <div class="locations__block">
          <section class="locations__sort">
            <h2 class="locations__sort-title">Сортировка</h2>
            <UiCheckbox
              :options="options"
              v-model="selectedSortOption"
            ></UiCheckbox>
          </section>

          <div class="locations__cards" v-if="locations">
            <TheLocationsBlock
              v-for="location in locations"
              :key="location.id"
              :location="location"
            ></TheLocationsBlock>
          </div>
          <div v-else>Loading...</div>

          <UiPagination class="locations__pagination"></UiPagination>
        </div>
      </div>
    </div>
  </section>

  <UiOverlay
    :is-show="isOpenFilterMobile"
    @close="closeFilterMobile"
    title="Фильтр"
  >
    <div class="locations__overlay-checkboxs">
      <p class="locations__overlay-bold">Сортировка</p>
      <UiCheckbox :options="options" v-model="selectedSortOption"></UiCheckbox>
    </div>
    <UiHashTag :tags="tags"></UiHashTag>
  </UiOverlay>
</template>

<script setup>
const locations = ref(null);
const isOpenFilterMobile = ref(false);
const options = [
  { label: "по дате выхода", value: "created_at" },
  { label: "по популярности", value: "rating" },
];
const selectedSortOption = ref([]);
const search = ref(null);
const filterQueries = reactive({
  q: null,
  sort_by: null,
  sort_order: null,
});

const tags = reactive([
  {
    id: 1,
    name: "активный",
  },
  {
    id: 2,
    name: "экскурсионный",
  },
  {
    id: 3,
    name: "wellness",
  },
  {
    id: 4,
    name: "активный",
  },
]);

const getLocations = (query = {}) => {
  useApi({
    url: "/locations",
    mehtod: "get",
    params: { ...query },
  }).then((res) => {
    locations.value = res.data.data;
  });
};
getLocations();

const openFilterMobile = () => {
  isOpenFilterMobile.value = true;
};

const closeFilterMobile = () => {
  isOpenFilterMobile.value = false;
};

const setQuery = (key, value) => {
  const query = {};
  filterQueries[key] = value;
  for (const key in filterQueries) {
    if (filterQueries[key] !== null && filterQueries[key] !== "") {
      query[key] = filterQueries[key];
    }
  }
  getLocations(query);
};

watch(
  () => selectedSortOption.value,
  (newVal) => {
    setQuery("sort_by", newVal.value);
  }
);

watch(
  () => search.value,
  (newVal) => {
    setQuery("q", newVal);
  }
);
</script>

<style lang="scss" scoped>
.locations {
  &__wrapper {
    margin: 60px 0 30px 0;
  }
  &__header {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: center;
  }
  &__content {
    width: 100%;
    display: flex;
    // justify-content: space-between;
    gap: 24px;
    margin: 36px 0;
  }
  &__filters {
    max-width: 255px;
    width: 100%;
    border-radius: 16px;
    background-color: $white;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.04);
    &-box {
      display: flex;
      flex-direction: column;
      gap: 36px;
      padding: 20px;
    }
    &-range {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    &-inner {
      display: flex;
      gap: 6px;
      align-items: center;
    }
    &-header {
      display: flex;
      gap: 12px;
      align-items: center;
      background-color: $blue-200;
      padding: 20px;
      border-radius: 16px;
    }
    &-title {
      color: $surface-900;
      font-size: 16px;
    }
    &-text {
      font-size: 14px;
      font-weight: 400;
      color: $surface-900;
      margin-bottom: 12px;
    }
  }
  &__block {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  &__sort {
    background-color: $white;
    border-radius: 16px;
    display: flex;
    align-items: center;
    gap: 24px;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.04);
    &-title {
      padding: 26px;
      background-color: $blue-200;
      border-radius: 16px;
      color: $surface-900;
      font-size: 16px;
      margin-right: 16px;
    }
  }
  &__cards {
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  &__banner {
    grid-column: 1 / -1;
  }
  &__pagination {
    margin: 0 auto;
    &--scroll {
      position: absolute;
      bottom: 0;
      z-index: 3;
      margin-bottom: 12px;
    }
  }
  &__overlay {
    &-checkboxs {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 32px;
    }
    &-bold {
      font-weight: 400;
      font-size: 14px;
    }
  }
  &__top {
    display: none;
  }
}

@media (max-width: 375px) {
  .locations {
    &__wrapper {
      margin: 16px 0;
    }
    &__top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      &-text {
        color: $blue-500;
        font-weight: 400;
        cursor: pointer;
      }
      &-search {
        width: 100%;
        background-color: $white;
        border-radius: 26px;
      }
    }
    &__title {
      margin: 12px 0;
    }
    &__ad,
    &__filters,
    &__sort {
      display: none;
    }
    &__content {
      display: flex;
      flex-direction: column;
      height: 100%;
      gap: 12px;
      margin: 0;
    }
  }
}
</style>
