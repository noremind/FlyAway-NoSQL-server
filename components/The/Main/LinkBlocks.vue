<template>
  <section class="blocks">
    <div class="blocks__wrapper">
      <ul class="blocks__list">
        <li class="blocks__list-item" v-for="link in links" :key="link.id">
          <img class="blocks__img" :src="link.img" :alt="link.name" />
          <h2 class="blocks__title">{{ link.name }}</h2>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import map from "@/assets/image/content/map.png";
import hotel from "@/assets/image/content/hotel.png";
import tourist from "@/assets/image/content/tourist.png";
import qazaqstanMap from "@/assets/image/content/qazaqstan-map.png";

const links = reactive([
  {
    id: 1,
    name: "Туры",
    img: map,
    link: "",
  },
  {
    id: 2,
    name: "Отели",
    img: hotel,
    link: "",
  },
  {
    id: 3,
    name: "BaqytZone",
    img: tourist,
    link: "",
  },
  {
    id: 4,
    name: "Локаций",
    img: qazaqstanMap,
    link: "",
  },
]);
</script>

<style lang="scss" scoped>
.blocks {
  &__title {
    color: $blue-500;
  }
  &__list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 36px;
  }
  &__list-item {
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.04);
    padding: 32px 22px;
    border-radius: 80px;
    background-color: $white;
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 12px;
    transition: 0.5s;
    &:hover {
      border: 1px solid $blue-500;
    }
  }
}
</style>
