<template>
  <div class="search">
    <div class="search__wrapper">
      <UiTabs v-model="selectedTab" :tabs="tabs"></UiTabs>

      <div class="search__filter">
        <div class="search__box">
          <p class="search__text">Поиск тура</p>
          <UiInput
            placeholder="Введите название"
            after-icon="lupa"
            icon-color="surface-900"
          ></UiInput>
        </div>
        <div class="search__box">
          <p class="search__text">Дата начала</p>

          <div class="search__box-calendar">
            <UiCalendar
              class="search__start-date"
              placeholder="17.12.2024"
              :have-icon="false"
            ></UiCalendar>
            <UiIcons icon="arrow" color="blue-500" size="size-14"></UiIcons>
            <UiCalendar
              class="search__start-date"
              placeholder="17.12.2024"
            ></UiCalendar>
          </div>
        </div>
        <!-- <div class="search__box">
          <p class="search__text">Дата конца</p>
          <UiCalendar
            class="search__end-date"
            placeholder="17.12.2024"
          ></UiCalendar>
        </div> -->
        <UiButton
          class="search__btn button-secondary"
          label="Найти туры"
          before-icon="lupa"
          icon-color="blue-500"
        ></UiButton>
      </div>
    </div>
  </div>
</template>

<script setup>
const tabs = reactive([
  {
    id: 1,
    name: "Туры",
    value: "tours",
  },
  {
    id: 2,
    name: "Отели",
    value: "hotels",
  },
  {
    id: 3,
    name: "Активности",
    value: "actives",
  },
]);
const selectedTab = ref(tabs[0]);
</script>

<style lang="scss" scoped>
.search {
  position: relative;
  width: 90%;
  display: flex;
  justify-content: center;
  top: -170px;
  padding: 0 12px;
  margin: 0 auto;
  min-height: 160px;
  &__wrapper {
    width: 100%;
    position: absolute;
    z-index: 5;
    box-shadow: 0px 0px 20px 0px #00000029;
    border-radius: 16px;
    max-width: 1120px;
    padding: 16px 16px 46px 16px;
    background-color: $white;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 44px;
    margin: 12px;
  }
  &__box {
    &-calendar {
      display: flex;
      border: 1px solid $surface-300;
      padding: 3px;
      align-items: center;
      border-radius: 26px;
    }
  }
  &__btn {
    max-width: 215px;
    width: 100%;
    margin: auto 0 0 0;
    padding: 12px 16px;
    white-space: nowrap;
  }
  &__text {
    color: $surface-900;
    font-weight: 400;
    font-size: 14px;
    margin-bottom: 10px;
  }
  &__filter {
    display: flex;
    gap: 36px;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
  }
  &__start-date,
  &__end-date {
    display: flex;
    margin-top: 0px;
    padding: 3.2px;
  }
}

@media (max-width: 768px) {
  .search {
    min-height: 250px;
    top: -10px;
    &__filter {
      gap: 12px;
    }
  }
}
</style>
