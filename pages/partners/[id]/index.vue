<template>
  <section class="partner">
    <div class="partner__wrapper">
      <UiGoBack label="Партнеры" go-back="/partners"></UiGoBack>

      <div class="partner__box">
        <div class="partner__info">
          <img
            class="partner__avatar"
            src="@/assets/image/common/tour-avatar.png"
            alt="Partner"
          />
          <h2 class="partner__author">Mili Tour</h2>
          <div class="partner__review">
            <p class="partner__count">20 отзывов</p>
            <UiIcons icon="star" color="yellow-500" size="size-14"></UiIcons>
            <p class="partner__average">4,1</p>
          </div>
          <ul class="partner__list">
            <li class="partner__list-item">
              <p class="partner__text">Количество туров</p>
              <p class="partner__number">3</p>
            </li>
            <li class="partner__list-item">
              <p class="partner__text">Количество отелей</p>
              <p class="partner__number">3</p>
            </li>
            <li class="partner__list-item">
              <p class="partner__text">Количество активностей</p>
              <p class="partner__number">3</p>
            </li>
          </ul>

          <p class="partner__bold">О нас</p>
          <p class="partner__description">
            Мы организуем уникальные туры, чтобы каждый наш клиент мог открыть
            для себя самые красивые уголки природы, испытать незабываемые эмоции
            и почувствовать настоящий дух приключений. Ваш комфорт, безопасность
            и яркие впечатления — наш главный приоритет!
          </p>

          <div class="partner__baige">
            <UiIcons
              icon="circle-check"
              color="blue-500"
              size="size-24"
            ></UiIcons>
            <p class="partner__baige-text">Есть рассрочка</p>
          </div>

          <p class="partner__bold">Контакты</p>
          <ul class="partner__contacts">
            <li
              class="partner__contacts-item"
              v-for="item in contacts"
              :key="item.id"
            >
              <UiIcons
                :icon="item.icon"
                color="blue-500"
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
              <nuxt-link class="partner__block-link" to="/tours"
                >Все туры</nuxt-link
              >
            </div>
            <div class="partner__tours">
              <TheCommonTourCard v-for="card in 6" :key="card" />
            </div>
          </section>

          <section class="partner__block">
            <div class="partner__block-header">
              <h2 class="title">Отели</h2>
            </div>
            <div class="partner__hotels">
              <TheHotelsBlock v-for="hotel in 2" :key="hotel"></TheHotelsBlock>
            </div>
          </section>

          <section class="partner__block">
            <div class="partner__block-header">
              <h2 class="title">BaqytZone</h2>
            </div>
            <div class="partner__baqyt-zone">
              <TheBaqytZoneBlock
                v-for="zone in 4"
                :key="zone"
              ></TheBaqytZoneBlock>
            </div>
          </section>

          <section class="partner__block">
            <div class="partner__block-header">
              <h2 class="title">Наша команда</h2>
            </div>
            <div class="partner__teams">
              <ThePartnersEmployee
                v-for="employee in 5"
                :key="employee"
              ></ThePartnersEmployee>
            </div>
          </section>
        </div>
      </div>

      <div class="partner__footer">
        <section class="partner__reviews">
          <div class="partner__reviews-box">
            <div>
              <h3 class="partner__reviews-title">Отзывы путешественников</h3>
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

          <UiSwiper :per-slides="1.8" :loop="false">
            <swiper-slide v-for="review in 5" :key="review">
              <TheCommonReview />
            </swiper-slide>
          </UiSwiper>
        </section>
      </div>
    </div>
  </section>
</template>

<script setup>
const contacts = [
  {
    id: 1,
    icon: "globe",
    name: "website",
  },
  {
    id: 2,
    icon: "location",
    name: "location",
  },
  {
    id: 3,
    icon: "phone",
    name: "address",
  },
  {
    id: 4,
    icon: "instagram",
    name: "website",
  },
  {
    id: 5,
    icon: "youtube",
    name: "youtube",
  },
  {
    id: 6,
    icon: "tiktok",
    name: "tiktok",
  },
];
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
    color: $blue-500;
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
      color: $blue-500;
      font-weight: 600;
    }
  }
  &__baqyt-zone,
  &__tours {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 16px;
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
      color: $blue-500;
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
}
</style>
