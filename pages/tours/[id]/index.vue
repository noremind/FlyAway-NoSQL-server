<template>
  <section class="details">
    <div class="details__wrapper">
      <UiGoBack label="Туры" go-back="/tours" />

      <div class="details__box">
        <section class="details__content">
          <div class="details__header">
            <h1 class="details__title title">Однодевный тур на Кольсай</h1>
            <div class="details__icons">
              <UiIcons icon="heart" size="size-24" color="blue-500"></UiIcons>
              <div class="details__icons-box">
                <UiIcons icon="hot" size="size-24" color="orange-200"></UiIcons>
                <p class="details__icons-text">Горящий тур</p>
              </div>
            </div>
          </div>

          <div class="details__imgs">
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
                  class="details__swiper-img"
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

          <UiTabs
            class="details__tabs"
            :tabs="tabs"
            v-model="selectedTab"
            type="line"
          ></UiTabs>

          <div v-if="selectedTab.id === 1" class="details__info">
            <p class="details__about">О туре</p>

            <p class="details__description">
              Приглашаем вас отправиться в увлекательное путешествие на
              Кольсайские озера — настоящую жемчужину Алматинской области, где
              природа поражает своей первозданной красотой и чистотой.
            </p>

            <div>
              <p class="details__text">Что вас ждет:</p>
              <ul class="details__list">
                <li class="details__list-item">
                  Три живописных озера на разных высотах, окруженные густыми
                  хвойными лесами и величественными горами. Насладитесь
                  кристально чистой водой и свежим воздухом, вдали от городской
                  суеты.
                </li>
                <li class="details__list-item">
                  Прогулки и трекинг по живописным маршрутам среди альпийских
                  лугов, где вы сможете насладиться захватывающими видами и
                  встретить уникальных животных и птиц.
                </li>
              </ul>
            </div>

            <div class="details__info-box">
              <p class="details__bold">Продолжительность</p>
              <p class="details__info-text">2 дня и 1 ночь</p>
            </div>

            <div class="details__info-box details__info-box--start">
              <p class="details__bold">Даты</p>
              <ul class="details__info-list">
                <li class="details__info-item">25 декабря 2024</li>
                <li class="details__info-item">25 декабря 2024</li>
              </ul>
            </div>

            <div class="details__location">
              <p class="details__bold">Место отправления</p>
              <p class="details__address">
                г. Алматы, Пересечение улиц Байтурсынова и Абая
              </p>

              <div
                style="width: 100%; height: 400px"
                class="details__map"
                ref="yandexMapInfo"
              ></div>
            </div>

            <div class="details__programma">
              <p class="details__bold">Программа тура</p>

              <ul class="details__programma-list">
                <li class="details__programma-item">
                  <p class="details__time">06:00</p>
                  <p class="details__programma-text">
                    Сбор на месте отправления
                  </p>
                </li>
                <li class="details__programma-item">
                  <p class="details__time">06:00</p>
                  <p class="details__programma-text">
                    Сбор на месте отправления
                  </p>
                </li>
              </ul>
            </div>
          </div>

          <div v-if="selectedTab.id === 2" class="details__road">
            <section class="details__road-box">
              <h3 class="details__road-text">
                Места, которые вы успеете посетить
              </h3>
              <div class="details__road-cards">
                <TheToursPlaces v-for="place in 4"></TheToursPlaces>
              </div>
            </section>

            <section class="details__road-box">
              <h3 class="details__road-text">Карта тура</h3>
              <div
                class="details__road-map"
                style="width: 100%; height: 400px"
                ref="yandexMapPath"
              ></div>
            </section>
          </div>

          <div v-if="selectedTab.id === 3" class="details__tourist">
            <div class="details__tourist-box">
              <p class="details__tourist-text">Что взять с собой?</p>
              <ul class="details__tourist-list">
                <li class="details__tourist-item">Одежда</li>
                <li class="details__tourist-item">Одежда</li>
                <li class="details__tourist-item">Одежда</li>
                <li class="details__tourist-item">Одежда</li>
              </ul>
            </div>

            <div class="details__tourist-box">
              <p class="details__tourist-text">
                Рекомендации и важная информация
              </p>
              <ul class="details__tourist-list">
                <li class="details__tourist-item">Одежда</li>
                <li class="details__tourist-item">Одежда</li>
                <li class="details__tourist-item">Одежда</li>
                <li class="details__tourist-item">Одежда</li>
              </ul>
            </div>

            <div class="details__tourist-box">
              <p class="details__tourist-text">Условия</p>
              <ul class="details__tourist-list details__tourist-list--icon">
                <li class="details__tourist-item details__tourist-item--icon">
                  <UiIcons
                    icon="star-unfill"
                    color="blue-500"
                    size="size-24"
                  ></UiIcons>
                  <p>Проживание 1 ночь</p>
                </li>
                <li class="details__tourist-item details__tourist-item--icon">
                  <UiIcons
                    icon="home"
                    color="blue-500"
                    size="size-24"
                  ></UiIcons>
                  <p>Одноместный номер в Лоло</p>
                </li>
                <li class="details__tourist-item details__tourist-item--icon">
                  <UiIcons
                    icon="x-icon"
                    color="orange-200"
                    size="size-24"
                  ></UiIcons>
                  <p>Личные расходы</p>
                </li>
              </ul>
            </div>
          </div>

          <div v-if="selectedTab.id === 4" class="details__contacts">
            <div class="details__contacts-box">
              <p class="details__contacts-text">Контакты</p>

              <div class="details__contacts-inner">
                <div class="details__contacts-info">
                  <UiIcons
                    icon="globe"
                    color="blue-500"
                    size="size-24"
                  ></UiIcons>
                  <p class="details__contacts-desc">website</p>
                </div>
                <div class="details__contacts-info">
                  <UiIcons
                    icon="phone"
                    color="blue-500"
                    size="size-24"
                  ></UiIcons>
                  <p class="details__contacts-desc">phone number</p>
                </div>
                <div class="details__contacts-info">
                  <UiIcons
                    icon="location"
                    color="blue-500"
                    size="size-24"
                  ></UiIcons>
                  <p class="details__contacts-desc">address</p>
                </div>
                <div class="details__contacts-info">
                  <UiIcons
                    icon="instagram"
                    color="blue-500"
                    size="size-24"
                  ></UiIcons>
                  <p class="details__contacts-desc">instagram</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div class="details__totals">
          <div class="details__totals-header">
            <div class="details__totals-box">
              <img
                class="details__avatar"
                src="@/assets/image/common/tour-avatar.png"
                alt="Avatar"
              />
              <p class="details__name">Mili Tour</p>
            </div>
            <p class="details__baige">-20%</p>
          </div>

          <Calendar class="details__calendar" v-model="date" inline />

          <p class="details__bold">Выберите билет</p>

          <div class="details__input-box">
            <p class="details__input-name">Взрослый 23+</p>
            <p class="details__input-price">15 000 ₸</p>
            <div class="details__input-inner">
              <UiIcons
                icon="chevron"
                color="surface-900"
                size="size-14"
                class="details__input-icon down"
              ></UiIcons>

              <UiInput class="details__input"></UiInput>

              <UiIcons
                icon="chevron"
                color="surface-900"
                size="size-14"
              ></UiIcons>
            </div>
          </div>

          <div class="details__input-box">
            <p class="details__input-name">Детский от 7 до 13 лет</p>
            <p class="details__input-price">8 000 ₸</p>
            <div class="details__input-inner">
              <UiIcons
                icon="chevron"
                color="surface-900"
                size="size-14"
                class="details__input-icon down"
              ></UiIcons>

              <UiInput class="details__input"></UiInput>

              <UiIcons
                icon="chevron"
                color="surface-900"
                size="size-14"
              ></UiIcons>
            </div>
          </div>

          <div class="details__input-box">
            <p class="details__bold">Промокод</p>
            <UiInput
              class="details__input details__input--bg"
              placeholder="Введите промокод"
            ></UiInput>
            <p class="details__accept">Применить</p>
          </div>

          <ul class="details__totals-list">
            <li class="details__totals-item">
              <p class="details__totals-answer">Всего:</p>
              <p class="details__totals-question">45 000 ₸</p>
            </li>
            <li class="details__totals-item">
              <p class="details__totals-answer">Скидка:</p>
              <p
                class="details__totals-question details__totals-question--discount"
              >
                -20%
              </p>
            </li>
            <li class="details__totals-item details__totals-item--result">
              <p class="details__totals-answer">Итого:</p>
              <p class="details__totals-question details__totals-question">
                36 000₸
              </p>
            </li>
          </ul>

          <UiButton
            label="Перейти к оплате"
            class="details__totals-btn"
            @click="openPaymentModal"
          ></UiButton>
        </div>
      </div>
    </div>
    <section class="details__reviews">
      <div class="details__reviews-box">
        <div>
          <h3 class="details__reviews-title">Отзывы путешественников</h3>
          <div class="details__reviews-inner">
            <p class="details__reviews-count">20 отзывов</p>
            <UiIcons icon="star" color="yellow-500" size="size-14"></UiIcons>
            <p class="details__reviews-average">4,1</p>
          </div>
        </div>
        <nuxt-link class="details__reviews-link" to="/tours/1/reviews"
          >Все отзывы</nuxt-link
        >
      </div>

      <UiSwiper :per-slides="2.5" :loop="false">
        <swiper-slide v-for="review in 5" :key="review">
          <TheCommonReview />
        </swiper-slide>
      </UiSwiper>
    </section>
  </section>

  <UiModal
    :is-show="isOpenPayment"
    max-width="600px"
    @close="closePaymentModal"
  >
    <ModalsPayment @payed="statusPayed"></ModalsPayment>
  </UiModal>

  <UiModal
    :is-show="isOpenStatusPayment"
    max-width="600px"
    @close="closePaymentModal"
  >
    <ModalsStatus
      v-if="isOpenStatusPayment === 'success'"
      title="Ваш заказ оплачен"
      status="success"
      btn-label="Перейти в Мои туры"
      go-to="/profile/my-tours"
      @action="closeStatusPaymentModal"
    />
  </UiModal>
