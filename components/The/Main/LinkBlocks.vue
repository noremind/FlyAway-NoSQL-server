<template>
  <section class="blocks">
    <div class="blocks__wrapper">
      <ul class="blocks__list">
        <li class="blocks__list-item" v-for="link in links" :key="link.id">
          <nuxt-link :to="link.link" class="blocks__list-link">
            <img class="blocks__img" :src="link.img" :alt="link.name" />
            <h2 class="blocks__title">{{ link.name }}</h2>
          </nuxt-link>
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
    link: "/tours",
  },
  {
    id: 2,
    name: "Отели",
    img: hotel,
    link: "/hotels",
  },
  {
    id: 3,
    name: "BaqytZone",
    img: tourist,
    link: "/baqyt-zone",
  },
  {
    id: 4,
    name: "Локаций",
    img: qazaqstanMap,
    link: "/locations",
  },
]);
</script>

<style lang="scss" scoped>
.blocks {
  &__wrapper {
    margin-top: 40px;
  }
  &__title {
    color: $blue-500;
  }
  &__list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: clamp(0.75rem, -1.691rem + 5.08vw, 2.25rem);
    flex-wrap: wrap;
  }
  &__list-link {
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.04);
    padding: 32px 22px;
    border-radius: 80px;
    background-color: $white;
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 12px;
    transition: 0.5s;
    border: 1px solid transparent;
    &:hover {
      border: 1px solid $blue-500;
    }
  }
}
@media (max-width: 768px) {
  .blocks {
    &__wrapper {
      margin-top: 90px;
    }
    &__list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      &-item {
        width: 100%;
        justify-content: center;
        padding: 16px 22px;
      }
    }
  }
}

@media (max-width: 584px) {
  .blocks {
    &__wrapper {
      margin-top: 130px;
    }
  }
}

@media (max-width: 567px) {
  .blocks {
    &__wrapper {
      margin-top: 210px;
    }
  }
}
</style>
