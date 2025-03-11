<template>
  <UiOverlay
    :is-show="true"
    header-icon="share"
    btn-label="Выбрать"
    :have-footer="true"
    :have-favorite-icon="true"
    @close="goTo('/hotels')"
    @action="openPartialModalPayment"
  >
    <section class="details">
      <div class="details__wrapper" v-if="hotel">
        <UiGoBack class="details__go-back" label="Отели" go-back="/hotels" />

        <div class="details__box">
          <section class="details__content">
            <div class="details__header">
              <h1 class="details__title title">{{ hotel.name }}</h1>
              <div class="details__icons">
                <UiIcons icon="heart" size="size-24" color="red-500"></UiIcons>
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
                <swiper-slide v-for="slide in hotel.images" :key="slide">
                  <img
                    @click="openPreviewPicture"
                    class="details__swiper-img"
                    :src="slide"
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

            <div class="details__reviews-inner details__reviews-inner--mobile">
              <p class="details__reviews-count details__reviews-count">
                20 отзывов
              </p>
              <UiIcons icon="star" color="yellow-500" size="size-14"></UiIcons>
              <p class="details__reviews-average">{{ hotel.rating }}</p>
            </div>

            <div class="details__totals-header details__totals-header--mobile">
              <div class="details__totals-box">
                <img
                  class="details__avatar"
                  :src="hotel.partner?.logo"
                  alt="Avatar"
                />
              </div>
              <h1 class="details__title details__title--mobile title">
                {{ hotel.name }}
              </h1>
            </div>

            <div
              class="details__category-stars details__category-stars--mobile"
            >
              <UiIcons
                icon="star"
                color="yellow-500"
                v-for="star in 5"
                :key="star"
                size="size-20"
              ></UiIcons>
            </div>

            <div class="details__info">
              <p class="details__about">Об отеле</p>

              <p class="details__description" v-html="hotel.content"></p>

              <div class="details__category">
                <p class="details__category-title">Категория</p>
                <div class="details__category-stars">
                  <UiIcons
                    icon="star"
                    color="yellow-500"
                    v-for="star in Math.floor(hotel.rating)"
                    :key="star"
                    size="size-20"
                  ></UiIcons>
                </div>
                <p class="details__category-info">
                  {{ hotel.rating }} звездочный отель
                </p>
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
                        color="red-500"
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
                    Время заезда и выезда — стандартное время заселения и
                    выписки.
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
                  <TheHotelsRoom
                    v-for="room in hotel.room_types"
                    :key="room.id"
                    :room="room"
                    @select="openPartialModalPayment"
                  ></TheHotelsRoom>
                </div>
              </div>

              <div class="details__tourist-box">
                <p class="details__tourist-text">Питание</p>
                <ul class="details__tourist-list details__tourist-list--icon">
                  <li class="details__tourist-item details__tourist-item--icon">
                    <UiIcons
                      icon="check"
                      color="red-500"
                      size="size-24"
                    ></UiIcons>
                    <p>Полный пансион</p>
                  </li>
                  <li class="details__tourist-item details__tourist-item--icon">
                    <UiIcons
                      icon="check"
                      color="red-500"
                      size="size-24"
                    ></UiIcons>
                    <p>Ресторан</p>
                  </li>
                  <li class="details__tourist-item details__tourist-item--icon">
                    <UiIcons
                      icon="check"
                      color="red-500"
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
                      color="red-500"
                      size="size-24"
                    ></UiIcons>
                    <p>Проживание 1 ночь</p>
                  </li>
                  <li class="details__tourist-item details__tourist-item--icon">
                    <UiIcons
                      icon="home"
                      color="red-500"
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
                      color="red-500"
                      size="size-24"
                    ></UiIcons>
                    <p>Полный пансион</p>
                  </li>
                  <li class="details__tourist-item details__tourist-item--icon">
                    <UiIcons
                      icon="check"
                      color="red-500"
                      size="size-24"
                    ></UiIcons>
                    <p>Ресторан</p>
                  </li>
                  <li class="details__tourist-item details__tourist-item--icon">
                    <UiIcons
                      icon="check"
                      color="red-500"
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
                      color="red-500"
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
                      color="red-500"
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
                      color="red-500"
                      size="size-24"
                    ></UiIcons>
                    <p>Полный пансион</p>
                  </li>
                  <li class="details__tourist-item details__tourist-item--icon">
                    <UiIcons
                      icon="check"
                      color="red-500"
                      size="size-24"
                    ></UiIcons>
                    <p>Ресторан</p>
                  </li>
                  <li class="details__tourist-item details__tourist-item--icon">
                    <UiIcons
                      icon="check"
                      color="red-500"
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
                      color="red-500"
                      size="size-24"
                    ></UiIcons>
                    <p class="details__contacts-desc">website</p>
                  </div>
                  <div class="details__contacts-info">
                    <UiIcons
                      icon="phone"
                      color="red-500"
                      size="size-24"
                    ></UiIcons>
                    <p class="details__contacts-desc">phone number</p>
                  </div>
                  <div class="details__contacts-info">
                    <UiIcons
                      icon="location"
                      color="red-500"
                      size="size-24"
                    ></UiIcons>
                    <p class="details__contacts-desc">address</p>
                  </div>
                  <div class="details__contacts-info">
                    <UiIcons
                      icon="instagram"
                      color="red-500"
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
                  :src="hotel.partner?.logo"
                  alt="Avatar"
                />
                <p class="details__name">{{ hotel.partner?.name }}</p>
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
                color="red-500"
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

        <UiSwiper
          :loop="false"
          :breakpoints="{
            1000: {
              slidesPerView: 2.5,
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
          class="details__reviews-btn"
          label="Все отзывы"
          after-icon="chevron"
          icon-size="size-20"
          icon-color="red-500"
        ></UiButton>
      </section>
    </section>
  </UiOverlay>

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

  <!-- Mobile -->

  <!-- Step 1 -->
  <UiPartialModal
    :is-show="isOpenPartialModalPayment"
    height="85%"
    @close="closePartialModalPayment"
  >
    <template #body>
      <div class="details__partial-payment-box">
        <p class="details__bold details__bold--center">Эконом</p>

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

        <ul class="details__partial-payment-list">
          <li class="details__partial-payment-item">
            Элегантный номер с видами на море, город или горы.
          </li>
          <li class="details__partial-payment-item">
            Элегантный номер с видами на море, город или горы.
          </li>
          <li class="details__partial-payment-item">
            Элегантный номер с видами на море, город или горы.
          </li>
          <li class="details__partial-payment-item">
            Элегантный номер с видами на море, город или горы.
          </li>
        </ul>

        <div>
          <p class="details__bold">Выберите дату</p>
          <Calendar class="details__calendar" v-model="date" inline />
        </div>

        <div class="details__select-date">
          <p class="details__date">24.12.2024</p>
          <UiIcons icon="arrow" size="size-14"></UiIcons>
          <p class="details__date">26.12.2024</p>
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
          class="details__partial-payment-btn"
          label="Выбрать"
          @click="openOverlayPayment"
        ></UiButton>
      </div>
    </template>
  </UiPartialModal>

  <!-- Step 2 -->
  <UiOverlay
    :is-show="isOpenOverlayPayment"
    title="Подтвердите бронь"
    @close="closeOverlayPayment"
    btn-label="Подтвердить"
    :show-header-icons="false"
    @action="openMobileStatusPayment"
  >
    <div class="overlay-payment">
      <div class="overlay-payment__wrapper">
        <div class="overlay-payment__preview">
          <img
            class="overlay-payment__img"
            src="@/assets/image/content/tour-card.png"
            alt="Preview"
          />
          <h2 class="overlay-payment__title title">Business po kazakhsky</h2>
        </div>
        <div class="details__message">
          <UiIcons icon="circle-check" color="red-500" size="size-20"></UiIcons>
          <p class="details__message-text">Вы выбрали премиум номер</p>
        </div>
        <table class="overlay-payment__table">
          <tbody>
            <tr class="overlay-payment__tr">
              <td class="overlay-payment__td">Дата от</td>
              <td class="overlay-payment__td">25 декабря 2024</td>
            </tr>
            <tr class="overlay-payment__tr">
              <td class="overlay-payment__td">Дата до</td>
              <td class="overlay-payment__td">25 декабря 2024</td>
            </tr>
            <tr class="overlay-payment__tr overlay-payment__tr--blue">
              <td>Ваши сертификаты</td>
            </tr>
            <tr class="overlay-payment__tr">
              <td class="overlay-payment__td">Взрослый 23+</td>
              <td class="overlay-payment__td">1 билет х 15 000 ₸</td>
            </tr>
            <tr class="overlay-payment__tr">
              <td class="overlay-payment__td">Детский от 7 до 13 лет</td>
              <td class="overlay-payment__td">2 билета х 8 000 ₸</td>
            </tr>

            <tr class="overlay-payment__tr overlay-payment__tr--padding">
              <td class="overlay-payment__td overlay-payment__td">Премиум</td>
              <td class="overlay-payment__td">3 дня х 20 000 ₸</td>
            </tr>
            <tr class="overlay-payment__tr">
              <td class="overlay-payment__td overlay-payment__td--bold">
                Скидка
              </td>
              <td class="overlay-payment__td">-20%</td>
            </tr>
            <tr class="overlay-payment__tr overlay-payment__tr--padding">
              <td class="overlay-payment__td overlay-payment__td--bold">
                Итого
              </td>
              <td class="overlay-payment__td">24 800 ₸</td>
            </tr>
            <tr class="overlay-payment__tr overlay-payment__tr--blue">
              <td>Способ оплаты</td>
            </tr>
            <tr class="overlay-payment__tr">
              <td class="overlay-payment__td overlay-payment__td--box">
                <UiCheckbox
                  type="checkmark"
                  label="Банковская карта"
                ></UiCheckbox>
              </td>
              <td class="overlay-payment__td"></td>
            </tr>
            <tr class="overlay-payment__tr">
              <td class="overlay-payment__td overlay-payment__td--box">
                <UiCheckbox
                  type="checkmark"
                  label="Рассрочка на 3 месяца"
                ></UiCheckbox>
                <img
                  class="overlay-payment__td-img"
                  src="@/assets/icons/freedom-bank.svg"
                  alt="Freedom Bank"
                />
              </td>
              <td class="overlay-payment__td"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </UiOverlay>

  <!-- Step 3 -->
  <UiModal
    :is-show="isOpenMobileStatusPayment"
    max-width="600px"
    @close="closeMobileStatusPayment"
    :full-screen="true"
  >
    <ModalsStatus
      title="Наш менеджер с вами свяжется"
      status="success"
      btn-label="Перейти в Мои отели"
      go-to="/profile/my-hotels"
      @action="closeMobileStatusPayment"
    />
  </UiModal>
</template>

<script setup>
const isOpenPayment = ref(false);
const isOpenStatusPayment = ref(false);
const isOpenPreviewPicture = ref(false);
const isOpenBookingForm = ref(false);
const isOpenPartialModalPayment = ref(false);
const isOpenOverlayPayment = ref(false);
const isOpenMobileStatusPayment = ref(null);

const date = new Date();
const yandexMapInfo = ref(null);

const isMapReady = ref(false);

const hotel = ref(null);
const route = useRoute();
const getHotel = () => {
  useApi({
    url: `/hotels/${route.params.id}`,
    method: "get",
  }).then((res) => {
    hotel.value = res.data;
  });
};

getHotel();

onMounted(() => {
  getInfoMap();
});

// Step 1
const closePartialModalPayment = () => {
  isOpenPartialModalPayment.value = false;
};

const openPartialModalPayment = () => {
  isOpenPartialModalPayment.value = true;
};

// Step 2
const closeOverlayPayment = () => {
  isOpenOverlayPayment.value = false;
};

const openOverlayPayment = () => {
  isOpenPartialModalPayment.value = false;
  isOpenOverlayPayment.value = true;
};

// Step 3
const openMobileStatusPayment = () => {
  isOpenPartialModalPayment.value = false;
  isOpenMobileStatusPayment.value = true;
};

const closeMobileStatusPayment = () => {
  isOpenMobileStatusPayment.value = false;
};

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
    color: $red-500;
    &--mobile {
      display: none;
    }
  }
  &__icons {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  &__partial {
    &-info {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    &-count {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    &-payment {
      &-box {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      &-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: $red-500;
        color: $white;
        padding: 10px;
        margin-top: 12px;
        font-weight: 700;
      }
      &-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      &-item {
        list-style: disc;
        margin-left: 20px;
        font-weight: 100;
        font-size: 14px;
      }
    }
    &-title {
      font-size: 16px;
    }
    &-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    &-item {
      list-style: disc;
      margin-left: 15px;
      font-size: 12px;
    }
    &-btn {
      border: 1px solid $red-500;
      background-color: transparent;
      color: $red-500;
      font-weight: 400;
      width: 100%;
      padding: 10px;
      display: flex;
      justify-content: center;
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
  &__bold {
    font-weight: 400;
    position: relative;
    &--center {
      text-align: center;
      font-weight: 700;
      font-size: 20px;
    }
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
    color: $red-500;
    font-size: 14px;
    font-weight: 400;
  }
  &__message {
    display: flex;
    gap: 8px;
    align-items: center;
    &-text {
      color: $red-500;
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
      color: $red-500;
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
    &-stars {
      &--mobile {
        display: none;
      }
    }
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
      color: $red-500;
      font-weight: 700;
      cursor: pointer;
    }
    &-inner {
      display: flex;
      gap: 6px;
      align-items: center;
      margin-top: 8px;

      &--mobile {
        display: none;
      }
    }
    &-btn {
      display: none;
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
      background-color: $red-500;
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
      &--mobile {
        display: none;
      }
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
        color: $red-500;
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
    color: $red-500;
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

.hide {
  display: none;
}
.show {
  display: block;
}

.details .details__imgs :deep(.custom-swiper::part(pagination)) {
  position: absolute !important;
}

.details__partial-payment-box
  .details__imgs
  :deep(.custom-swiper::part(pagination)) {
  position: absolute !important;
}

.overlay-payment {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  &__preview {
    width: 100%;
  }
  &__img {
    width: 100%;
    height: 137px;
    object-fit: cover;
    border-radius: 16px;
    margin: 0 auto;
  }
  &__table {
    color: $surface-900;
    font-size: 14px;
  }
  &__tr &__td:last-child {
    text-align: right;
    font-weight: 400;
    white-space: nowrap;
  }
  &__td {
    font-weight: 100;
    padding-top: 4px;
    font-size: 14px;

    &--bold {
      font-weight: 400;
    }
    &-img {
      width: 80px;
      margin-left: 28px;
    }
    &--box {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
  }
  &__tr {
    &--padding td {
      padding-top: 24px;
    }
    &--blue {
      color: $red-500;
      font-weight: 400;
      & td {
        padding-top: 16px;
      }
    }
  }
}

@media (max-width: 375px) {
  .details {
    &__wrapper {
      margin-top: 0;
    }
    &__content {
      padding: 0;
      background-color: transparent;
      flex-direction: column;
      gap: 16px;
    }
    &__totals {
      &-header {
        &--mobile {
          justify-content: flex-start;
          display: flex;
          gap: 4px;
        }
      }
    }
    &__tourist {
      &-box {
        &--mobile {
          display: block;
          margin: 12px 0;
        }
      }
    }
    &__category {
      display: none;
      &-stars {
        &--mobile {
          display: flex;
        }
      }
    }
    &__reviews {
      &-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid $red-500;
        padding: 10px 0;
        color: $red-500;
      }
      &-link {
        display: none;
      }
      &-average,
      &-count {
        font-size: 10px;
      }
      &-inner {
        display: none;
        margin: 0;
        &--mobile {
          display: flex;
          font-size: 10px;
        }
      }
    }
    &__about {
      margin-bottom: 12px;
    }
    &__totals,
    &__tabs,
    .prev-img,
    .next-img,
    &__title,
    &__icons,
    &__imgs i,
    &__go-back {
      display: none;
    }
    &__title {
      &--mobile {
        display: block;
        color: $surface-900;
        line-height: 30px;
      }
    }
    &__contacts {
      &-inner {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    &__hot {
      display: flex;
      gap: 6px;
      align-items: center;
    }
    &__info {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    &__location {
      &-info,
      &-box {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
    }
  }
  .hide {
    display: flex !important;
    flex-direction: column;
    gap: 12px;
  }
}
</style>