</template>

<script setup>
const isOpenPayment = ref(false);
const isOpenStatusPayment = ref(null);

const yandexMapInfo = ref(null);
const yandexMapPath = ref(null);
const tabs = reactive([
  {
    id: 1,
    name: "О туре",
  },
  {
    id: 2,
    name: "Маршрут",
  },
  {
    id: 3,
    name: "Для туристов",
  },
  {
    id: 4,
    name: "Контакты",
  },
]);
const selectedTab = ref(tabs[0]);
const isMapReady = ref(false);

onMounted(() => {
  nextTick(() => {
    switch (selectedTab.value.id) {
      case 1:
        getInfoMap();
        break;
      case 2:
        getPathMap();
        break;

      default:
        break;
    }
  });
});

const statusPayed = () => {
  isOpenPayment.value = false;
  isOpenStatusPayment.value = "success";
};

const closeStatusPaymentModal = () => {
  isOpenStatusPayment.value = null;
};

const openPaymentModal = () => {
  isOpenPayment.value = true;
};

const closePaymentModal = () => {
  isOpenPayment.value = false;
};

const getInfoMap = () => {
  if (typeof ymaps !== "undefined") {
    ymaps.ready(() => {
      const map = new ymaps.Map(yandexMapInfo.value, {
        center: [43.238949, 76.889709],
        zoom: 10,
        controls: [],
      });
      const placemark = new ymaps.Placemark(
        [55.751574, 37.573856],
        {
          balloonContent: "This is Almaty!",
        },
        {
          preset: "islands#icon",
          iconColor: "#0095b6",
        }
      );

      map.geoObjects.add(placemark);
    });
    isMapReady.value = true;
  } else {
    console.error("Yandex Maps API is not loaded.");
  }
};

