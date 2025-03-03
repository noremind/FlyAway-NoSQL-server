<template>
  <section class="tours">
    <div
      class="tours__map tours__map--mobile"
      v-show="selectedTabMobile.id === 3"
      ref="mapContainerMobile"
    ></div>
    <div class="tours__wrapper">
      <div class="tours__top">
        <UiInput
          class="tours__top-search"
          placeholder="Введите название"
          after-icon="lupa"
        ></UiInput>
        <p class="tours__top-text" @click="openFilterMobile">Фильтр</p>
      </div>

      <UiTabs
        class="tours__tabs tours__tabs--mobile"
        :tabs="tabsMobile"
        v-model="selectedTabMobile"
      ></UiTabs>

      <div
        class="tours__header"
        :class="{
          'tours__header--visible': selectedTabMobile.id === 3,
        }"
      >
        <h1 class="tours__title title">Туры</h1>
        <UiTabs class="tours__tabs" :tabs="tabs" v-model="selectedTab"></UiTabs>
      </div>

      <div class="tours__content" v-show="selectedTabMobile.id !== 3">
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

              <div>
                <p class="tours__filters-text">Локация</p>
                <UiTreeSelect></UiTreeSelect>
              </div>

              <UiHashTag :tags="tags" label="Тип отдыха"></UiHashTag>
            </div>
          </section>
          <TheCommonAdBanner class="tours__ad"></TheCommonAdBanner>
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
          <div
            v-show="selectedTab?.id === 1"
            class="tours__cards"
            :class="{ 'tours__cards--tablet': selectedTabMobile.id === 1 }"
          >
            <TheCommonTourCard
              v-for="tour in tours"
              :key="tour.id"
              :tour="tour"
              :view-type="selectedTabMobile.id === 1 ? 'tablet' : 'list'"
            ></TheCommonTourCard>

            <TheCommonPopularBanner
              class="tours__banner"
            ></TheCommonPopularBanner>
          </div>
          <div v-show="selectedTab?.id === 2" class="tours__location">
            <div class="tours__map" ref="mapContainer"></div>
            <div class="tours__scroll-wrapper">
              <div class="tours__scroll-cards">
                <TheCommonTourCard
                  v-for="tour in tours"
                  :key="tour.id"
                  :tour="tour"
                ></TheCommonTourCard>
                <div class="tours__scroll-pagination">
                  <UiPagination
                    v-if="pagination?.last_page && pagination?.last_page !== 1"
                    :total-items="pagination?.total_items"
                    :current-page="currentPage"
                    @change-page="paginationPage"
                    :last-page="pagination?.last_page"
                    :per-page="pagination?.per_page"
                    class="tours__pagination tours__pagination--scroll"
                  ></UiPagination>
                </div>
              </div>
            </div>
          </div>
          <UiPagination
            v-if="
              pagination?.last_page &&
              pagination?.last_page !== 1 &&
              selectedTab?.id === 1
            "
            :total-items="pagination?.total_items"
            :current-page="currentPage"
            @change-page="paginationPage"
            :last-page="pagination?.last_page"
            :per-page="pagination?.per_page"
            class="tours__pagination"
          ></UiPagination>
        </div>
      </div>
    </div>
  </section>

  <UiOverlay
    :is-show="isOpenFilterMobile"
    @close="closeFilterMobile"
    title="Фильтр"
  >
    <div class="tours__filters-box">
      <div>
        <p class="tours__filters-text">Сортировка</p>
        <div class="tours__filters-checkboxs">
          <UiCheckbox
            v-for="(item, index) in options"
            :key="index"
            :label="item.label"
          ></UiCheckbox>
        </div>
      </div>

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

      <div>
        <p class="tours__filters-text">Локация</p>
        <UiTreeSelect></UiTreeSelect>
      </div>

      <UiHashTag :tags="tags" label="Тип отдыха"></UiHashTag>
    </div>
  </UiOverlay>

  <UiPartialModal
    :is-show="selectedTabMobile.id === 3 && isOpenPartialLocationCards"
    :dark-bg="false"
    @close="closePartialLocationCards"
  >
    <template #body>
      <div class="tours__cards">
        <TheCommonTourCard
          v-for="card in 6"
          :key="card"
          :view-type="'list'"
        ></TheCommonTourCard>
      </div>
    </template>
  </UiPartialModal>
</template>

