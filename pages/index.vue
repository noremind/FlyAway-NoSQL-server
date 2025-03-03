<template>
  <TheMainBanner></TheMainBanner>
  <TheMainSearchBlock></TheMainSearchBlock>

  <TheMainLinkBlocks></TheMainLinkBlocks>

  <section class="main__tours">
    <img
      class="main__tours-carving"
      src="@/assets/image/content/carving.png"
      alt="Carving"
    />

    <div class="main__tours-box">
      <div class="main__tours-inner">
        <UiIcons icon="hot" size="size-32" color="orange-200"></UiIcons>
        <h2 class="main__title title">Горящие туры</h2>
      </div>
      <nuxt-link class="main__tours-link" to="/tours"
        >Все горящие туры</nuxt-link
      >
    </div>
    <div class="main__tours-slider">
      <UiSwiper
        :pagination="{ clickable: true }"
        :autoplay="true"
        :breakpoints="{
          1100: {
            slidesPerView: 4,
          },
          924: {
            slidesPerView: 3,
          },
          640: {
            slidesPerView: 2,
          },
          320: {
            slidesPerView: 1,
          },
          0: {
            slidesPerView: 1,
          },
        }"
      >
        <swiper-slide v-for="slide in 5" :key="slide">
          <TheCommonTourCard></TheCommonTourCard>
        </swiper-slide>
      </UiSwiper>
    </div>
    <div class="main__tours-slider main__tours-slider--block">
      <TheCommonTourCard v-for="slide in 5" :key="slide"></TheCommonTourCard>
    </div>
    <UiButton
      class="main__tours-link main__tours-link--mobile"
      label="Все горящие туры"
      after-icon="chevron"
      icon-color="blue-500"
      icon-size="size-14"
      @click="router.push('/tours')"
    ></UiButton>
  </section>

  <UiSwiper :pagination="{ clickable: true }" :per-slides="1" :autoplay="true">
    <swiper-slide v-for="banner in 4" :key="banner">
      <TheCommonPopularBanner></TheCommonPopularBanner>
    </swiper-slide>
  </UiSwiper>

  <section class="main__hotels">
    <div class="main__hotels-box">
      <h2 class="main__title title">Отели</h2>
      <nuxt-link class="main__hotels-link" to="/hotels">Все отели</nuxt-link>
    </div>
    <div class="main__hotels-cards">
      <TheMainHotelCard v-for="hotel in 4" :key="4"></TheMainHotelCard>
    </div>

    <UiButton
      class="main__hotels-link main__hotels-link--mobile"
      label="Все отели"
      after-icon="chevron"
      icon-color="blue-500"
      icon-size="size-14"
      @click="router.push('/tours')"
    ></UiButton>
  </section>

  <section class="main__reviews">
    <h2 class="main__title title">Отзывы путешественников</h2>

    <div class="main__reviews-cards">
      <UiSwiper
        :breakpoints="{
          1240: { slidesPerView: 2.5 },
          992: { slidesPerView: 2.5 },
          720: { slidesPerView: 2 },
          0: { slidesPerView: 1.5 },
        }"
      >
        <swiper-slide v-for="review in 4" :key="review">
          <TheCommonReview></TheCommonReview>
        </swiper-slide>
      </UiSwiper>
    </div>
    <div class="main__reviews-cards main__reviews-cards--mobile">
      <TheCommonReview v-for="review in 2" :key="review"></TheCommonReview>
    </div>
  </section>
</template>

<script setup>
const router = useRouter();

useSeoMeta({
  title: "FlyAway - Главная страница",
  ogTitle: "FlyAway - Главная страница",
  description: "FlyAway - сайт для бронирования туров и отелей",
  ogDescription: "FlyAway - сайт для бронирования туров и отелей",
});
</script>

<style lang="scss" scoped>
.main__reviews {
}
</style>
