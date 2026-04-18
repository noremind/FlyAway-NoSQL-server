<template>
  <UiOverlay
    :is-show="true"
    header-icon="share"
    btn-label="Выбрать билет"
    :have-footer="true"
    :have-favorite-icon="true"
    @close="goTo('/tours')"
    @action="openPartialModalPayment"
  >
    <section v-if="tour" class="details">
      <div class="details__wrapper">
        <UiGoBack class="details__go-back" label="Туры" go-back="/tours" />

        <div class="details__box">
          <section class="details__content">
            <div class="details__header">
              <h1 class="details__title title">{{ tour.title }}</h1>
              <div class="details__icons">
                <UiIcons icon="heart" size="size-24" color="blue-500"></UiIcons>
                <div v-if="tour.is_hot" class="details__icons-box">
                  <UiIcons
                    icon="hot"
                    size="size-24"
                    color="orange-200"
                  ></UiIcons>
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
                <swiper-slide v-for="(image, index) in galleryImages" :key="`${image}-${index}`">
                  <img
                    class="details__swiper-img"
                    :src="image"
                    :alt="tour.title"
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

            <div class="details__totals-header details__totals-header--mobile">
              <div class="details__totals-box">
                <img
                  class="details__avatar"
                  :src="partnerAvatar"
                  :alt="partnerTitle"
                />
                <p class="details__name">{{ partnerTitle }}</p>
              </div>
              <div
                class="details__reviews-inner details__reviews-inner--mobile"
              >
                <p class="details__reviews-count details__reviews-count">
                  {{ reviewsCount }}
                </p>
                <UiIcons
                  icon="star"
                  color="yellow-500"
                  size="size-14"
                ></UiIcons>
                <p class="details__reviews-average">{{ ratingLabel }}</p>
              </div>
            </div>

            <h1 class="details__title details__title--mobile title">
              {{ tour.title }}
            </h1>

            <div v-if="tour.is_hot" class="details__icons details__icons--mobile">
              <div class="details__icons-box">
                <UiIcons icon="hot" size="size-24" color="orange-200"></UiIcons>
                <p class="details__icons-text">Горящий тур</p>
              </div>
            </div>

            <UiTabs
              class="details__tabs"
              :tabs="tabs"
              v-model="selectedTab"
              type="line"
            ></UiTabs>

            <div
              class="details__info hide"
              :class="{ show: selectedTab.id === 1 }"
            >
              <p class="details__about">О туре</p>

              <p class="details__description">
                {{ tour.description || "Описание скоро появится." }}
              </p>

              <div v-if="highlights.length">
                <p class="details__text">Что вас ждет:</p>
                <ul class="details__list">
                  <li
                    v-for="highlight in highlights"
                    :key="highlight"
                    class="details__list-item"
                  >
                    {{ highlight }}
                  </li>
                </ul>
              </div>

              <div class="details__info-box">
                <p class="details__bold">Продолжительность</p>
                <p class="details__info-text">{{ tour.duration || "Уточняется" }}</p>
              </div>

              <div v-if="displayDates.length" class="details__info-box details__info-box--start">
                <p class="details__bold">Даты</p>
                <ul class="details__info-list">
                  <li
                    v-for="dateItem in displayDates"
                    :key="dateItem.key"
                    class="details__info-item"
                  >
                    {{ dateItem.label }}
                  </li>
                </ul>
              </div>

              <div class="details__location">
                <p class="details__bold">Место отправления</p>
                <p class="details__address">
                  {{ departureAddress }}
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
                  <li
                    v-for="(step, index) in program"
                    :key="`${step.time}-${step.text}-${index}`"
                    class="details__programma-item"
                  >
                    <p class="details__time">{{ step.time }}</p>
                    <p class="details__programma-text">
                      {{ step.text }}
                    </p>
                  </li>
                </ul>
              </div>
            </div>

            <div
              class="details__road hide"
              :class="{ show: selectedTab.id === 2 }"
            >
              <section class="details__road-box">
                <h3 class="details__road-text">
                  Места, которые вы успеете посетить
                </h3>
                <div class="details__road-cards">
                  <TheToursPlaces
                    v-for="(place, index) in routePlaces"
                    :key="`${place.title}-${index}`"
                    :title="place.title"
                    :image="place.image"
                  ></TheToursPlaces>
                </div>
              </section>

              <section class="details__road-box">
                <h3 class="details__road-text">Карта тура</h3>
                <div
                  class="details__road-map"
                  :style="routeMapBackgroundStyle"
                  ref="yandexMapPath"
                ></div>
              </section>
            </div>

            <div
              class="details__tourist hide"
              :class="{ show: selectedTab.id === 3 }"
            >
              <div class="details__tourist-box">
                <p class="details__tourist-text">Что взять с собой?</p>
                <ul class="details__tourist-list">
                  <li
                    v-for="item in packingList"
                    :key="item"
                    class="details__tourist-item"
                  >
                    {{ item }}
                  </li>
                </ul>
              </div>

              <div class="details__tourist-box">
                <p class="details__tourist-text">
                  Рекомендации и важная информация
                </p>
                <ul class="details__tourist-list">
                  <li
                    v-for="item in recommendations"
                    :key="item"
                    class="details__tourist-item"
                  >
                    {{ item }}
                  </li>
                </ul>
              </div>

              <div class="details__tourist-box">
                <p class="details__tourist-text">Условия</p>
                <ul class="details__tourist-list details__tourist-list--icon">
                  <li
                    v-for="item in includes"
                    :key="`include-${item}`"
                    class="details__tourist-item details__tourist-item--icon"
                  >
                    <UiIcons
                      icon="star-unfill"
                      color="blue-500"
                      size="size-24"
                    ></UiIcons>
                    <p>{{ item }}</p>
                  </li>
                  <li
                    v-for="item in excludes"
                    :key="`exclude-${item}`"
                    class="details__tourist-item details__tourist-item--icon"
                  >
                    <UiIcons
                      icon="x-icon"
                      color="orange-200"
                      size="size-24"
                    ></UiIcons>
                    <p>{{ item }}</p>
                  </li>
                </ul>
              </div>
            </div>

            <div
              class="details__contacts hide"
              :class="{ show: selectedTab.id === 4 }"
            >
              <div class="details__contacts-box">
                <p class="details__contacts-text">Контакты</p>

                <div class="details__contacts-inner">
                  <div class="details__contacts-info">
                    <UiIcons
                      icon="globe"
                      color="blue-500"
                      size="size-24"
                    ></UiIcons>
                    <p class="details__contacts-desc">{{ contactWebsite }}</p>
                  </div>
                  <div class="details__contacts-info">
                    <UiIcons
                      icon="phone"
                      color="blue-500"
                      size="size-24"
                    ></UiIcons>
                    <p class="details__contacts-desc">{{ contactPhone }}</p>
                  </div>
                  <div class="details__contacts-info">
                    <UiIcons
                      icon="location"
                      color="blue-500"
                      size="size-24"
                    ></UiIcons>
                    <p class="details__contacts-desc">{{ contactAddress }}</p>
                  </div>
                  <div class="details__contacts-info">
                    <UiIcons
                      icon="instagram"
                      color="blue-500"
                      size="size-24"
                    ></UiIcons>
                    <p class="details__contacts-desc">{{ contactInstagram }}</p>
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
                  :src="partnerAvatar"
                  :alt="partnerTitle"
                />
                <p class="details__name">{{ partnerTitle }}</p>
              </div>
              <p class="details__baige">-{{ discountLabel }}%</p>
            </div>

            <Calendar class="details__calendar" v-model="date" inline />
            <p v-if="selectedDateTimeRange" class="details__calendar-time">
              {{ selectedDateTimeRange }}
            </p>

            <p class="details__bold">Выберите билет</p>

            <div
              v-for="(ticket, index) in ticketTypes"
              :key="`${ticket.title}-${index}`"
              class="details__input-box"
            >
              <p class="details__input-name">{{ ticket.title }}</p>
              <p class="details__input-price">{{ formatMoney(ticket.price) }} ₸</p>
              <div class="details__input-inner">
                <UiIcons
                  icon="chevron"
                  color="surface-900"
                  size="size-14"
                  class="details__input-icon down"
                ></UiIcons>

                <UiInput class="details__input" model-value="0"></UiInput>

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
                <p class="details__totals-question">{{ formatMoney(basePrice) }} ₸</p>
              </li>
              <li class="details__totals-item">
                <p class="details__totals-answer">Скидка:</p>
                <p
                  class="details__totals-question details__totals-question--discount"
                >
                  -{{ discountLabel }}%
                </p>
              </li>
              <li class="details__totals-item details__totals-item--result">
                <p class="details__totals-answer">Итого:</p>
                <p class="details__totals-question details__totals-question">
                  {{ formatMoney(discountedPrice) }} ₸
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
              <p class="details__reviews-count">{{ reviewsCount }}</p>
              <UiIcons icon="star" color="yellow-500" size="size-14"></UiIcons>
              <p class="details__reviews-average">{{ ratingLabel }}</p>
            </div>
          </div>
          <nuxt-link class="details__reviews-link" :to="`/tours/${route.params.id}/reviews`"
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
          icon-color="blue-500"
          @click="goTo(`/tours/${route.params.id}/reviews`)"
        ></UiButton>
      </section>
    </section>
  </UiOverlay>

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

  <!-- Mobile -->

  <!-- Step 1 -->
  <UiPartialModal
    :is-show="isOpenPartialModalPayment"
    height="85%"
    @close="closePartialModalPayment"
  >
    <template #body>
      <div class="details__partial-payment-box">
        <p class="details__bold">Выберите дату</p>

        <Calendar class="details__calendar" v-model="date" inline />
        <p v-if="selectedDateTimeRange" class="details__calendar-time">
          {{ selectedDateTimeRange }}
        </p>

        <p class="details__bold">Выберите билет</p>

        <div
          v-for="(ticket, index) in ticketTypes"
          :key="`${ticket.title}-${index}-mobile`"
          class="details__input-box"
        >
          <p class="details__input-name">{{ ticket.title }}</p>
          <p class="details__input-price">{{ formatMoney(ticket.price) }} ₸</p>
          <div class="details__input-inner">
            <UiIcons
              icon="chevron"
              color="surface-900"
              size="size-14"
              class="details__input-icon down"
            ></UiIcons>

            <UiInput class="details__input" model-value="0"></UiInput>

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
            <p class="details__totals-question">{{ formatMoney(basePrice) }} ₸</p>
          </li>
          <li class="details__totals-item">
            <p class="details__totals-answer">Скидка:</p>
            <p
              class="details__totals-question details__totals-question--discount"
            >
              -{{ discountLabel }}%
            </p>
          </li>
          <li class="details__totals-item details__totals-item--result">
            <p class="details__totals-answer">Итого:</p>
            <p class="details__totals-question details__totals-question">
              {{ formatMoney(discountedPrice) }} ₸
            </p>
          </li>
        </ul>

        <UiButton
          class="details__partial-payment-btn"
          label="Перейти к оплате"
          @click="openOverlayPayment"
        ></UiButton>
      </div>
    </template>
  </UiPartialModal>

  <!-- Step 2 -->
  <UiOverlay
    :is-show="isOpenOverlayPayment"
    title="Платежи"
    @close="closeOverlayPayment"
    btn-label="Оплатить"
    :show-header-icons="false"
    @action="openMobileStatusPayment"
  >
    <div class="overlay-payment">
      <div class="overlay-payment__wrapper">
        <div class="overlay-payment__preview">
          <img
            class="overlay-payment__img"
            :src="coverImage"
            :alt="tour.title"
          />
          <h2 class="overlay-payment__title title">
            {{ tour.title }}
          </h2>
        </div>
        <table class="overlay-payment__table">
          <tbody>
            <tr class="overlay-payment__tr">
              <td class="overlay-payment__td">Дата</td>
              <td class="overlay-payment__td">{{ selectedDateLabel }}</td>
            </tr>
            <tr class="overlay-payment__tr overlay-payment__tr--blue">
              <td>Ваши билеты</td>
            </tr>
            <tr
              v-for="(ticket, index) in ticketTypes"
              :key="`${ticket.title}-${index}-checkout`"
              class="overlay-payment__tr"
            >
              <td class="overlay-payment__td">{{ ticket.title }}</td>
              <td class="overlay-payment__td">{{ formatMoney(ticket.price) }} ₸</td>
            </tr>
            <tr class="overlay-payment__tr overlay-payment__tr--padding">
              <td class="overlay-payment__td payment__td--bold">Скидка</td>
              <td class="overlay-payment__td">-{{ discountLabel }}%</td>
            </tr>
            <tr class="overlay-payment__tr">
              <td class="overlay-payment__td overlay-payment__td--bold">
                Промокод
              </td>
              <td class="overlay-payment__td">0 ₸</td>
            </tr>
            <tr class="overlay-payment__tr overlay-payment__tr--padding">
              <td class="overlay-payment__td overlay-payment__td--bold">
                Итого
              </td>
              <td class="overlay-payment__td">{{ formatMoney(discountedPrice) }} ₸</td>
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
      title="Ваш заказ оплачен"
      status="success"
      btn-label="Перейти в Мои туры"
      go-to="/profile/my-tours"
      @action="closeMobileStatusPayment"
    />
  </UiModal>
