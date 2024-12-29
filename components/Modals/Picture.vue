<template>
  <section class="picture">
    <div class="picture__wrapper">
      <h3 class="picture__title title">Эконом</h3>

      <div class="picture__imgs">
        <UiIcons
          icon="chevron"
          class="prev-img down"
          size="size-30"
          color="surface-900"
        ></UiIcons>
        <UiSwiper
          :loop="false"
          :pagination="{ clickable: true }"
          next-btn-class=".next-img"
          prev-btn-class=".prev-img"
        >
          <swiper-slide v-for="slide in 5" :key="slide">
            <img
              class="picture__swiper-img"
              src="@/assets/image/content/main-image.png"
              alt="Image"
            />
          </swiper-slide>
        </UiSwiper>
        <UiIcons
          icon="chevron"
          class="next-img"
          size="size-30"
          color="surface-900"
        ></UiIcons>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
.picture {
  &__wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
    padding: 36px 16px;
  }
  &__imgs {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
  }
}
</style>
