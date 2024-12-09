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
      <nuxt-link class="main__link">Все горящие туры</nuxt-link>
    </div>
    <UiSwiper
      :pagination="{ clickable: true }"
      :per-slides="4"
      :autoplay="true"
    >
      <swiper-slide v-for="slide in 5" :key="slide">
        <TheCommonTourCard></TheCommonTourCard>
      </swiper-slide>
    </UiSwiper>
  </section>

  <UiSwiper :pagination="{ clickable: true }" :per-slides="1" :autoplay="true">
    <swiper-slide v-for="banner in 4" :key="banner">
      <TheMainPopularBanner></TheMainPopularBanner>
    </swiper-slide>
  </UiSwiper>

  <section class="main__hotels">
    <div class="main__hotels-box">
      <h2 class="main__title title">Отели</h2>
      <nuxt-link class="main__link">Все отели</nuxt-link>
    </div>
    <div class="main__hotels-cards">
      <TheMainHotelCard v-for="hotel in 4" :key="4"></TheMainHotelCard>
    </div>
  </section>

  <section class="main__reviews">
    <h2 class="main__title title">Отзывы путешественников</h2>

    <div class="main__reviews-cards">
      <UiSwiper :per-slides="2.5">
        <swiper-slide v-for="review in 4" :key="review">
          <TheMainReview></TheMainReview>
        </swiper-slide>
      </UiSwiper>
    </div>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped></style>
