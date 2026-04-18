<template>
  <UiOverlay
    :is-show="true"
    header-icon="share"
    :have-footer="true"
    @close="goTo('/partners')"
  >
    <section class="partner">
      <div class="partner__wrapper" v-if="!!partner">
        <UiGoBack
          class="partner__go-back"
          label="Партнеры"
          go-back="/partners"
        ></UiGoBack>

        <div class="partner__box">
          <div class="partner__info">
            <img
              class="partner__avatar"
              src="@/assets/image/common/tour-avatar.png"
              alt="Partner"
            />
            <h2 class="partner__author">{{ partner.title }}</h2>
            <div class="partner__review">
              <p class="partner__count">{{ partner?.review_count }} отзывов</p>
              <UiIcons icon="star" color="yellow-500" size="size-14"></UiIcons>
              <p class="partner__average">{{ partner.rating }}</p>
            </div>
            <ThePartnersCard class="partner__info-card"></ThePartnersCard>
            <ul class="partner__list">
              <li class="partner__list-item">
                <p class="partner__text">Количество туров</p>
                <p class="partner__number">{{ partner.tours?.length }}</p>
              </li>
              <li class="partner__list-item">
                <p class="partner__text">Количество отелей</p>
                <p class="partner__number">{{ partner.hotels?.length }}</p>
              </li>
            </ul>

            <p class="partner__bold">О нас</p>
            <p class="partner__description">
              {{ partner.description }}
            </p>

            <p class="partner__bold">Контакты</p>
            <ul class="partner__contacts">
              <li
                class="partner__contacts-item"
                v-for="item in contacts"
                :key="item.id"
              >
                <UiIcons
                  :icon="item.icon"
                  color="red-500"
                  size="size-24"
                ></UiIcons>
                <p class="partner__contacts-text">{{ item.name }}</p>
              </li>
            </ul>
          </div>
          <div class="partner__content">
            <section class="partner__block">
              <div class="partner__block-header">
                <h2 class="title">Туры</h2>
                <nuxt-link
                  v-if="partner.tours?.length > 5"
                  class="partner__block-link"
                  to="/tours"
                  >Все туры</nuxt-link
                >
              </div>
              <div class="partner__tours" v-if="partner?.tours.length">
                <TheCommonTourCard
                  v-for="tour in partner?.tours"
                  :key="tour._id"
                  :tour="tour"
                />
              </div>
              <p v-else>Пока пусто</p>
            </section>

            <section class="partner__block">
              <div class="partner__block-header">
                <h2 class="title">Отели</h2>
              </div>
              <div class="partner__hotels" v-if="partner?.hotels.length">
                <!-- <TheHotelsBlock
                  v-for="hotel in 2"
                  :key="hotel"
                ></TheHotelsBlock> -->
              </div>
              <p v-else>Пока пусто</p>
            </section>
          </div>

          <UiTabs
            class="partner__tabs"
            type="line"
            v-model="selectedTab"
            :tabs="tabs"
          ></UiTabs>

          <div class="partner__tours partner__tours--mobile" v-if="!!partner">
            <TheCommonTourCard v-for="card in 6" :key="card" />
          </div>

          <UiButton
            class="partner__btn button-secondary partner__btn--mobile"
            label="Все туры"
            after-icon="chevron"
            icon-color="red-500"
            icon-size="size-20"
          ></UiButton>
        </div>

        <div class="partner__footer">
          <section class="partner__reviews">
            <div class="partner__reviews-box">
              <div>
                <h3 class="partner__reviews-title">Отзывы посетителей</h3>
                <div class="partner__reviews-inner">
                  <p class="partner__reviews-count">20 отзывов</p>
                  <UiIcons
                    icon="star"
                    color="yellow-500"
                    size="size-14"
                  ></UiIcons>
                  <p class="partner__reviews-average">4,1</p>
                </div>
              </div>
              <nuxt-link class="partner__reviews-link" to="/tours/1/reviews"
                >Все отзывы</nuxt-link
              >
            </div>

            <UiSwiper
              :loop="false"
              :breakpoints="{
                1000: {
                  slidesPerView: 1.8,
                },
                375: {
                  slidesPerView: 1,
                },
                0: {
                  slidesPerView: 1,
                },
              }"
            >
              <swiper-slide v-for="review in 5" :key="review">
                <TheCommonReview />
              </swiper-slide>
            </UiSwiper>

            <UiButton
              class="partner__btn button-secondary partner__btn--mobile"
              label="Все отзывы"
              after-icon="chevron"
              icon-color="red-500"
              icon-size="size-20"
            ></UiButton>
          </section>
        </div>
      </div>
    </section>
  </UiOverlay>
