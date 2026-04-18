<template>
  <div class="favourites">
    <div class="favourites__wrapper">
      <UiTabs
        class="favourites__tabs"
        :tabs="tabs"
        v-model="selectedTab"
        type="line"
      ></UiTabs>

      <div
        class="favourites__cards"
        :class="{
          'favourites__cards--hotels': selectedTab.id === 2,
        }"
      >
        <template v-if="selectedTab.id === 1">
          <div v-if="!userStore.isLoggedIn" class="favourites__empty">
            <p class="favourites__empty-title">Войдите, чтобы сохранять избранное</p>
            <p class="favourites__empty-text">
              Нажмите на сердце у тура, и он появится здесь.
            </p>
            <UiButton
              label="Войти"
              class="favourites__empty-btn"
              @click="userStore.openAuthModalLogin"
            ></UiButton>
          </div>

          <div v-else-if="!favouriteTours.length" class="favourites__empty">
            <p class="favourites__empty-title">Пока нет избранных туров</p>
            <p class="favourites__empty-text">
              Откройте каталог, нажмите на сердце, и карточка появится здесь.
            </p>
          </div>

          <TheCommonTourCard
            v-else
            v-for="tour in favouriteTours"
            :key="tour._id || tour.id"
            :tour="tour"
            :view-type="screenWidth > 325 ? 'list' : 'tablet'"
          ></TheCommonTourCard>
        </template>

        <div v-if="selectedTab.id === 2" class="favourites__empty">
          <p class="favourites__empty-title">Избранные отели появятся позже</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const userStore = useAuthStore();
const favouritesStore = useFavouritesStore();

const tabs = reactive([
  {
    id: 1,
    name: "Tyры",
  },
  {
    id: 2,
    name: "Отели",
  },
]);
const selectedTab = ref(tabs[0]);

useSeoMeta({
  title: "FlyAway - Избранное",
  ogTitle: "FlyAway - Избранное",
  description: "FlyAway - сайт для бронирования туров и отелей",
  ogDescription: "FlyAway - сайт для бронирования туров и отелей",
});

const favouriteTours = computed(() => favouritesStore.favouriteTours);
const windowWidth = ref(process.client ? window.innerWidth : null);

const updateWidth = () => {
  windowWidth.value = window.innerWidth;
};

const screenWidth = computed(() => {
  return windowWidth.value;
});

onMounted(() => {
  favouritesStore.loadFavourites();
  window.addEventListener("resize", updateWidth);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateWidth);
});
</script>

<style lang="scss" scoped>
.favourites {
  &__wrapper {
    background-color: $white;
    padding: 16px;
    border-radius: 16px;
  }
  &__tabs {
    display: flex;
    justify-content: center;
  }
  &__cards {
    padding: 10px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    margin: 26px 0;
    gap: 16px;
    &--hotels {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }
  &__pagination {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__empty {
    min-height: 220px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    text-align: center;
    padding: 24px;
    color: $surface-900;
    &-title {
      font-size: 20px;
      font-weight: 700;
    }
    &-text {
      max-width: 420px;
      color: $surface-400;
    }
    &-btn {
      margin-top: 6px;
    }
  }
}

@media (max-width: 375px) {
  .favourites {
    &__wrapper {
      background-color: transparent;
      padding: 0;
    }
    &__cards {
      padding: 0;
      grid-template-columns: repeat(2, 1fr);
      gap: 6px;
    }
  }
}
</style>
