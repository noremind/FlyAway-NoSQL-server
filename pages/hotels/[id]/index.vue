<template>
  <section class="details">
    <div class="details__wrapper">
      <UiGoBack label="Отели" go-back="/hotels" />

      <div class="details__box">
        <section class="details__content">
          <div class="details__header">
            <h1 class="details__title title">Business po kazakhsky</h1>
            <div class="details__icons">
              <UiIcons icon="heart" size="size-24" color="blue-500"></UiIcons>
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
                  @click="openPreviewPicture"
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

          <div class="details__info">
            <p class="details__about">Об отеле</p>

            <p class="details__description">
              Приглашаем вас отправиться в увлекательное путешествие на
              Кольсайские озера — настоящую жемчужину Алматинской области, где
              природа поражает своей первозданной красотой и чистотой.
            </p>

            <div class="details__category">
              <p class="details__category-title">Категория</p>
              <div class="details__category-stars">
                <UiIcons
                  icon="star"
                  color="yellow-500"
                  v-for="star in 5"
                  :key="star"
                  size="size-20"
                ></UiIcons>
              </div>
              <p class="details__category-info">4 звездочный отель</p>
            </div>

            <div class="details__location">
              <p class="details__bold">Расположение</p>
              <p class="details__address">
                г. Алматы, Пересечение улиц Байтурсынова и Абая
              </p>

              <div class="details__location-info">
                <div
                  style="width: 100%; height: 400px"
                  class="details__map"
                  ref="yandexMapInfo"
                ></div>
                <div class="details__location-box">
                  <div
                    class="details__location-inner"
                    v-for="item in 4"
                    :key="item"
                  >
                    <UiIcons
                      icon="location"
                      size="size-24"
                      color="blue-500"
                    ></UiIcons>
                    <p class="details__location-text">
                      <span class="details__location-path">20 км</span> от
                      аэропорта
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="details__tourist">
            <div class="details__tourist-box">
              <p class="details__tourist-text">Политика отеля</p>
              <ul class="details__tourist-list">
                <li class="details__tourist-item">
                  Время заезда и выезда — стандартное время заселения и выписки.
                </li>
                <li class="details__tourist-item">
                  Условия отмены бронирования — возможность возврата средств.
                </li>
                <li class="details__tourist-item">
                  Депозиты — нужны ли залоги за проживание или дополнительные
                  услуги.
                </li>
                <li class="details__tourist-item">
                  Размещение с детьми и животными — есть ли ограничения.
                </li>
              </ul>
            </div>

            <div class="details__tourist-box">
              <p class="details__tourist-text">Виды номеров</p>
              <div class="details__rooms">
                <TheHotelsRoom v-for="room in 3"></TheHotelsRoom>
              </div>
            </div>

            <div class="details__tourist-box">
              <p class="details__tourist-text">Питание</p>
              <ul class="details__tourist-list details__tourist-list--icon">
                <li class="details__tourist-item details__tourist-item--icon">
                  <UiIcons
                    icon="check"
                    color="blue-500"
                    size="size-24"
                  ></UiIcons>
                  <p>Полный пансион</p>
                </li>
                <li class="details__tourist-item details__tourist-item--icon">
                  <UiIcons
                    icon="check"
                    color="blue-500"
                    size="size-24"
                  ></UiIcons>
                  <p>Ресторан</p>
                </li>
                <li class="details__tourist-item details__tourist-item--icon">
                  <UiIcons
                    icon="check"
                    color="blue-500"
                    size="size-24"
                  ></UiIcons>
                  <p>
                    Возможность заказать специальное меню (вегетарианское,
                    халяль и др.).
                  </p>
                </li>
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

            <div class="details__tourist-box">
              <p class="details__tourist-text">Платные услуги</p>
              <ul class="details__tourist-list details__tourist-list--icon">
                <li class="details__tourist-item details__tourist-item--icon">
                  <UiIcons
                    icon="check"
                    color="blue-500"
                    size="size-24"
                  ></UiIcons>
                  <p>Полный пансион</p>
                </li>
                <li class="details__tourist-item details__tourist-item--icon">
                  <UiIcons
                    icon="check"
                    color="blue-500"
                    size="size-24"
                  ></UiIcons>
                  <p>Ресторан</p>
                </li>
                <li class="details__tourist-item details__tourist-item--icon">
                  <UiIcons
                    icon="check"
                    color="blue-500"
                    size="size-24"
                  ></UiIcons>
                  <p>
                    Возможность заказать специальное меню (вегетарианское,
                    халяль и др.).
                  </p>
                </li>
              </ul>
            </div>

            <div class="details__tourist-box">
              <p class="details__tourist-text">Особенности для семей</p>
              <ul class="details__tourist-list details__tourist-list--icon">
                <li class="details__tourist-item details__tourist-item--icon">
                  <UiIcons
                    icon="check"
                    color="blue-500"
                    size="size-24"
                  ></UiIcons>
                  <p>Детские кроватки, услуги няни, детская площадка</p>
                </li>
              </ul>
            </div>

            <div class="details__tourist-box">
              <p class="details__tourist-text">Доступность</p>
              <ul class="details__tourist-list details__tourist-list--icon">
                <li class="details__tourist-item details__tourist-item--icon">
                  <UiIcons
                    icon="check"
                    color="blue-500"
                    size="size-24"
                  ></UiIcons>
                  <p>
                    Удобства для людей с ограниченными возможностями (лифты,
                    пандусы)
                  </p>
                </li>
              </ul>
            </div>

            <div class="details__tourist-box">
              <p class="details__tourist-text">Развлечения и отдых</p>
              <ul class="details__tourist-list details__tourist-list--icon">
                <li class="details__tourist-item details__tourist-item--icon">
                  <UiIcons
                    icon="check"
                    color="blue-500"
                    size="size-24"
                  ></UiIcons>
                  <p>Полный пансион</p>
                </li>
                <li class="details__tourist-item details__tourist-item--icon">
                  <UiIcons
                    icon="check"
                    color="blue-500"
                    size="size-24"
                  ></UiIcons>
                  <p>Ресторан</p>
                </li>
                <li class="details__tourist-item details__tourist-item--icon">
                  <UiIcons
                    icon="check"
                    color="blue-500"
                    size="size-24"
                  ></UiIcons>
                  <p>
                    Возможность заказать специальное меню (вегетарианское,
                    халяль и др.).
                  </p>
                </li>
              </ul>
            </div>
          </div>

          <div class="details__contacts">
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

          <p class="details__bold">Выберите дату</p>

          <Calendar class="details__calendar" v-model="date" inline />

          <div class="details__select-date">
            <p class="details__date">24.12.2024</p>
            <UiIcons icon="arrow" size="size-14"></UiIcons>
            <p class="details__date">26.12.2024</p>
          </div>

          <div class="details__message">
            <UiIcons
              icon="circle-check"
              color="blue-500"
              size="size-20"
            ></UiIcons>
            <p class="details__message-text">Вы выбрали премиум номер</p>
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
            label="Забронировать"
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
    <ModalsBookHotelPayment
      @next-step="openBookingForm"
    ></ModalsBookHotelPayment>
  </UiModal>

  <UiModal
    :is-show="isOpenStatusPayment"
    max-width="600px"
    @close="closeStatusPaymentModal"
  >
    <ModalsStatus
      title="Наш менеджер с вами свяжется"
      status="success"
      btn-label="Готово"
      @action="closeStatusPaymentModal"
    />
  </UiModal>

  <UiModal
    :is-show="isOpenPreviewPicture"
    max-width="600px"
    @close="closePreviewPicture"
  >
    <ModalsPicture></ModalsPicture>
  </UiModal>

  <UiModal
    :is-show="isOpenBookingForm"
    max-width="600px"
    @close="closeBookingForm"
  >
    <ModalsBookHotelInfo @next-step="statusPayed"></ModalsBookHotelInfo>
  </UiModal>
