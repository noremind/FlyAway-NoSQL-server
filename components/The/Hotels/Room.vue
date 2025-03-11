<template>
  <section class="room">
    <div class="room__wrapper">
      <div class="room__preview">
        <div class="room__swiper">
          <UiSwiper :pagination="{ clickable: true }">
            <swiper-slide v-for="slider in room.images">
              <img class="room__img" :src="slider" :alt="room.name" />
            </swiper-slide>
          </UiSwiper>
        </div>
      </div>

      <div class="room__content">
        <div class="room__box">
          <div class="room__texts">
            <h2 class="room__title">{{ room.name }}</h2>
            <ul class="room__list">
              <li v-for="item in 1" :key="item" class="room__list-item">
                {{ room.description }}
              </li>
            </ul>
          </div>

          <div class="room__benefits">
            <UiButton
              :label="`${Math.round(room.price)}₸`"
              class="room__price room__price--mobile"
            ></UiButton>
            <UiButton
              label="Выбрать"
              class="room__btn button-secondary"
              @click="emit('select')"
            ></UiButton>
            <!-- <UiButton
              before-icon="circle-check"
              icon-size="size-20"
              icon-color="white"
              label="Вы выбрали"
              class="room__btn room__btn--active"
            ></UiButton> -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits(["select"]);

const props = defineProps({
  room: {
    type: Object,
    default: () => {},
  },
});
</script>

<style lang="scss" scoped>
.room {
  &__wrapper {
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
    border-radius: 16px;
    display: flex;
    height: 141px;

    width: 100%;
  }
  &__preview {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 8px;
    max-width: 188px;
    width: 100%;
    height: 141px;
  }
  &__swiper {
    position: absolute;
    top: 0;
    z-index: 1;
    left: 0;
    width: 100%;
  }
  &__img {
    width: 100%;
    object-fit: cover;
    border-radius: 16px;
    height: 141px;
  }
  &__content {
    padding: 8px;
    width: 100%;
  }
  &__box {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }
  &__texts {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 4px 0;
    max-width: 346px;
    width: 100%;
  }
  &__title {
    font-size: 16px;
    font-weight: 700;
    color: $surface-900;
  }
  &__benefits {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 4px;
    justify-content: flex-start;
    flex-grow: 1;
    margin: auto 0 0 0;
    &-text {
      font-size: 10px;
      color: $surface-900;
    }
  }
  &__btn {
    justify-content: center;
    &--active {
      background-color: $red-500;
      color: $white;
    }
  }
  &__price {
    background-color: $red-500;
    padding: 4px 12px;
    border-radius: 24px;
    color: $white;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
  }
  &__list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    &-item {
      font-size: 12px;
      list-style: disc;
      margin-left: 20px;
    }
  }
}

.room__swiper :deep(.custom-swiper::part(pagination)) {
  position: absolute !important;
}

@media (max-width: 375px) {
  .room {
    &__box {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    &__preview,
    &__img {
      max-width: 145px;
      object-fit: cover;
    }
    &__price {
      &--mobile {
        background-color: transparent;
        color: $red-500;
        justify-content: flex-start;
        padding: 0;
      }
    }
  }
}
</style>
