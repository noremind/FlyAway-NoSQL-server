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
    <section class="details" v-if="tour">
      <div class="details__wrapper">
        <UiGoBack class="details__go-back" label="Туры" go-back="/tours" />

        <div class="details__box">
          <section class="details__content">
            <div class="details__header">
              <h1 class="details__title title">{{ tour.title }}</h1>

              <div class="details__icons">
                <UiIcons icon="heart" size="size-24" color="red-500" />
                <div class="details__icons-box" v-if="tour.is_hot">
                  <UiIcons icon="hot" size="size-24" color="orange-200" />
                  <p class="details__icons-text">Горящий тур</p>
                </div>
              </div>
            </div>

            <div class="details__gallery">
              <UiIcons
                icon="chevron"
                class="prev-img down"
                size="size-30"
                color="surface-900"
              />

              <UiSwiper
                :loop="false"
                :pagination="{ clickable: true }"
                next-btn-class=".next-img"
                prev-btn-class=".prev-img"
              >
                <swiper-slide
                  v-for="(image, index) in galleryImages"
                  :key="`${image}-${index}`"
                >
                  <img class="details__gallery-image" :src="image" :alt="tour.title" />
                </swiper-slide>
              </UiSwiper>

              <UiIcons
                icon="chevron"
                class="next-img"
                size="size-30"
                color="surface-900"
              />
            </div>

            <UiTabs
              class="details__tabs"
              :tabs="tabs"
              v-model="selectedTab"
              type="line"
            />

            <div v-if="selectedTab.id === 1" class="details__section">
              <p v-if="tour.description" class="details__description">
                {{ tour.description }}
              </p>

              <div v-if="tour.highlights?.length" class="details__block">
                <p class="details__block-title">Что вас ждет</p>
                <ul class="details__list">
                  <li
                    v-for="highlight in tour.highlights"
                    :key="highlight"
                    class="details__list-item"
                  >
                    {{ highlight }}
                  </li>
                </ul>
              </div>

              <div class="details__facts">
                <div v-if="tour.duration" class="details__fact">
                  <p class="details__block-title">Продолжительность</p>
                  <p class="details__fact-text">{{ tour.duration }}</p>
                </div>

                <div v-if="tour.dates?.length" class="details__fact">
                  <p class="details__block-title">Даты</p>
                  <ul class="details__meta-list">
                    <li v-for="dateItem in tour.dates" :key="dateItem">
                      {{ dateItem }}
                    </li>
                  </ul>
                </div>
              </div>

              <div
                v-if="tour.departureCity || tour.departurePoint || tour.departureLocation"
                class="details__block"
              >
                <p class="details__block-title">Место отправления</p>
                <p class="details__fact-text">
                  {{ [tour.departureCity, tour.departurePoint].filter(Boolean).join(", ") }}
                </p>

                <div v-if="tour.departureLocation" class="details__map-card">
                  <p class="details__map-title">{{ tour.departureLocation.label || "Точка на карте" }}</p>
                  <p class="details__map-text">
                    {{ tour.departureLocation.address || "Место выбрано на карте" }}
                  </p>
                  <p class="details__map-text">
                    {{ tour.departureLocation.x }}, {{ tour.departureLocation.y }}
                  </p>
                </div>
              </div>

              <div v-if="tour.program?.length" class="details__block">
                <p class="details__block-title">Программа тура</p>
                <ul class="details__schedule">
                  <li
                    v-for="(step, index) in tour.program"
                    :key="`${step.time}-${step.text}-${index}`"
                    class="details__schedule-item"
                  >
                    <span class="details__schedule-time">{{ step.time }}</span>
                    <span class="details__schedule-text">{{ step.text }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div v-else-if="selectedTab.id === 2" class="details__section">
              <div v-if="tour.routePlaces?.length" class="details__block">
                <p class="details__block-title">Места по маршруту</p>

                <div class="details__places">
                  <article
                    v-for="(place, index) in tour.routePlaces"
                    :key="`${place.title}-${index}`"
                    class="details__place"
                  >
                    <img
                      class="details__place-image"
                      :src="place.image || coverImage"
                      :alt="place.title || tour.title"
                    />
                    <p class="details__place-title">{{ place.title || "Точка маршрута" }}</p>
                  </article>
                </div>
              </div>

              <div v-if="tour.routeMapImage" class="details__block">
                <p class="details__block-title">Карта тура</p>
                <img
                  class="details__route-map"
                  :src="tour.routeMapImage"
                  :alt="`Маршрут ${tour.title}`"
                />
              </div>
            </div>

            <div v-else-if="selectedTab.id === 3" class="details__section">
              <div v-if="tour.packingList?.length" class="details__block">
                <p class="details__block-title">Что взять с собой</p>
                <ul class="details__list">
                  <li
                    v-for="item in tour.packingList"
                    :key="item"
                    class="details__list-item"
                  >
                    {{ item }}
                  </li>
                </ul>
              </div>

              <div v-if="tour.recommendations?.length" class="details__block">
                <p class="details__block-title">Рекомендации</p>
                <ul class="details__list">
                  <li
                    v-for="item in tour.recommendations"
                    :key="item"
                    class="details__list-item"
                  >
                    {{ item }}
                  </li>
                </ul>
              </div>

              <div class="details__includes-grid">
                <div v-if="tour.includes?.length" class="details__block">
                  <p class="details__block-title">Включено</p>
                  <ul class="details__feature-list">
                    <li
                      v-for="item in tour.includes"
                      :key="item"
                      class="details__feature details__feature--good"
                    >
                      <UiIcons icon="star-unfill" color="red-500" size="size-20" />
                      <span>{{ item }}</span>
                    </li>
                  </ul>
                </div>

                <div v-if="tour.excludes?.length" class="details__block">
                  <p class="details__block-title">Не включено</p>
                  <ul class="details__feature-list">
                    <li
                      v-for="item in tour.excludes"
                      :key="item"
                      class="details__feature details__feature--bad"
                    >
                      <UiIcons icon="x-icon" color="orange-200" size="size-20" />
                      <span>{{ item }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div v-else class="details__section">
              <div class="details__contacts">
                <div
                  v-for="contact in contactItems"
                  :key="contact.label"
                  class="details__contact"
                >
                  <UiIcons :icon="contact.icon" color="red-500" size="size-20" />
                  <div>
                    <p class="details__contact-label">{{ contact.label }}</p>
                    <p class="details__contact-value">{{ contact.value }}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside class="details__totals">
            <div class="details__partner">
              <div class="details__partner-box">
                <img class="details__avatar" :src="partnerImage" :alt="partnerTitle" />

                <div>
                  <p class="details__partner-name">{{ partnerTitle }}</p>
                </div>
              </div>

              <p v-if="Number(tour.discount) > 0" class="details__badge">
                -{{ Number(tour.discount) }}%
              </p>
            </div>

            <p class="details__aside-title">Выберите дату</p>
            <Calendar class="details__calendar" v-model="date" inline />

            <div class="details__block details__block--aside">
              <p class="details__aside-title">Выберите билет</p>

              <div
                v-for="(ticket, index) in ticketTypes"
                :key="`${ticket.title}-${index}`"
                class="details__ticket"
              >
                <div class="details__ticket-head">
                  <div>
                    <p class="details__ticket-title">{{ ticket.title }}</p>
                    <p v-if="ticket.subtitle" class="details__ticket-subtitle">
                      {{ ticket.subtitle }}
                    </p>
                  </div>
                  <p class="details__ticket-price">{{ formatMoney(ticket.price) }} ₸</p>
                </div>

                <UiInput class="details__ticket-input" model-value="0" :disabled="true" />
              </div>
            </div>

            <div class="details__block details__block--aside">
              <p class="details__aside-title">Промокод</p>
              <UiInput placeholder="Введите промокод" />
              <p class="details__apply">Применить</p>
            </div>

            <ul class="details__total-list">
              <li class="details__total-item">
                <span>Всего</span>
                <strong>{{ formatMoney(basePrice) }} ₸</strong>
              </li>
              <li class="details__total-item">
                <span>Скидка</span>
                <strong class="details__discount-text">-{{ Number(tour.discount) || 0 }}%</strong>
              </li>
              <li class="details__total-item details__total-item--result">
                <span>Итого</span>
                <strong>{{ formatMoney(discountedPrice) }} ₸</strong>
              </li>
            </ul>

            <UiButton
              label="Перейти к оплате"
              class="details__totals-btn"
              @click="openPaymentModal"
            />
          </aside>
        </div>
      </div>
    </section>
  </UiOverlay>

  <UiModal
    :is-show="isOpenPayment"
    max-width="600px"
    @close="closePaymentModal"
  >
    <ModalsPayment @payed="statusPayed" />
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

  <UiPartialModal
    :is-show="isOpenPartialModalPayment"
    height="85%"
    @close="closePartialModalPayment"
  >
    <template #body>
      <div class="details__mobile-payment">
        <p class="details__aside-title">Выберите дату</p>
        <Calendar class="details__calendar" v-model="date" inline />

        <div
          v-for="(ticket, index) in ticketTypes"
          :key="`${ticket.title}-${index}-mobile`"
          class="details__ticket"
        >
          <div class="details__ticket-head">
            <div>
              <p class="details__ticket-title">{{ ticket.title }}</p>
              <p v-if="ticket.subtitle" class="details__ticket-subtitle">
                {{ ticket.subtitle }}
              </p>
            </div>
            <p class="details__ticket-price">{{ formatMoney(ticket.price) }} ₸</p>
          </div>

          <UiInput class="details__ticket-input" model-value="0" :disabled="true" />
        </div>

        <div class="details__block details__block--aside">
          <p class="details__aside-title">Промокод</p>
          <UiInput placeholder="Введите промокод" />
          <p class="details__apply">Применить</p>
        </div>

        <ul class="details__total-list">
          <li class="details__total-item">
            <span>Всего</span>
            <strong>{{ formatMoney(basePrice) }} ₸</strong>
          </li>
          <li class="details__total-item">
            <span>Скидка</span>
            <strong class="details__discount-text">-{{ Number(tour.discount) || 0 }}%</strong>
          </li>
          <li class="details__total-item details__total-item--result">
            <span>Итого</span>
            <strong>{{ formatMoney(discountedPrice) }} ₸</strong>
          </li>
        </ul>

        <UiButton
          class="details__partial-payment-btn"
          label="Перейти к оплате"
          @click="openOverlayPayment"
        />
      </div>
    </template>
  </UiPartialModal>

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
          <img class="overlay-payment__img" :src="coverImage" :alt="tour?.title" />
          <h2 class="overlay-payment__title title">
            {{ tour?.title }}
          </h2>
        </div>

        <table class="overlay-payment__table">
          <tbody>
            <tr class="overlay-payment__tr">
              <td class="overlay-payment__td">Дата</td>
              <td class="overlay-payment__td">
                {{ new Date(date).toLocaleDateString("ru-RU") }}
              </td>
            </tr>
            <tr class="overlay-payment__tr overlay-payment__tr--blue">
              <td>Билеты</td>
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
              <td class="overlay-payment__td">-{{ Number(tour?.discount) || 0 }}%</td>
            </tr>
            <tr class="overlay-payment__tr">
              <td class="overlay-payment__td overlay-payment__td--bold">Итого</td>
              <td class="overlay-payment__td">{{ formatMoney(discountedPrice) }} ₸</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </UiOverlay>

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

const isOpenPayment = ref(false);
const isOpenStatusPayment = ref(null);
const isOpenPartialModalPayment = ref(false);
const isOpenOverlayPayment = ref(false);
const isOpenMobileStatusPayment = ref(null);
const date = ref(new Date());

const tabs = [
  { id: 1, name: "О туре" },
  { id: 2, name: "Маршрут" },
  { id: 3, name: "Для туристов" },
  { id: 4, name: "Контакты" },
];

const selectedTab = ref(tabs[0]);

const response = await useFetchSsr({
  url: `/tours/${route.params.id}`,
  method: "get",
});

const tour = ref(response?.data || null);

const galleryImages = computed(() => {
  const list = [tour.value?.avatar, ...(tour.value?.images || [])].filter(Boolean);
  return list.length ? Array.from(new Set(list)) : [tourPlaceholder];
});

const coverImage = computed(() => galleryImages.value[0] || tourPlaceholder);
const partnerTitle = computed(() => tour.value?.partner?.title || "FlyAway Partner");
const partnerImage = computed(
  () => tour.value?.partner?.logo || tour.value?.partner?.avatar || partnerPlaceholder,
);
const ticketTypes = computed(() => {
  if (tour.value?.ticketTypes?.length) {
    return tour.value.ticketTypes;
  }

  return [
    {
      title: "Взрослый 23+",
      subtitle: "",
      price: Number(tour.value?.price) || 0,
    },
  ];
});

const basePrice = computed(() => Number(tour.value?.price) || ticketTypes.value[0]?.price || 0);
const discountedPrice = computed(() => {
  const discount = Number(tour.value?.discount) || 0;
  const total = basePrice.value - (basePrice.value * discount) / 100;
  return total > 0 ? total : basePrice.value;
});

const contactItems = computed(() => {
  const contacts = {
    website: tour.value?.contacts?.website || tour.value?.partner?.contacts?.website,
    phone: tour.value?.contacts?.phone || tour.value?.partner?.contacts?.phone,
    address: tour.value?.contacts?.address || tour.value?.partner?.contacts?.address,
    instagram: tour.value?.contacts?.instagram || "instagram",
  };

  return [
    { icon: "globe", label: "Website", value: contacts.website || "-" },
    { icon: "phone", label: "Телефон", value: contacts.phone || "-" },
    { icon: "location", label: "Адрес", value: contacts.address || "-" },
    { icon: "instagram", label: "Instagram", value: contacts.instagram || "-" },
  ];
});

useSeo({
  title: computed(() => tour.value?.title || "Тур"),
  description: computed(() => tour.value?.description || "Тур FlyAway"),
});

const formatMoney = (value) => {
  return Number(value || 0).toLocaleString("ru-RU");
};

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
    margin: 32px 0 24px;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  &__box {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(320px, 360px);
    gap: 18px;
    align-items: start;
  }

  &__content,
  &__totals {
    background: $white;
    border-radius: 16px;
    box-shadow: 0 18px 42px rgba(32, 36, 38, 0.08);
  }

  &__content {
    display: grid;
    gap: 24px;
    padding: 22px;
  }

  &__totals {
    position: sticky;
    top: 30px;
    display: grid;
    gap: 18px;
    padding: 18px;
  }

  &__header,
  &__partner,
  &__partner-box,
  &__ticket-head,
  &__total-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
  }

  &__title {
    color: $red-500;
  }

  &__icons {
    display: flex;
    align-items: center;
    gap: 12px;

    &-box {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    &-text {
      color: $surface-900;
      font-size: 14px;
      font-weight: 600;
    }
  }

  &__gallery {
    display: grid;
    grid-template-columns: 28px minmax(0, 1fr) 28px;
    gap: 12px;
    align-items: center;
  }

  &__gallery-image {
    width: 100%;
    height: 420px;
    object-fit: cover;
    border-radius: 16px;
  }

  &__tabs {
    width: fit-content;
    margin: 0 auto;
  }

  &__section,
  &__block,
  &__contacts,
  &__mobile-payment {
    display: grid;
    gap: 18px;
  }

  &__description,
  &__fact-text,
  &__schedule-text,
  &__contact-value {
    color: $surface-900;
    font-size: 14px;
    line-height: 1.6;
  }

  &__block-title,
  &__aside-title,
  &__ticket-title,
  &__partner-name {
    color: $surface-900;
    font-size: 16px;
    font-weight: 700;
  }

  &__facts,
  &__includes-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  &__fact,
  &__block--aside {
    padding: 16px;
    background: $surface-150;
    border-radius: 12px;
  }

  &__list,
  &__meta-list,
  &__schedule,
  &__feature-list {
    display: grid;
    gap: 10px;
  }

  &__list-item {
    margin-left: 18px;
    list-style: disc;
    color: $surface-900;
    font-size: 14px;
    line-height: 1.55;
  }

  &__map-image,
  &__route-map {
    width: 100%;
    max-height: 320px;
    object-fit: cover;
    border-radius: 16px;
  }

  &__schedule-item {
    display: grid;
    grid-template-columns: 84px minmax(0, 1fr);
    gap: 12px;
    align-items: start;
  }

  &__schedule-time {
    color: $red-500;
    font-size: 14px;
    font-weight: 700;
  }

  &__places {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
  }

  &__place {
    display: grid;
    gap: 8px;
  }

  &__place-image {
    width: 100%;
    height: 110px;
    object-fit: cover;
    border-radius: 12px;
  }

  &__place-title,
  &__ticket-subtitle,
  &__contact-label {
    color: $surface-500;
    font-size: 12px;
    line-height: 1.45;
  }

  &__map-card {
    display: grid;
    gap: 6px;
    margin-top: 12px;
    padding: 14px;
    background: $surface-150;
    border-radius: 12px;
  }

  &__map-title {
    color: $surface-900;
    font-size: 14px;
    font-weight: 700;
  }

  &__map-text {
    color: $surface-500;
    font-size: 12px;
    line-height: 1.45;
  }

  &__contacts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  &__contact {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 14px;
    background: $surface-150;
    border-radius: 12px;
  }

  &__avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
  }

  &__partner-rating {
    margin-top: 4px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: $surface-500;
    font-size: 12px;
    font-weight: 600;
  }

  &__badge {
    min-height: 28px;
    display: inline-flex;
    align-items: center;
    padding: 0 10px;
    color: $white;
    background: $red-500;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 700;
  }

  &__calendar {
    width: 100%;
    border: none !important;
  }

  &__ticket {
    display: grid;
    gap: 10px;
  }

  &__ticket-price {
    color: $surface-900;
    font-size: 14px;
    font-weight: 700;
  }

  &__ticket-input {
    :deep(.input__wrapper) {
      min-height: 42px;
      border-radius: 999px;
      background: $white;
    }
  }

  &__apply {
    color: $red-500;
    font-size: 13px;
    font-weight: 700;
  }

  &__total-list {
    display: grid;
    gap: 10px;
  }

  &__total-item {
    color: $surface-900;
    font-size: 14px;

    strong {
      font-weight: 700;
    }

    &--result strong {
      color: $red-500;
      font-size: 18px;
    }
  }

  &__discount-text {
    color: $red-500;
  }

  &__feature {
    display: flex;
    align-items: center;
    gap: 8px;
    color: $surface-900;
    font-size: 14px;
    line-height: 1.5;
  }
}