</template>

<script setup>
const isOpenPayment = ref(false);
const isOpenStatusPayment = ref(false);
const isOpenPreviewPicture = ref(false);
const isOpenBookingForm = ref(false);

const date = new Date();
const yandexMapInfo = ref(null);

const isMapReady = ref(false);

onMounted(() => {
  getInfoMap();
});

const statusPayed = () => {
  isOpenBookingForm.value = false;
  isOpenStatusPayment.value = true;
};

const closeBookingForm = () => {
  isOpenBookingForm.value = false;
};

const openBookingForm = () => {
  isOpenPayment.value = false;
  isOpenBookingForm.value = true;
};

const closePreviewPicture = () => {
  isOpenPreviewPicture.value = false;
};

const openPreviewPicture = () => {
  isOpenPreviewPicture.value = true;
};

const closeStatusPaymentModal = () => {
  isOpenStatusPayment.value = false;
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
  &__rooms {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  &__list-item {
    list-style: disc;
    margin-left: 26px;
  }
  &__select-date {
    display: flex;
    gap: 12px;
    align-items: center;
    width: 95%;
    margin: 0 auto;
    justify-content: space-between;
    border: 1px solid $surface-300;
    padding: 8px;
    border-radius: 26px;
  }
  &__date {
    flex-grow: 1;
    color: $blue-500;
    font-size: 14px;
    font-weight: 400;
  }
  &__message {
    display: flex;
    gap: 8px;
    align-items: center;
    &-text {
      color: $blue-500;
      font-size: 16px;
      font-weight: 400;
    }
  }

  &__location {
    display: flex;
    flex-direction: column;
    gap: 4px;
    position: relative;
    &-info {
      display: flex;
    }
    &-box {
      flex-grow: 1;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
    }
    &-inner {
      display: flex;
      gap: 4px;
      align-items: center;
    }
    &-path {
      color: $blue-500;
    }
  }
  &__map {
    max-width: 300px;
    width: 100%;
    max-height: 120px;
    border-radius: 16px;
  }
  &__category {
    display: flex;
    gap: 8px;
    align-items: center;
    color: $surface-900;
    margin: 16px 0;
    &-title {
      font-weight: 400;
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
  &__tourist {
    display: flex;
    flex-direction: column;
    gap: 26px;
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
