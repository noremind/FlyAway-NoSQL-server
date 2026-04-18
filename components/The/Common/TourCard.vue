<template>
  <section class="tour">
    <div class="tour__wrapper">
      <img class="tour__img" :src="coverImage" :alt="titleText" />
      <div class="tour__header">
        <div class="tour__header-box">
          <span v-if="tourData.is_hot" class="tour__icon">
            <UiIcons icon="hot" color="orange-200" size="size-14"></UiIcons>
          </span>
          <button
            class="tour__favorite"
            type="button"
            @click.stop="toggleFavourite"
          >
            <UiIcons
              :icon="isFavourite ? 'heart-fill' : 'heart'"
              :color="isFavourite ? 'red-500' : 'white'"
              size="size-24"
            ></UiIcons>
          </button>
        </div>
        <div>
          <div class="tour__price-box">
            <p class="tour__new-price">{{ discountedPriceLabel }} ₸</p>
            <p v-if="hasDiscount" class="tour__old-price">
              <s>{{ basePriceLabel }} ₸</s>
            </p>
          </div>
        </div>
      </div>

      <div class="tour__info">
        <div class="tour__info-box" v-if="viewType === 'tablet'">
          <img class="tour__avatar" :src="partnerAvatar" :alt="partnerName" />
          <p class="tour__author">{{ partnerName }}</p>
        </div>

        <div class="tour__reviews">
          <p class="tour__reviews-count">{{ reviewsCountLabel }}</p>
          <UiIcons icon="star" color="yellow-500" size="size-14"></UiIcons>
          <p class="tour__reviews-average">{{ ratingLabel }}</p>
        </div>
      </div>
      <span
        v-if="viewType === 'tablet' && badgeLabel"
        class="tour__discount tour__discount--new tour__discount--mobile"
        >{{ badgeLabel }}</span
      >
      <div class="tour__content">
        <h3 class="tour__title">
          <nuxt-link class="tour__link" :to="detailsLink">{{
            titleText
          }}</nuxt-link>
        </h3>
        <p class="tour__description">
          {{ descriptionText }}
        </p>
        <div class="tour__box">
          <p class="tour__text">Осталось</p>
          <span class="tour__count">{{ seatsLabel }}</span>
        </div>
        <div class="tour__inner">
          <div class="tour__inner-box">
            <p class="tour__date">{{ primaryDateLabel }}</p>
            <span
              v-if="extraDatesCount > 0"
              @click="toggleDropdown"
              class="tour__date-plus"
            >
              +{{ extraDatesCount }} дат
            </span>
            <div v-if="isOpenDropdown" class="tour__date-dropdown">
              <ul class="tour__date-list">
                <li
                  v-for="dateLabel in extraDateLabels"
                  :key="dateLabel"
                  class="tour__date-item"
                >
                  {{ dateLabel }}
                </li>
              </ul>
            </div>
          </div>
          <span
            v-if="badgeLabel"
            :class="{ 'tour__discount--show': viewType === 'list' }"
            class="tour__discount tour__discount--new"
            >{{ badgeLabel }}</span
          >
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import fallbackImage from "@/assets/image/content/tour-card.png";
import fallbackAvatar from "@/assets/image/common/tour-avatar.png";

const isOpenDropdown = ref(false);
const userStore = useAuthStore();
const favouritesStore = useFavouritesStore();
const props = defineProps({
  tour: {
    type: Object,
    default: () => ({}),
  },
  viewType: {
    type: String,
    default: "list",
  },
});

const normalizeString = (value) => String(value || "").trim();

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

const formatMoney = (value) => Number(value || 0).toLocaleString("ru-RU");

const formatCardDate = (value) => {
  const parsed = parseDateValue(value);

  if (!parsed) {
    return normalizeString(value);
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
  }).format(parsed);
};

const pluralizeSeats = (value) => {
  const count = Math.abs(Number(value) || 0);
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return "место";
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return "места";
  }

  return "мест";
};

const tourData = computed(() => props.tour || {});

const titleText = computed(
  () => tourData.value?.title || tourData.value?.name || "Тур FlyAway",
);