.overlay-payment {
  padding: 24px 0;

  &__wrapper {
    display: grid;
    gap: 20px;
  }

  &__preview {
    display: grid;
    gap: 12px;
  }

  &__img {
    width: 100%;
    height: 220px;
    object-fit: cover;
    border-radius: 16px;
  }

  &__title {
    color: $surface-900;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
  }

  &__tr {
    border-bottom: 1px solid $surface-200;

    &--blue td {
      color: $red-500;
      font-weight: 700;
    }
  }

  &__td {
    padding: 12px 0;
    color: $surface-900;
    font-size: 14px;
    line-height: 1.5;

    &:last-child {
      text-align: right;
    }

    &--bold {
      font-weight: 700;
    }
  }
}

@media (max-width: 1024px) {
  .details {
    &__box {
      grid-template-columns: 1fr;
    }

    &__totals {
      position: static;
    }

    &__places {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}

@media (max-width: 700px) {
  .details {
    &__wrapper {
      margin-top: 18px;
    }

    &__content,
    &__totals {
      padding: 16px;
    }

    &__gallery {
      grid-template-columns: 20px minmax(0, 1fr) 20px;
    }

    &__gallery-image {
      height: 240px;
    }

    &__tabs,
    &__contacts,
    &__facts,
    &__includes-grid,
    &__places {
      width: 100%;
      grid-template-columns: 1fr;
    }

    &__schedule-item {
      grid-template-columns: 1fr;
      gap: 4px;
    }
  }
}
</style>
