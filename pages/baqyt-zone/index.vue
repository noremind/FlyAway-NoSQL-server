<template>
  <section class="baqyt-zone">
    <div
      class="baqyt-zone__map"
      v-show="selectedTabMobile.id === 3"
      ref="mapContainer"
    ></div>
    <div class="baqyt-zone__wrapper">
      <div class="baqyt-zone__top">
        <UiInput
          class="baqyt-zone__top-search"
          placeholder="Введите название"
          after-icon="lupa"
        ></UiInput>
        <p class="baqyt-zone__top-text" @click="openFilterMobile">Фильтр</p>
      </div>

      <UiTabs
        class="baqyt-zone__tabs baqyt-zone__tabs--mobile"
        :tabs="tabsMobile"
        v-model="selectedTabMobile"
      ></UiTabs>
      <div
        class="baqyt-zone__header"
        :class="{
          'baqyt-zone__header--visible': selectedTabMobile.id === 3,
        }"
      >
        <h1 class="baqyt-zone__title title">BaqytZone</h1>
        <UiTabs
          class="baqyt-zone__tabs"
          :tabs="tabs"
          v-model="selectedTab"
        ></UiTabs>
      </div>

      <div class="baqyt-zone__content" v-show="selectedTabMobile.id !== 3">
        <div class="baqyt-zone__content-left">
          <section class="baqyt-zone__filters">
            <div class="baqyt-zone__filters-header">
              <UiIcons
                icon="filter-burger"
                size="size-36"
                color="blue-500"
              ></UiIcons>
              <h2 class="baqyt-zone__filters-title">Фильтр</h2>
            </div>

            <div class="baqyt-zone__filters-box">
              <UiInput
                placeholder="Введите название"
                after-icon="lupa"
                icon-color="surface-900"
              ></UiInput>

              <div class="baqyt-zone__filters-range">
                <div>
                  <p class="baqyt-zone__filters-text">Цена</p>
                  <UiRange></UiRange>
                </div>

                <div class="baqyt-zone__filters-inner">
                  <span>от</span>
                  <UiInput></UiInput>
                  <span>₸</span>
                </div>

                <div class="baqyt-zone__filters-inner">
                  <span>до</span>
                  <UiInput></UiInput>
                  <span>₸</span>
                </div>
              </div>

              <div>
                <p class="baqyt-zone__filters-text">Продолжительность</p>
                <UiSelect></UiSelect>
              </div>

              <div class="baqyt-zone__filters-checkboxs">
                <p class="baqyt-zone__filters-text">Вид активности</p>
                <UiCheckbox
                  v-for="(item, index) in options"
                  :key="index"
                  :label="item.label"
                  type="checkmark"
                ></UiCheckbox>
              </div>
            </div>
          </section>
          <TheCommonAdBanner class="baqyt-zone__ad"></TheCommonAdBanner>
        </div>
        <div class="baqyt-zone__block">
          <section class="baqyt-zone__sort">
            <h2 class="baqyt-zone__sort-title">Сортировка</h2>
            <UiCheckbox
              v-for="(item, index) in options"
              :key="index"
              :label="item.label"
            ></UiCheckbox>
          </section>
          <div
            class="baqyt-zone__cards"
            :class="{ 'baqyt-zone__cards--tablet': selectedTabMobile.id === 1 }"
          >
            <TheBaqytZoneBlock
              v-for="card in 6"
              :key="card"
              :view-type="selectedTabMobile.id === 1 ? 'tablet' : 'list'"
            ></TheBaqytZoneBlock>

            <TheCommonPopularBanner
              class="baqyt-zone__banner"
            ></TheCommonPopularBanner>

            <TheBaqytZoneBlock
              v-for="card in 6"
              :key="card"
              :view-type="selectedTabMobile.id === 1 ? 'tablet' : 'list'"
            ></TheBaqytZoneBlock>
          </div>
          <UiPagination
            v-if="selectedTab?.id === 1"
            class="baqyt-zone__pagination"
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
    <div class="baqyt-zone__filters-box">
      <div>
        <p class="baqyt-zone__filters-text">Сортировка</p>
        <div class="baqyt-zone__filters-checkboxs">
          <UiCheckbox
            v-for="(item, index) in options"
            :key="index"
            :label="item.label"
          ></UiCheckbox>
        </div>
      </div>

      <div>
        <p class="baqyt-zone__filters-text">Цена</p>
        <UiRange></UiRange>
      </div>
      <div class="baqyt-zone__filters-range">
        <div class="baqyt-zone__filters-inner">
          <span>от</span>
          <UiInput class="baqyt-zone__filters-input--mobile"></UiInput>
          <span>₸</span>
        </div>

        <div class="baqyt-zone__filters-inner">
          <span>до</span>
          <UiInput class="baqyt-zone__filters-input--mobile"></UiInput>
          <span>₸</span>
        </div>
      </div>

      <div>
        <p class="baqyt-zone__filters-text">Тип</p>
        <UiSelect placeholder="Выберите тип активности"></UiSelect>
      </div>

      <div>
        <p class="baqyt-zone__filters-text">Продолжительность</p>
        <UiSelect></UiSelect>
      </div>

      <div class="baqyt-zone__filters-checkboxs">
        <p class="baqyt-zone__filters-text">Вид активности</p>
        <UiCheckbox
          v-for="(item, index) in options"
          :key="index"
          :label="item.label"
          type="checkmark"
        ></UiCheckbox>
      </div>
    </div>
  </UiOverlay>

  <UiPartialModal
    :is-show="selectedTabMobile.id === 3 && isOpenPartialLocationCards"
    :dark-bg="false"
    @close="closePartialLocationCards"
  >
    <template #body>
      <div class="baqyt-zone__cards">
        <TheBaqytZoneBlock
          v-for="card in 6"
          :key="card"
          :view-type="'list'"
        ></TheBaqytZoneBlock>
      </div>
    </template>
  </UiPartialModal>
</template>

<script setup>
const isOpenPartialLocationCards = ref(false);
const isOpenFilterMobile = ref(false);
const mapContainer = ref(null);

const closePartialLocationCards = () => {
  isOpenPartialLocationCards.value = false;
};

const openPartialLocationCards = () => {
  isOpenPartialLocationCards.value = true;
};

const openFilterMobile = () => {
  isOpenFilterMobile.value = true;
};

const closeFilterMobile = () => {
  isOpenFilterMobile.value = false;
};
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

watch(
  () => selectedTabMobile.value,
  (newVal) => {
    newVal.id === 3 ? openPartialLocationCards() : null;
  }
);
</script>

<style lang="scss" scoped>
.baqyt-zone {
  position: relative;
  &__map {
    width: 100%;
    height: 100vh;
    position: fixed;
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
  &__title {
    height: 46px;
    &--visible {
      display: none;
      position: relative;
      z-index: 2;
      color: $surface-900;
    }
    &--hide {
      display: none;
    }
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

    &-checkboxs {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    &-input {
      &--mobile {
        flex-grow: 1;
      }
    }
    &-range {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    &-checkboxs {
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
  &__top {
    display: none;
    position: relative;
    z-index: 2;
  }
}

@media (max-width: 375px) {
  .baqyt-zone {
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