</template>

<script setup>
import partnerPlaceholder from "@/assets/image/common/tour-avatar.png";
import tourPlaceholder from "@/assets/image/content/main-image.png";

const route = useRoute();
const { createMap } = useYandexMaps();

const isOpenPayment = ref(false);
const isOpenStatusPayment = ref(null);
const isOpenPartialModalPayment = ref(false);
const isOpenOverlayPayment = ref(false);
const isOpenMobileStatusPayment = ref(null);

const yandexMapInfo = ref(null);
const yandexMapPath = ref(null);
const infoMap = shallowRef(null);
const pathMap = shallowRef(null);

const tabs = reactive([
  { id: 1, name: "О туре" },
  { id: 2, name: "Маршрут" },
  { id: 3, name: "Для туристов" },
  { id: 4, name: "Контакты" },
]);
const selectedTab = ref(tabs[0]);

const response = await useFetchSsr({
  url: `/tours/${route.params.id}`,
  method: "get",
});

const tour = ref(response?.data || {});

const normalizeString = (value) => String(value || "").trim();

const normalizeStringList = (value) =>
  Array.isArray(value)
    ? value.map((item) => normalizeString(item)).filter(Boolean)
    : [];

const normalizeObjectList = (value) =>
  Array.isArray(value) ? value.filter((item) => item && typeof item === "object") : [];

