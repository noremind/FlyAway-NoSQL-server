<template>
  <div class="aside">
    <div class="aside__wrapper">
      <ul class="aside__list">
        <li
          class="aside__list-item"
          :class="{ 'aside__list-item--active': selectedList.id === list.id }"
          v-for="list in lists"
          :key="list.id"
          @click="changeSelected(list)"
        >
          {{ list.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const lists = [
  {
    id: 0,
    name: "Все вопросы",
  },
  {
    id: 1,
    name: "О покупке туров",
  },
  {
    id: 2,
    name: "О бронировании отелей",
  },
  {
    id: 3,
    name: "О подарочных сертификатах",
  },
  {
    id: 4,
    name: "Об оплате и возврате средств",
  },
  {
    id: 5,
    name: "Общий функционал сайта",
  },
];
const selectedList = ref(lists[0]);

const changeSelected = (list) => {
  selectedList.value = list;
};
</script>

<style lang="scss" scoped>
.aside {
  &__wrapper {
    background-color: $white;
    border-radius: 16px;
    width: 255px;
  }
  &__list {
    display: flex;
    flex-direction: column;
    color: $surface-900;
    &-item {
      padding: 22px 16px;
      cursor: pointer;
      font-size: 14px;
      &:first-child {
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
      }
      &:last-child {
        border-bottom-left-radius: 16px;
        border-bottom-right-radius: 16px;
      }
      &--active {
        color: black;
        background-color: $blue-200;
        font-weight: 600;
      }
    }
  }
}
</style>