const getPathMap = () => {
  if (typeof ymaps !== "undefined") {
    ymaps.ready(() => {
      const map = new ymaps.Map(yandexMapPath.value, {
        center: [43.238949, 76.889709],
        zoom: 10,
        controls: [],
      });
      const placemark = new ymaps.Placemark(
        [55.751574, 37.573856],
        {
          balloonContent: "This is Almaty!",
        },
        {
          preset: "islands#icon",
          iconColor: "#0095b6",
        }
      );

      map.geoObjects.add(placemark);
    });
    isMapReady.value = true;
  } else {
    console.error("Yandex Maps API is not loaded.");
  }
};

watch(
  () => selectedTab.value.id,
  () => {
    switch (selectedTab.value.id) {
      case 1:
        getInfoMap();
        break;
      case 2:
        getPathMap();
        break;

      default:
        break;
    }
  }
);
</script>

<style lang="scss" scoped>
.details {
  &__wrapper {
    width: 100%;
    margin: 40px 0 26px 0;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  &__box {
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 16px;
  }
  &__content {
    background-color: $white;
    border-radius: 16px;
    padding: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 26px;
  }
  &__calendar {
    width: 100%;
    border: none !important;
  }
  &__totals {
    background-color: $white;
    border-radius: 16px;
    padding: 16px;
    max-width: 360px;
    width: 100%;
  }
  &__header {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: center;
  }
  &__title {
    color: $blue-500;
  }
  &__icons {
    display: flex;
    gap: 12px;
    align-items: center;
    &-box {
      display: flex;
      gap: 6px;
      align-items: center;
    }
  }
  &__imgs {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
  }
  &__tabs {
    margin: 0 auto;
  }
  &__info {
    display: flex;
    flex-direction: column;
    gap: 16px;
    color: $surface-900;
    &-box {
      display: flex;
      gap: 6px;
      align-items: center;
      &--start {
        align-items: flex-start;
      }
    }
    &__list {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    &-item {
      color: $blue-500;
      font-weight: 400;
    }
  }
  &__bold {
    font-weight: 400;
    position: relative;
  }
  &__about {
    font-weight: 400;
    font-size: 16px;
  }
  &__list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  &__list-item {
    list-style: disc;
    margin-left: 26px;
  }
  &__location {
    display: flex;
    flex-direction: column;
    gap: 4px;
    position: relative;
  }
  &__map {
    max-width: 300px;
    width: 100%;
    max-height: 120px;
    border-radius: 16px;
  }
  &__programma {
    &-list {
      display: flex;
      flex-direction: column;
      margin: 12px 0;
      gap: 6px;
    }
    &-item {
      display: flex;
      align-items: center;
      gap: 10px;
      color: $blue-500;
    }
    &-text {
      color: $surface-900;
    }
  }
  &__time {
    padding: 4px 8px;
    border-radius: 16px;
    background-color: $blue-200;
  }
  &__reviews {
    margin: 16px 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
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
  &__avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
  &__name {
    font-weight: 400;
  }
  &__baige {
    padding: 4px 8px;
    background-color: $orange-200;
    border-radius: 16px;
    font-size: 14px;
    color: $white;
  }
  &__totals {
    color: $surface-900;
    display: flex;
    flex-direction: column;
    gap: 16px;
    height: 100%;
    &-btn {
      background-color: $blue-500;
      display: flex;
      justify-content: center;
      align-items: center;
      color: $white;
      padding: 12px;
    }
    &-header {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
    }
    &-box {
      display: flex;
      gap: 6px;
      align-items: center;
    }
    &-list {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    &-item {
      font-weight: 400;
      display: flex;
      gap: 4px;
      align-items: center;
      font-size: 14px;
      &--result {
        color: $blue-500;
      }
    }
    &-question {
      &--discount {
        color: $orange-200;
      }
    }
  }
  &__bold {
    font-weight: 400;
  }
  &__input {
    width: 100%;
    &--bg {
      background-color: $surface-150;
      border-radius: 16px;
    }
    &-box {
      display: flex;
      flex-direction: column;
      gap: 6px;
      color: $surface-900;
    }
    &-name {
      font-weight: 400;
      font-size: 14px;
    }
    &-price {
      font-size: 14px;
    }
    &-inner {
      display: flex;
      gap: 4px;
      justify-content: space-between;
      align-items: center;
    }
  }
  &__accept {
    color: $blue-500;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
  }
  &__road {
    display: flex;
    flex-direction: column;
    gap: 44px;
    position: relative;
    &-text {
      margin-bottom: 16px;
      font-size: 16px;
    }
    &-cards {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
    }
    &-map {
      max-width: 812px;
      width: 100%;
      border-radius: 16px;
      max-height: 430px;
    }
  }
  &__tourist {
    display: flex;
    flex-direction: column;
    gap: 16px;
    color: $surface-900;
    &-list {
      &--icon {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
    }
    &-item {
      list-style-type: disc;
      margin-left: 28px;
      &--icon {
        display: flex;
        gap: 6px;
        align-items: center;
        margin-left: 0;
      }
    }
    &-text {
      margin-bottom: 12px;
      font-weight: 400;
    }
  }
  &__contacts {
    color: $surface-900;
    font-size: 14px;
    &-text {
      font-weight: 400;
      font-size: 16px;
      margin-bottom: 12px;
    }
    &-inner {
      display: grid;
      grid-template-columns: repeat(2, 200px);
      gap: 16px;
    }
    &-info {
      display: flex;
      gap: 6px;
      align-items: center;
    }
  }
}
</style>