const parseDateValue = (value) => {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const text = normalizeString(value);
  if (!text) {
    return null;
  }

  if (text.includes(".")) {
    const [day, month, year] = text.split(".");
    if (!day || !month || !year) {
      return null;
    }

    const parsed = new Date(`${year}-${month}-${day}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDateLabel = (value) => {
  const parsed = parseDateValue(value);

  if (!parsed) {
    return normalizeString(value);
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
};

const normalizeDateKey = (value) => {
  const parsed = parseDateValue(value);

  if (!parsed) {
    return normalizeString(value);
  }

  return [
    parsed.getFullYear(),
    String(parsed.getMonth() + 1).padStart(2, "0"),
    String(parsed.getDate()).padStart(2, "0"),
  ].join("-");
};

const formatTimeRange = (item) => {
  const from = normalizeString(item?.timeFrom);
  const to = normalizeString(item?.timeTo);

  if (!from && !to) {
    return "";
  }

  return [from, to].filter(Boolean).join(" - ");
};

const formatMoney = (value) => Number(value || 0).toLocaleString("ru-RU");

const galleryImages = computed(() => {
  const images = [tour.value?.avatar, ...(tour.value?.images || [])].filter(Boolean);
  return images.length ? [...new Set(images)] : [tourPlaceholder];
});

const coverImage = computed(() => galleryImages.value[0] || tourPlaceholder);
const partnerTitle = computed(
  () => tour.value?.partner?.title || "FlyAway Partner",
);
const partnerAvatar = computed(
  () =>
    tour.value?.partner?.logo ||
    tour.value?.partner?.avatar ||
    partnerPlaceholder,
);
const ratingLabel = computed(() => {
  const rating = Number(tour.value?.rating) || Number(tour.value?.partner?.rating) || 0;
  return rating.toFixed(1).replace(".", ",");
});
const reviewsCount = computed(
  () => `${Number(tour.value?.reviewsCount || 0)} отзывов`,
);
const highlights = computed(() => normalizeStringList(tour.value?.highlights));
const routePlaces = computed(() => {
  return normalizeObjectList(tour.value?.routePlaces)
    .map((item) => ({
      title: normalizeString(item?.title),
      image: normalizeString(item?.image),
    }))
    .filter((item) => item.title || item.image);
});
const packingList = computed(() => normalizeStringList(tour.value?.packingList));
const recommendations = computed(() =>
  normalizeStringList(tour.value?.recommendations),
);
const includes = computed(() => normalizeStringList(tour.value?.includes));
const excludes = computed(() => normalizeStringList(tour.value?.excludes));
const program = computed(() => {
  return normalizeObjectList(tour.value?.program)
    .map((item) => ({
      time: normalizeString(item?.time) || "Время",
      text: normalizeString(item?.text),
    }))
    .filter((item) => item.time || item.text);
});

const contactWebsite = computed(
  () =>
    tour.value?.contacts?.website ||
    tour.value?.partner?.contacts?.website ||
    tour.value?.partner?.website ||
    "-",
);
const contactPhone = computed(
  () =>
    tour.value?.contacts?.phone ||
    tour.value?.partner?.contacts?.phone ||
    tour.value?.partner?.phone ||
    "-",
);
const contactAddress = computed(
  () =>
    tour.value?.contacts?.address ||
    tour.value?.partner?.contacts?.address ||
    tour.value?.partner?.address ||
    "-",
);
const contactInstagram = computed(
  () =>
    tour.value?.contacts?.instagram ||
    tour.value?.partner?.contacts?.instagram ||
    tour.value?.partner?.instagram ||
    "-",
);

const departureAddress = computed(() => {
  const address = [
    normalizeString(tour.value?.departureCity),
    normalizeString(tour.value?.departurePoint),
  ]
    .filter(Boolean)
    .join(", ");

  return (
    address ||
    normalizeString(tour.value?.departureLocation?.address) ||
    normalizeString(tour.value?.departureLocation?.label) ||
    "-"
  );
});

const availabilityDates = computed(() =>
  normalizeObjectList(tour.value?.availabilityDates),
);
const dateDetails = computed(() => normalizeObjectList(tour.value?.dateDetails));

const displayDates = computed(() => {
  const detailMap = new Map(
    dateDetails.value.map((item) => [normalizeDateKey(item?.date), item]),
  );
  const availabilityMap = new Map(
    availabilityDates.value.map((item) => [normalizeDateKey(item?.date), item]),
  );
  const sourceDates = [
    ...availabilityDates.value.map((item) => item?.date),
    ...dateDetails.value.map((item) => item?.date),
    ...(tour.value?.dates || []),
  ]
    .map((item) => normalizeString(item))
    .filter(Boolean);

  return [...new Set(sourceDates)].map((dateValue, index) => {
    const detail = detailMap.get(normalizeDateKey(dateValue));
    const availability = availabilityMap.get(normalizeDateKey(dateValue));
    const parts = [
      formatDateLabel(dateValue),
      formatTimeRange(availability),
      normalizeString(detail?.text),
    ].filter(Boolean);

    return {
      key: `${normalizeDateKey(dateValue)}-${index}`,
      label: parts.join(" • "),
    };
  });
});

const firstAvailableDate = computed(() => {
  return (
    availabilityDates.value.find((item) => normalizeString(item?.date))?.date ||
    dateDetails.value.find((item) => normalizeString(item?.date))?.date ||
    tour.value?.dates?.[0] ||
    null
  );
});

const date = ref(parseDateValue(firstAvailableDate.value) || new Date());

watch(
  firstAvailableDate,
  (value) => {
    const parsed = parseDateValue(value);

    if (parsed) {
      date.value = parsed;
    }
  },
  { immediate: true },
);

const selectedDateAvailability = computed(() => {
  const selectedKey = normalizeDateKey(date.value);
  return (
    availabilityDates.value.find(
      (item) => normalizeDateKey(item?.date) === selectedKey,
    ) || null
  );
});

const selectedDateLabel = computed(() => {
  return formatDateLabel(date.value) || "Дата уточняется";
});

const selectedDateTimeRange = computed(() => {
  const range = formatTimeRange(selectedDateAvailability.value);
  return range ? `Время: ${range}` : "";
});

const ticketTypes = computed(() => {
  const items = normalizeObjectList(tour.value?.ticketTypes)
    .map((item) => ({
      title: normalizeString(item?.title),
      subtitle: normalizeString(item?.subtitle),
      price: Number(item?.price) || 0,
    }))
    .filter((item) => item.title || item.subtitle || item.price);

  return items.length
    ? items
    : [{ title: "Стандартный билет", subtitle: "", price: Number(tour.value?.price) || 0 }];
});

const basePrice = computed(() => {
  return Number(tour.value?.price) || Number(ticketTypes.value[0]?.price) || 0;
});

const discountLabel = computed(() => Math.max(0, Number(tour.value?.discount) || 0));

const discountedPrice = computed(() => {
  if (!discountLabel.value) {
    return basePrice.value;
  }

  return Math.max(
    0,
    Math.round(basePrice.value - (basePrice.value * discountLabel.value) / 100),
  );
});

const routeMapBackgroundStyle = computed(() => {
  const image = normalizeString(tour.value?.routeMapImage);

  if (!image) {
    return {};
  }

  return {
    backgroundImage: `url(${image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
});

const mapCenter = computed(() => {
  const x = Number(tour.value?.departureLocation?.x);
  const y = Number(tour.value?.departureLocation?.y);

  if (Number.isFinite(x) && Number.isFinite(y)) {
    return [x, y];
  }

  return [76.889709, 43.238949];
});

const destroyMap = (mapRef) => {
  if (mapRef.value && typeof mapRef.value.destroy === "function") {
    mapRef.value.destroy();
  }

  mapRef.value = null;
};

const mountInfoMap = async () => {
  if (!yandexMapInfo.value || infoMap.value) {
    return;
  }

  try {
    infoMap.value = await createMap({
      container: yandexMapInfo.value,
      center: mapCenter.value,
      zoom: 12,
      markerCoordinates: mapCenter.value,
      markerText: departureAddress.value === "-" ? tour.value?.title : departureAddress.value,
    });
  } catch (error) {
    console.error(error);
  }
};

const mountPathMap = async () => {
  if (normalizeString(tour.value?.routeMapImage) || !yandexMapPath.value || pathMap.value) {
    return;
  }

  try {
    pathMap.value = await createMap({
      container: yandexMapPath.value,
      center: mapCenter.value,
      zoom: 10,
      markerCoordinates: mapCenter.value,
      markerText: tour.value?.title || "Маршрут тура",
    });
  } catch (error) {
    console.error(error);
  }
};

watch(
  () => selectedTab.value?.id,
  async (tabId) => {
    await nextTick();

    if (tabId === 1) {
      await mountInfoMap();
    }

    if (tabId === 2) {
      await mountPathMap();
    }
  },
);

onMounted(async () => {
  await nextTick();
  await mountInfoMap();

  if (selectedTab.value?.id === 2) {
    await mountPathMap();
  }
});

onBeforeUnmount(() => {
  destroyMap(infoMap);
  destroyMap(pathMap);
});

const closePartialModalPayment = () => {
  isOpenPartialModalPayment.value = false;
};

const openPartialModalPayment = () => {
  isOpenPartialModalPayment.value = true;
};

const openMobileStatusPayment = () => {
  isOpenPartialModalPayment.value = false;
  isOpenMobileStatusPayment.value = true;
};

const closeMobileStatusPayment = () => {
  isOpenMobileStatusPayment.value = false;
};

const closeOverlayPayment = () => {
  isOpenOverlayPayment.value = false;
};

const openOverlayPayment = () => {
  isOpenPartialModalPayment.value = false;
  isOpenOverlayPayment.value = true;
};

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
  &__calendar-time {
    margin-top: -8px;
    color: $red-500;
    font-size: 14px;
    font-weight: 400;
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
  }
  &__icons {
    display: flex;
    gap: 12px;
    align-items: center;
    &--mobile {
      display: none;
    }
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
      color: $red-500;
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
      color: $red-500;
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
    &-btn {
      display: none;
    }
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
      height: 430px;
      border-radius: 16px;
      max-height: 430px;
      overflow: hidden;
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

.hide {
  display: none;
}
.show {
  display: flex;
}

.details .details__imgs :deep(.custom-swiper::part(pagination)) {
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
          display: flex;
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
    &__go-back {
      display: none;
    }
    &__road {
      &-cards {
        overflow-x: scroll;
      }
      &-map {
        max-height: 175px;
        border-radius: 16px;
      }
    }
    &__title {
      &--mobile {
        display: block;
        color: $surface-900;
        line-height: 30px;
      }
    }
    &__icons {
      &--mobile {
        display: flex;
      }
    }
    &__contacts {
      &-inner {
        grid-template-columns: repeat(2, 1fr);
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
