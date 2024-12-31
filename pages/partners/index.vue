<template>
  <section class="partners">
    <div class="partners__wrapper">
      <div class="partners__header">
        <h1 class="partners__title title">Партнеры</h1>
      </div>

      <div class="partners__content">
        <div class="partners__content-left">
          <section class="partners__filters">
            <div class="partners__filters-header">
              <UiIcons
                icon="filter-burger"
                size="size-36"
                color="blue-500"
              ></UiIcons>
              <h2 class="partners__filters-title">Фильтр</h2>
            </div>

            <div class="partners__filters-box">
              <UiInput
                placeholder="Введите название"
                after-icon="lupa"
                icon-color="surface-900"
                label="Поиск по названию"
              ></UiInput>

              <UiHashTag :tags="tags"></UiHashTag>
            </div>
          </section>
          <TheCommonAdBanner></TheCommonAdBanner>
        </div>
        <div class="partners__block">
          <section class="partners__sort">
            <h2 class="partners__sort-title">Сортировка</h2>
            <UiCheckbox
              v-for="(item, index) in options"
              :key="index"
              :label="item.label"
            ></UiCheckbox>
          </section>

          <div class="partners__cards">
            <ThePartnersCard v-for="card in 12" :key="card"></ThePartnersCard>
          </div>

          <UiPagination class="partners__pagination"></UiPagination>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
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
</script>

<style lang="scss" scoped>
.partners {
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
    display: grid;
    background-color: $white;
    padding: 16px;
    grid-template-columns: repeat(4, 1fr);
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
}
</style>
