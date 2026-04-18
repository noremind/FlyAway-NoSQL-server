<template>
  <UiSwiper :loop="true" :autoplay="true">
    <swiper-slide v-for="banner in banners" :key="banner._id || banner.image">
      <section class="banner">
        <div class="banner__wrapper">
          <div class="banner__img-wrapper">
            <img
              class="banner__img"
              :src="banner.image"
              :alt="banner.title"
            />
          </div>

          <div class="banner__content">
            <h1 class="banner__title">{{ banner.title }}</h1>
            <p class="banner__description">{{ banner.description }}</p>

            <UiButton
              class="banner__btn button-secondary"
              afterIcon="arrow"
              iconColor="red-400"
              :label="banner.buttonText || 'подробнее'"
              iconSize="size-26"
              @click="openBannerLink(banner.link)"
            ></UiButton>
          </div>
        </div>
      </section>
    </swiper-slide>
  </UiSwiper>
</template>

<script setup>
import bannerFallback from "@/assets/image/content/main-image.png";

const router = useRouter();
const response = await useFetchSsr({
  url: "/banners",
});

const banners = computed(() => {
  if (response?.data?.length) return response.data;

  return [
    {
      _id: "fallback-banner",
      title: "FlyAway",
      description: "Туры и отдых в одном месте",
      image: bannerFallback,
      link: "/tours",
      buttonText: "Подробнее",
    },
  ];
});

const openBannerLink = (link) => {
  if (!link) return;

  if (String(link).startsWith("http")) {
    window.open(link, "_blank");
    return;
  }

  router.push(link);
};
</script>

<style lang="scss" scoped>
.banner {
  &__wrapper {
    position: relative;
    margin: 36px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: clamp(20.438rem, 10.916rem + 47.61vw, 47.813rem);
  }
  &__img-wrapper {
    max-width: 1240px;
    width: 100%;
    position: absolute;
    top: 0;
    border-radius: 16px;
    overflow: hidden;
    padding: 12px 0px;
  }
  &__img {
    object-fit: cover;
    width: 100%;
    filter: brightness(40%);
    pointer-events: none;
    border-radius: 16px;
  }
  &__content {
    position: relative;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 26px;
    padding: 16px;
  }
  &__title {
    font-size: clamp(2rem, -0.348rem + 11.74vw, 8.75rem); //140
    font-family: "Miama Nueva", sans-serif;
    text-align: center;
    color: $red-400;
    font-style: italic;
  }
  &__description {
    // font-size: 20px;
    font-size: clamp(0.875rem, 0.745rem + 0.65vw, 1.25rem);
    font-weight: 300;
    text-align: center;
    color: $white;
  }
  &__btn {
    width: 150px;
  }
}

@media (max-width: 768px) {
  .banner {
    &__wrapper {
      display: block;
      height: auto;
    }
    &__img {
      border-radius: 20px;
      height: clamp(20.438rem, -24.105rem + 92.8vw, 47.813rem);
      &-wrapper {
        z-index: 2;
      }
    }
    &__content {
      z-index: 3;
    }
    &__title {
      margin-top: 64px;
    }
  }
}
</style>