</template>

<script setup>
const isOpenOverlayMobile = ref(false);
const partner = ref(null);

const route = useRoute();

useFetchSsr({
  url: `/partners/${route.params.id}`,
  method: "get",
}).then((res) => {
  partner.value = res.data;
});

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
]);
const selectedTab = ref(tabs[0]);

let contacts;

watchEffect(() => {
  contacts = [
    {
      id: 1,
      icon: "globe",
      name: partner.value?.contacts.website,
    },
    {
      id: 2,
      icon: "location",
      name: partner.value?.contacts.address,
    },
    {
      id: 3,
      icon: "phone",
      name: partner.value?.contacts.phone,
    },
  ];
});
</script>

<style lang="scss" scoped>
.partner {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: 36px;
    margin: 36px 0;
    color: $surface-900;
    position: relative;
  }
  &__box {
    display: flex;
    gap: 16px;
    position: relative;
  }
  &__info {
    background-color: $white;
    border-radius: 16px;
    padding: 16px;
    width: 255px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    height: 100%;
  }
  &__avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    margin: 0 auto;
  }
  &__author {
    font-size: 24px;
    font-weight: 700;
    margin: 0 auto;
  }
  &__review {
    display: flex;
    gap: 4px;
    align-items: center;
    margin: 0 auto;
  }
  &__count {
    font-size: 12.5px;
    color: $surface-400;
  }
  &__average {
    font-size: 12.5px;
    font-weight: 400;
  }
  &__list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    &-item {
      display: flex;
      gap: 4px;
      align-items: center;
    }
  }
  &__text {
    font-size: 12px;
    color: $surface-400;
  }
  &__number {
    color: $red-500;
    font-weight: 400;
    font-size: 14px;
  }
  &__bold {
    font-weight: 400;
  }
  &__description {
    font-size: 14px;
  }
  &__baige {
    display: flex;
    gap: 8px;
    align-items: center;
    &-text {
      font-size: 14px;
      font-weight: 400;
    }
  }
  &__contacts {
    display: flex;
    flex-direction: column;
    gap: 8px;
    &-item {
      display: flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
    }
  }
  &__content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  &__block {
    padding: 16px;
    border-radius: 16px;
    background-color: $white;
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    &-header {
      display: flex;
      justify-content: space-between;
      gap: 4px;
      align-items: center;
    }
    &-link {
      color: $red-500;
      font-weight: 600;
    }
  }
  &__tours {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    &--mobile {
      display: none;
    }
  }
  &__tabs {
    display: none;
  }
  &__hotels {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  &__teams {
    display: flex;
    gap: 36px;
    justify-content: center;
    align-items: center;
  }
  &__reviews {
    margin: 16px 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: calc(100% - 255px - 16px);
    position: absolute;
    right: 0;
    bottom: 0;
    &-box {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
    }
    &-link {
      color: $red-500;
      font-weight: 700;
      cursor: pointer;
    }
    &-inner {
      display: flex;
      gap: 6px;
      align-items: center;
      margin-top: 8px;
    }
    &-count {
      font-size: 14px;
      color: $surface-400;
    }
    &-average {
      font-size: 14px;
      color: $surface-900;
      font-weight: 400;
    }
    &-cards {
      margin: 12px 0;
      display: flex;
      justify-content: space-between;
      gap: 16px;
    }
  }
  &__footer {
    position: relative;
    height: 395px;
  }
  &__info-card {
    display: none;
  }
  &__tabs {
    margin: 0 auto;
  }
  &__btn {
    display: none;
  }
}

@media (max-width: 375px) {
  .partner {
    &__wrapper {
      padding: 0;
    }
    &__box {
      display: flex;
      flex-direction: column;
    }
    &__footer {
      height: 450px;
    }
    &__info {
      width: 100%;
      padding: 0;
      background-color: transparent;
    }
    &__btn {
      &--mobile {
        display: flex;
        margin: 0 auto;
        width: 100%;
      }
    }
    &__info-card {
      display: flex;
    }
    &__avatar,
    &__author,
    &__list,
    &__content,
    &__go-back,
    &__review {
      display: none;
    }
    &__tabs {
      display: flex;
    }
    &__tours {
      &--mobile {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 6px;
      }
    }
    &__reviews {
      display: flex;
      position: absolute;
      width: 100%;
      &-inner {
        display: none;
      }
      &-link {
        display: none;
      }
    }
  }
}
</style>
