<template>
  <UiOverlay
    :is-show="true"
    header-icon="share"
    :have-footer="true"
    @close="goTo('/locations')"
  >
    <section class="details">
      <div class="details__wrapper">
        <UiGoBack
          class="details__go-back"
          label="Локации"
          go-back="/locations"
        />

        <div class="details__content" v-if="detail">
          <h1 class="details__title title">{{ detail.name }}</h1>

          <img class="details__img" :src="detail.image" alt="Preview" />

          <div class="details__box">
            <h2 class="details__author">Аскар Таханов</h2>
            <p class="detials__date">10.11.2024</p>
          </div>

          <h1 class="details__title details__title--mobile title">
            {{ detail.name }}
          </h1>

          <div class="details__block">
            <h2 class="details__bold">Поход: Перезагрузка для тела и души</h2>
            <p class="details__text">
              Походы — это не просто активный отдых, это настоящее путешествие к
              себе и природе. В современном ритме жизни, полном экранов,
              дедлайнов и суеты, поход становится глотком свежего воздуха —
              буквально и в переносном смысле.
            </p>
          </div>

          <div class="details__block">
            <h2 class="details__bold">Почему стоит отправиться в поход?</h2>
            <ul>
              <li>
                <p>Уединение с природой</p>
                <span
                  >Горы, леса и поля позволяют отдалиться от городского шума и
                  окунуться в мир, где царят тишина, пение птиц и шелест
                  листьев. Это идеальное место, чтобы замедлиться и послушать
                  свои мысли.</span
                >
              </li>
            </ul>
          </div>
        </div>

        <div class="details__footer">
          <h3 class="details__bold details__bold--large">
            Туры по этой локации
          </h3>
          <nuxt-link to="/locations"
            ><p class="details__more">Все туры</p></nuxt-link
          >
        </div>

        <UiSwiper
          v-if="locationTours"
          class="details__swiper"
          :pagination="{ clickable: true }"
          :autoplay="true"
          :breakpoints="{
            1100: {
              slidesPerView: 4,
            },
            924: {
              slidesPerView: 3,
            },
            640: {
              slidesPerView: 2,
            },
            320: {
              slidesPerView: 1,
            },
            0: {
              slidesPerView: 1,
            },
          }"
        >
          <swiper-slide
            class="details__swiper"
            v-for="tour in locationTours"
            :key="tour.id"
          >
            <TheCommonTourCard :tour="tour"></TheCommonTourCard>
          </swiper-slide>
        </UiSwiper>

        <template v-if="locationTours?.length">
          <div class="details__tours">
            <TheCommonTourCard
              v-for="tour in locationTours"
              :key="tour.id"
              :tour="tour"
              :view-type="'tablet'"
            ></TheCommonTourCard>
          </div>
          <UiButton
            class="details__btn button-secondary details__btn--mobile"
            label="Все туры"
            after-icon="chevron"
            icon-color="blue-500"
            icon-size="size-20"
          ></UiButton>
        </template>
      </div>
    </section>
  </UiOverlay>
</template>

<script setup>
const detail = ref(null);
const locationTours = ref(null);
const route = useRoute();

const getLocation = () => {
  useApi({
    url: `/locations/${route.params.id}`,
    method: "get",
  })
    .then((res) => {
      detail.value = res.data.detail;
      locationTours.value = res.data.linked_list;
    })
    .catch((error) => {
      console.log(error);
    });
};
getLocation();
</script>

<style lang="scss" scoped>
.details {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: 26px;
    margin: 26px 0;
    color: $surface-900;
  }
  &__content {
    padding: 16px;
    border-radius: 16px;
    background-color: $white;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  &__img {
    max-width: 1192px;
    width: 100%;
    max-height: 700px;
    border-radius: 16px;
  }
  &__box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 4px;
    color: $surface-400;
    font-size: 14px;
  }
  &__block {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 16px;
    li {
      list-style-type: numeric;
      font-weight: 400;
      margin-left: 20px;
    }
    span {
      font-weight: 100;
    }
  }
  &__title {
    &--mobile {
      display: none;
    }
  }
  &__bold {
    font-weight: 700;
    font-size: 16px;
    &--large {
      font-size: 20px;
    }
  }
  &__author {
    font-size: 14px;
  }
  &__more {
    color: $blue-500;
    font-weight: 700;
  }
  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 4px;
  }
  &__cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  &__tours {
    display: none;
  }
  &__btn {
    display: none;
    &--mobile {
      display: none;
    }
  }
}

@media (max-width: 375px) {
  .details {
    &__wrapper {
      margin-bottom: 24px;
      gap: 16px;
    }
    &__content {
      padding: 0;
      background-color: transparent;
      box-shadow: none;
    }
    &__go-back {
      display: none;
    }
    &__author {
      font-weight: 200;
      font-size: 14px;
    }
    &__title {
      display: none;
      &--mobile {
        display: block;
        color: $blue-500;
        font-size: 24px;
      }
    }
    &__swiper {
      display: none;
    }
    &__tours {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 6px;
    }
    &__btn {
      &--mobile {
        display: flex;
        width: 100%;
      }
    }
  }
}
</style>
