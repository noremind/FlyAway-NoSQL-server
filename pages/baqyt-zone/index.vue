<template>
  <section class="baqyt-zone">
    <div class="baqyt-zone__wrapper">
      <div class="baqyt-zone__header">
        <h1 class="baqyt-zone__title title">BaqytZone</h1>
        <UiTabs
          class="baqyt-zone__tabs"
          :tabs="tabs"
          v-model="selectedTab"
        ></UiTabs>
      </div>

      <div class="baqyt-zone__content">
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
          <TheCommonAdBanner></TheCommonAdBanner>
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
          <div v-if="selectedTab?.id === 1" class="baqyt-zone__cards">
            <TheBaqytZoneBlock
              v-for="card in 6"
              :key="card"
            ></TheBaqytZoneBlock>

            <TheCommonPopularBanner
              class="baqyt-zone__banner"
            ></TheCommonPopularBanner>

            <TheBaqytZoneBlock
              v-for="card in 6"
              :key="card"
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
</template>

<script setup>
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
const options = [
  { label: "по цене", value: "price" },
  { label: "по популярности", value: "popularity" },
];
</script>

<style lang="scss" scoped>
.baqyt-zone {
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
}
</style>
