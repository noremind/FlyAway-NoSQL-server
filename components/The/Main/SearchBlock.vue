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
          <UiCalendar
            class="search__start-date"
            placeholder="17.12.2024"
          ></UiCalendar>
        </div>
        <div class="search__box">
          <p class="search__text">Дата конца</p>
          <UiCalendar
            class="search__end-date"
            placeholder="17.12.2024"
          ></UiCalendar>
        </div>
        <UiButton
          class="search__btn"
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
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 89px;
  &__wrapper {
    width: 100%;
    position: absolute;
    top: -170px;
    z-index: 5;
    box-shadow: 0px 0px 20px 0px #00000029;
    border-radius: 16px;
    max-width: 1120px;
    padding: 16px;
    background-color: $white;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 44px;
  }
  &__btn {
    background-color: transparent;
    border: 1px solid $blue-500;
    color: $blue-500;
    max-width: 215px;
    width: 100%;
    display: flex;
    justify-content: center;
    margin: auto 0 0 0;
    padding: 12px 16px;
    border-radius: 24px;
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
  }
  &__start-date,
  &__end-date {
    border: 1px solid $surface-300;
    padding: 10px;
    border-radius: 26px;
    display: flex;
  }
}
</style>