const descriptionText = computed(() => {
  return (
    normalizeString(tourData.value?.description) ||
    normalizeString(tourData.value?.preview_text) ||
    "Описание скоро появится."
  );
});

const coverImage = computed(() => {
  return (
    tourData.value?.avatar ||
    tourData.value?.image ||
    tourData.value?.images?.[0] ||
    fallbackImage
  );
});

const partnerName = computed(() => {
  return (
    tourData.value?.partner?.title ||
    tourData.value?.author?.name ||
    "FlyAway Partner"
  );
});

const partnerAvatar = computed(() => {
  return (
    tourData.value?.partner?.logo ||
    tourData.value?.partner?.avatar ||
    fallbackAvatar
  );
});

const basePrice = computed(() => {
  return (
    Number(tourData.value?.price) ||
    Number(tourData.value?.ticketTypes?.[0]?.price) ||
    0
  );
});

const discount = computed(() =>
  Math.max(0, Number(tourData.value?.discount) || 0),
);

const discountedPrice = computed(() => {
  if (!discount.value) {
    return basePrice.value;
  }

  return Math.max(
    0,
    Math.round(basePrice.value - (basePrice.value * discount.value) / 100),
  );
});

const hasDiscount = computed(() => discount.value > 0 && basePrice.value > 0);
const basePriceLabel = computed(() => formatMoney(basePrice.value));
const discountedPriceLabel = computed(() => formatMoney(discountedPrice.value));

const ratingLabel = computed(() => {
  const rating = Number(tourData.value?.rating) || 0;
  return rating.toFixed(1).replace(".", ",");
});

const reviewsCountLabel = computed(() => {
  return `${Number(tourData.value?.reviewsCount || tourData.value?.review_count || 0)} отзывов`;
});

const normalizedDateLabels = computed(() => {
  const dates = [
    ...(Array.isArray(tourData.value?.availabilityDates)
      ? tourData.value.availabilityDates.map((item) => item?.date)
      : []),
    ...(Array.isArray(tourData.value?.dateDetails)
      ? tourData.value.dateDetails.map((item) => item?.date)
      : []),
    ...(Array.isArray(tourData.value?.dates) ? tourData.value.dates : []),
  ]
    .map((item) => formatCardDate(item))
    .filter(Boolean);

  return [...new Set(dates)];
});

const primaryDateLabel = computed(
  () => normalizedDateLabels.value[0] || "Даты уточняются",
);
const extraDateLabels = computed(() => normalizedDateLabels.value.slice(1));
const extraDatesCount = computed(() => extraDateLabels.value.length);

const seatsLabel = computed(() => {
  const slot = Array.isArray(tourData.value?.availabilityDates)
    ? tourData.value.availabilityDates.find((item) => {
        return Number.isFinite(Number(item?.seats));
      })
    : null;

  if (!slot) {
    return "уточняются";
  }

  const seats = Math.max(0, Number(slot.seats) || 0);
  const bookedSeats = Math.max(0, Number(slot.bookedSeats) || 0);
  const availableSeats = Math.max(0, seats - bookedSeats);

  return `${availableSeats} ${pluralizeSeats(availableSeats)}`;
});

const detailsLink = computed(() => {
  const id = tourData.value?._id || tourData.value?.id;
  return id ? `/tours/${id}` : "/tours";
});

const isFavourite = computed(() => {
  return favouritesStore.isFavourite(tourData.value?._id || tourData.value?.id);
});

const badgeLabel = computed(() => {
  const createdAt = parseDateValue(tourData.value?.createdAt);

  if (!createdAt) {
    return "";
  }

  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24),
  );

  return diffInDays <= 30 ? "Новинка" : "";
});

const toggleDropdown = () => {
  if (!extraDatesCount.value) {
    return;
  }

  isOpenDropdown.value = !isOpenDropdown.value;
};

const toggleFavourite = () => {
  if (!userStore.isLoggedIn) {
    userStore.openAuthModalLogin();
    return;
  }

  favouritesStore.toggleFavourite(tourData.value);
};
</script>

