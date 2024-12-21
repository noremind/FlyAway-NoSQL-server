<template>
  <section class="tours">
    <div class="tours__wrapper">
      <div class="tours__header">
        <h1 class="tours__title title">Туры</h1>
        <UiTabs class="tours__tabs" :tabs="tabs" v-model="selectedTab"></UiTabs>
      </div>

      <div class="tours__content">
        <div class="tours__content-left">
          <section class="tours__filters">
            <div class="tours__filters-header">
              <UiIcons
                icon="filter-burger"
                size="size-36"
                color="blue-500"
              ></UiIcons>
              <h2 class="tours__filters-title">Фильтр</h2>
            </div>

            <div class="tours__filters-box">
              <UiInput
                placeholder="Введите название"
                after-icon="lupa"
                icon-color="surface-900"
              ></UiInput>

              <div class="tours__filters-range">
                <div>
                  <p class="tours__filters-text">Цена</p>
                  <UiRange></UiRange>
                </div>

                <div class="tours__filters-inner">
                  <span>от</span>
                  <UiInput></UiInput>
                  <span>₸</span>
                </div>

                <div class="tours__filters-inner">
                  <span>до</span>
                  <UiInput></UiInput>
                  <span>₸</span>
                </div>
              </div>

              <div>
                <p class="tours__filters-text">Продолжительность</p>
                <UiSelect></UiSelect>
              </div>

              <UiHashTag :tags="tags" label="Тип отдыха"></UiHashTag>
            </div>
          </section>
          <TheCommonAdBanner></TheCommonAdBanner>
        </div>
        <div class="tours__block">
          <section class="tours__sort">
            <h2 class="tours__sort-title">Сортировка</h2>
            <UiCheckbox
              v-for="(item, index) in options"
              :key="index"
              :label="item.label"
            ></UiCheckbox>
          </section>
          <div v-if="selectedTab?.id === 1" class="tours__cards">
            <TheCommonTourCard
              v-for="card in 6"
              :key="card"
            ></TheCommonTourCard>

            <TheCommonPopularBanner
              class="tours__banner"
            ></TheCommonPopularBanner>

            <TheCommonTourCard
              v-for="card in 6"
              :key="card"
            ></TheCommonTourCard>
          </div>
          <div v-show="selectedTab?.id === 2" class="tours__location">
            <div class="tours__map" ref="mapContainer"></div>
            <div class="tours__scroll-wrapper">
              <div class="tours__scroll-cards">
                <TheCommonTourCard
                  v-for="card in 4"
                  :key="card"
                ></TheCommonTourCard>
                <div class="tours__scroll-pagination">
                  <UiPagination
                    class="tours__pagination tours__pagination--scroll"
                  ></UiPagination>
                </div>
              </div>
            </div>
          </div>
          <UiPagination
            v-if="selectedTab?.id === 1"
            class="tours__pagination"
          ></UiPagination>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const mapContainer = ref(null);
const tabs = reactive([
  {
    id: 1,
    name: "Список",
    icon: "burger-list",
  },
  {
    id: 2,
    name: "Список",
    icon: "location",
  },
]);
const selectedTab = ref(tabs[0]);
const options = [
  { label: "по цене", value: "price" },
  { label: "по популярности", value: "popularity" },
];

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

onMounted(() => {
  if (typeof ymaps !== "undefined") {
    ymaps.ready(() => {
      const map = new ymaps.Map(mapContainer.value, {
        center: [43.238949, 76.889709],
        zoom: 10,
        controls: [],
      });
      const placemark = new ymaps.Placemark(
        [55.751574, 37.573856],
        {
          balloonContent: "This is Almaty!",
        },
        {
          preset: "islands#icon",
          iconColor: "#0095b6",
        }
      );

      map.geoObjects.add(placemark);
    });
  } else {
    console.error("Yandex Maps API is not loaded.");
  }
});
</script>

<style lang="scss" scoped>
.tours {
  &__wrapper {
    margin: 60px 0 30px 0;
  }
  &__header {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: center;
  }
  &__tabs {
    background-color: $white;
    border-radius: 24px;
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
    background-color: $white;
    border-radius: 16px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 16px;
    gap: 16px;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.04);
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
  &__location {
    display: flex;
    justify-content: space-between;
    height: 610px;
  }
  &__map {
    max-width: 610px;
    width: 100%;
    height: 610px;
  }
  &__scroll-cards {
    max-width: 320px;
    width: 100%;
    padding: 12px;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    gap: 12px;
    height: inherit;
    background-color: $white;
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
  }
  &__scroll-wrapper {
    display: flex;
    flex-direction: column;
    position: relative;
  }
  &__scroll-pagination {
    position: absolute;
    bottom: 0;
    background-color: $white;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 0;
    height: 60px;
    border-bottom-right-radius: 16px;
  }
}
</style>
