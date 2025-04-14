<template>
  <section class="hotels">
    <div
      class="hotels__map hotels__map--mobile"
      v-show="selectedTabMobile.id === 3"
      ref="mapContainerMobile"
    ></div>
    <div class="hotels__wrapper">
      <div class="hotels__top">
        <UiInput
          class="hotels__top-search"
          placeholder="Введите название"
          after-icon="lupa"
        ></UiInput>
        <p class="hotels__top-text" @click="openFilterMobile">Фильтр</p>
      </div>

      <UiTabs
        class="hotels__tabs hotels__tabs--mobile"
        :tabs="tabsMobile"
        v-model="selectedTabMobile"
      ></UiTabs>
      <div
        class="hotels__header"
        :class="{
          'hotels__header--visible': selectedTabMobile.id === 3,
        }"
      >
        <h1 class="hotels__title title">Отели</h1>
        <UiTabs
          class="hotels__tabs"
          :tabs="tabs"
          v-model="selectedTab"
        ></UiTabs>
      </div>

      <div class="hotels__content" v-show="selectedTabMobile.id !== 3">
        <div class="hotels__content-left">
          <section class="hotels__filters">
            <div class="hotels__filters-header">
              <UiIcons
                icon="filter-burger"
                size="size-36"
                color="red-500"
              ></UiIcons>
              <h2 class="hotels__filters-title">Фильтр</h2>
            </div>

            <div class="hotels__filters-box">
              <UiInput
                placeholder="Введите название"
                after-icon="lupa"
                icon-color="surface-900"
              ></UiInput>

              <div class="hotels__filters-range">
                <div>
                  <p class="hotels__filters-text">Цена</p>
                  <UiRange></UiRange>
                </div>

                <div class="hotels__filters-inner">
                  <span>от</span>
                  <UiInput></UiInput>
                  <span>₸</span>
                </div>

                <div class="hotels__filters-inner">
                  <span>до</span>
                  <UiInput></UiInput>
                  <span>₸</span>
                </div>
              </div>

              <div>
                <p class="hotels__filters-text">Регион</p>
                <UiSelect></UiSelect>
              </div>

              <div>
                <p class="hotels__filters-text">Рейтинг</p>
                <UiSelect></UiSelect>
              </div>

              <UiHashTag :tags="tags" label="Тип отдыха"></UiHashTag>
            </div>
          </section>
          <TheCommonAdBanner class="hotels__ad"></TheCommonAdBanner>
        </div>
        <div class="hotels__block">
          <section class="hotels__sort">
            <h2 class="hotels__sort-title">Сортировка</h2>
            <UiCheckbox
              v-for="(item, index) in options"
              :key="index"
              :label="item.label"
            ></UiCheckbox>
          </section>
          <div class="hotels__cards">
            <div
              v-show="selectedTab.id === 2"
              class="hotels__map"
              ref="mapContainer"
            ></div>

            <div
              v-if="hotels"
              class="hotels__cards-inner"
              :class="{
                'hotels__cards-inner--tablet': selectedTabMobile.id === 1,
              }"
            >
              <TheHotelsBlock
                v-for="hotel in hotels"
                :key="hotel.id"
                :hotel="hotel"
                :view-type="selectedTabMobile.id === 1 ? 'tablet' : 'list'"
              ></TheHotelsBlock>

              <!-- <TheCommonPopularBanner></TheCommonPopularBanner> -->
            </div>
          </div>
          <UiPagination class="hotels__pagination"></UiPagination>
        </div>
      </div>
    </div>
  </section>

  <!-- Mobile -->
  <UiOverlay
    :is-show="isOpenFilterMobile"
    @close="closeFilterMobile"
    title="Фильтр"
  >
    <div class="hotels__filters-box">
      <div>
        <p class="hotels__filters-text">Сортировка</p>
        <div class="hotels__filters-checkboxs">
          <UiCheckbox
            v-for="(item, index) in options"
            :key="index"
            :label="item.label"
          ></UiCheckbox>
        </div>
      </div>

      <div class="hotels__filters-range">
        <div>
          <p class="hotels__filters-text">Цена</p>
          <UiRange></UiRange>
        </div>
      </div>
      <div>
        <p class="hotels__filters-text">Дата</p>

        <div class="hotels__filters-inner">
          <span>от</span>
          <!-- <UiInput class="hotels__filters-input"></UiInput> -->
          <UiCalendar class="hotels__filters-calendar" />
          <span>₸</span>
        </div>

        <div class="hotels__filters-inner">
          <span>до</span>
          <!-- <UiInput class="hotels__filters-input"></UiInput> -->
          <UiCalendar class="hotels__filters-calendar" />
          <span>₸</span>
        </div>
      </div>

      <div>
        <p class="hotels__filters-text">Регион</p>
        <UiSelect></UiSelect>
      </div>

      <div>
        <p class="hotels__filters-text">Рейтинг</p>
        <UiSelect></UiSelect>
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
      <div class="hotels__cards">
        <TheHotelsBlock v-for="block in 4" :key="block"></TheHotelsBlock>
      </div>
    </template>
  </UiPartialModal>
</template>

<script setup>
const mapContainer = ref(null);
const mapContainerMobile = ref(null);
const isOpenFilterMobile = ref(false);
const isOpenPartialLocationCards = ref(false);
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
const selectedTab = ref(tabs[0]);
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
const hotels = ref(null);

useSeoMeta({
  title: "FlyAway - Отели",
  ogTitle: "FlyAway - Отели",
  description: "FlyAway - сайт для бронирования туров и отелей",
  ogDescription: "FlyAway - сайт для бронирования туров и отелей",
});

const getHotels = () => {
  useApi({
    url: "/hotels",
    method: "get",
  }).then((res) => {
    hotels.value = res.data;
  });
};
getHotels();

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

watch(
  () => selectedTabMobile.value,
  (newVal) => {
    newVal.id === 3 ? openPartialLocationCards() : null;
  }
);
</script>

<style lang="scss" scoped>
.hotels {
  position: relative;
  &__map {
    width: 100%;
    height: 100vh;
    // position: fixed;
    z-index: 1;
    top: 0;
    left: -0px;
  }
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
    border-radius: 16px;
    background-color: $white;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.04);
    &-box {
      display: flex;
      flex-direction: column;
      gap: 36px;
      padding: 20px;
    }
    &-calendar {
      border-radius: 26px;
      background-color: transparent;
      border: 1px solid $surface-300;
      width: 100%;
      padding: 4px;
      margin-top: 0;
    }
    &-checkboxs {
      display: flex;
      flex-direction: column;
      gap: 8px;
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
    display: flex;
    flex-direction: column;
    padding: 16px;
    gap: 16px;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.04);
    &-inner {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
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
    max-width: 100%;
    width: 100%;
    height: 610px;
    &--mobile {
      width: 100%;
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
  .hotels {
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
        color: $red-500;
        font-weight: 400;
        cursor: pointer;
      }
      &-search {
        width: 100%;
        background-color: $white;
        border-radius: 26px;
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
    &__title {
      font-size: 24px;
      &--visible {
        display: block;
      }
    }
    &__content {
      display: flex;
      flex-direction: column;
      margin: 0;
      gap: 0;
    }
    &__filters {
      &-inner {
        justify-content: space-between;
        margin-top: 12px;
      }
    }
    &__cards {
      display: flex;
      flex-direction: column;
      padding: 0;
      background-color: transparent;
      align-items: center;
      box-shadow: none;
      &-inner {
        &--tablet {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 6px;
        }
      }
    }
  }
}
</style>