<style scoped lang="scss">
.tour {
  &__wrapper {
    position: relative;
    padding: 0 16px 16px 16px;
    border-radius: 16px;
    max-width: 292px;
    width: 100%;
    background-color: $white;
    box-shadow: 0px 0px 20px 0px #0000001a;
  }
  &__header {
    position: relative;
    width: 100%;
    height: 195px;
    padding: 16px 0 16px 0;
    display: inline-flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
    &-box {
      display: flex;
      width: 100%;
      justify-content: space-between;
      gap: 6px;
      align-items: center;
    }
  }
  &__img {
    position: absolute;
    // top: 0;
    left: 0;
    object-fit: cover;
    cursor: pointer;
    width: 100%;
    border-radius: 12px;
  }
  &__icon {
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 28px;
    height: 28px;
  }
  &__favorite {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    // background-color: rgba(255, 255, 255, 0.8);
    border: none;
    cursor: pointer;
    padding: 0;
  }
  &__price-box {
    display: inline-flex;
    gap: 6px;
    background-color: $red-500;
    padding: 8px 12px;
    border-radius: 26px;
    font-weight: 400;
  }
  &__new-price {
    color: $white;
  }
  &__old-price {
    color: $surface-900;
    font-size: 14px;
    margin-top: 5px;
  }
  &__link {
    color: inherit;
  }
  &__info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    &-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }
  }
  &__author {
    font-size: 14px;
    font-weight: 400;
  }
  &__reviews {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 4px;
    &-count {
      font-size: 10px;
      color: $surface-400;
    }
    &-average {
      font-size: 10px;
    }
  }
  &__avatar {
    border-radius: 50%;
    width: 32px;
    height: 32px;
    object-fit: cover;
  }
  &__content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative;
  }
  &__title {
    font-size: 24px;
    font-weight: 700;
    color: $surface-900;
    cursor: pointer;
  }
  &__description {
    font-size: 14px;
    color: $surface-900;
  }
  &__inner {
    display: flex;
    gap: 4px;
    align-items: center;
    justify-content: space-between;
    &-box {
      display: flex;
      gap: 6px;
      align-items: center;
    }
  }
  &__box {
    display: flex;
    gap: 4px;
    align-items: center;
  }
  &__text {
    font-size: 12px;
    color: $surface-400;
  }
  &__count {
    font-size: 14px;
    color: $red-500;
    font-weight: 700;
  }
  &__date-plus {
    padding: 4px 8px;
    background-color: $surface-150;
    white-space: nowrap;
    font-size: 14px;
    border-radius: 16px;
    font-weight: 100;
    color: $surface-900;
    cursor: pointer;
  }
  &__date {
    font-size: 14px;
    font-weight: 400;
    color: $surface-900;
    position: relative;
    &-dropdown {
      position: absolute;
      bottom: 25px;
      left: 62px;
      background-color: $white;
      padding: 4px 8px;
      border-radius: 12px;
      box-shadow: 0px 0px 20px 8px rgba(0, 0, 0, 0.1);
    }
    &__list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      color: $surface-900;
    }
  }
  &__discount {
    padding: 8px 16px;
    border-radius: 26px;
    color: $white;
    font-size: 14px;
    background-color: $orange-200;
    font-weight: 400;
    &--new {
      background-color: $green-400;
      padding: 4px 8px;
    }
    &--mobile {
      display: none;
    }
  }
}

@media (max-width: 768px) {
  .tour {
    &__wrapper {
      max-width: 327px;
    }
    &__info {
      margin-top: 12px;
    }
  }
}

@media (max-width: 375px) {
  .tour {
    &__wrapper {
      padding: 0 6px 6px 6px;
      max-width: 180px;
      height: 100%;
    }
    &__header {
      padding-top: 6px;
      padding-bottom: 6px;
    }
    &__title {
      font-size: 16px;
    }
    &__date-item,
    &__date {
      white-space: nowrap;
    }
    &__img {
      // width: 160px;
      height: 140px;
      max-width: 100%;
      border-radius: 16px;
    }
    &__old-price,
    &__new-price {
      white-space: nowrap;
    }
    &__info {
      margin-top: 12px;
    }
    &__discount {
      display: none;
      &--mobile {
        display: inline-block;
        margin-bottom: 6px;
      }
      &--show {
        display: inline-block;
      }
    }
    &__box {
      display: none;
    }
  }
}
</style>