<script setup>
const mapContainer = ref(null);
const mapContainerMobile = ref(null);
const isOpenFilterMobile = ref(false);
const isOpenPartialLocationCards = ref(false);
const tours = ref(null);
const pagination = reactive({});
const currentPage = ref(1);
const tabs = reactive([
  {
    id: 1,
    name: "Список",
    icon: "burger-list",
  },
  {
    id: 2,
    name: "Локация",
    icon: "location",
  },
]);
const tabsMobile = reactive([
  {
    id: 1,
    name: "Плитка",
    icon: "tablets",
  },
  {
    id: 2,
    name: "Список",
    icon: "burger-list",
  },
  {
    id: 3,
    name: "Локация",
    icon: "location",
  },
]);
const selectedTab = ref(tabs[0]);
const selectedTabMobile = ref(tabsMobile[0]);
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

useSeoMeta({
  title: "FlyAway - Туры",
  ogTitle: "FlyAway - Туры",
  description: "FlyAway - сайт для бронирования туров и отелей",
  ogDescription: "FlyAway - сайт для бронирования туров и отелей",
});

const getTours = () => {
  useApi({
    url: "/tours",
    method: "get",
    query: { page: currentPage.value },
  }).then((res) => {
    tours.value = res.data.data;
    pagination.last_page = res.data.last_page;
    pagination.total_items = res.data.total;
    pagination.per_page = res.data.per_page;
  });
};
getTours();

const paginationPage = (page) => {
  currentPage.value = page;
  getTours();
};

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

  if (typeof ymaps !== "undefined") {
    ymaps.ready(() => {
      const map = new ymaps.Map(mapContainerMobile.value, {
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

const openFilterMobile = () => {
  isOpenFilterMobile.value = true;
};

const closeFilterMobile = () => {
  isOpenFilterMobile.value = false;
};

const closePartialLocationCards = () => {
  isOpenPartialLocationCards.value = false;
};

const openPartialLocationCards = () => {
  isOpenPartialLocationCards.value = true;
};

watch(
  () => selectedTabMobile.value,
  (newVal) => {
    newVal.id === 3 ? openPartialLocationCards() : null;
  }
);
</script>

<style lang="scss" scoped>
.tours {
  position: relative;
  &__wrapper {
    margin: 60px 0 30px 0;
  }
  &__header {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: center;
    &--visible {
      display: block;
      position: relative;
      z-index: 2;
      color: $surface-900;
    }
  }
  &__tabs {
    background-color: $white;
    border-radius: 24px;
    &--mobile {
      display: none;
    }
  }
  &__content {
    width: 100%;
    display: flex;
    // justify-content: space-between;
    gap: 24px;
    margin: 36px 0;
  }
  &__filters {
    width: 255px;
    // width: 100%;
    border-radius: 16px;
    background-color: $white;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.04);
    &-box {
      display: flex;
      flex-direction: column;
      gap: 36px;
      padding: 20px;
    }
    &-checkboxs {
      display: flex;
      flex-direction: column;
      gap: 4px;
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
      &--visible {
        display: block;
        position: relative;
        z-index: 2;
        color: $surface-900;
      }
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
    &--mobile {
      display: none;
      width: 100%;
      max-width: 100%;
      height: 100vh;
      position: fixed;
      z-index: 1;
      top: 0;
      left: -0px;
    }
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
  &__top {
    display: none;
    position: relative;
    z-index: 2;
  }
}

@media (max-width: 375px) {
  .tours {
    &__wrapper {
      display: flex;
      flex-direction: column;
      gap: 12px;
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
    &__map {
      display: none;
      &--mobile {
        display: block;
        width: 100%;
        max-width: 100%;
        height: 100vh;
        position: fixed;
        z-index: 1;
        top: 0;
        left: -0px;
      }
    }
    &__tabs {
      display: none;
      position: relative;
      z-index: 2;
      &--mobile {
        display: block;
      }
    }
    &__ad,
    &__filters,
    &__sort {
      display: none;
    }
    &__content {
      display: flex;
      flex-direction: column;
      margin: 0;
      gap: 0;
    }
    &__title {
      font-size: 24px;
      &--visible {
        display: block;
      }
    }
    &__cards {
      display: flex;
      flex-direction: column;
      padding: 0;
      background-color: transparent;
      align-items: center;
      box-shadow: none;
      &--tablet {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 6px;
      }
    }
  }
}
</style>
