<template>
  <section class="about">
    <div class="about__wrapper">
      <h1 class="about__title title">О TravelTime</h1>

      <div class="about__content">
        <div class="about__imgs">
          <img
            class="about__img"
            src="@/assets/image/content/about-img1.png"
            alt="TravelTime"
          />
          <img
            class="about__img"
            src="@/assets/image/content/about-img2.png"
            alt="TravelTime"
          />
        </div>

        <div class="about__texts">
          <p class="about__text">
            TravelTime — это больше, чем просто туристический маркетплейс. Это
            портал, который открывает дверь в сердце Казахстана — страны с
            богатой историей, уникальной культурой и потрясающей природой. Мы
            вдохновляем исследовать, удивляться и влюбляться в её необъятные
            просторы.
          </p>
          <p class="about__text">
            Наша миссия — показать миру, что Казахстан может стать местом, где
            мечты о путешествиях превращаются в реальность. От древних шёлковых
            дорог до современных мегаполисов, от бескрайних степей до
            величественных гор — здесь каждый найдёт свою историю.
          </p>

          <img
            class="about__img about__img--mobile"
            src="@/assets/image/content/about-img2.png"
            alt="TravelTime"
          />

          <div class="about__box about__box--hide">
            <p class="about__text">Что мы предлагаем?</p>
            <ul class="about__list">
              <li class="about__list-item">
                Удобную платформу для поиска и бронирования туров, проживания и
                экскурсий.
              </li>
              <li class="about__list-item">
                Уникальные маршруты, созданные профессиональными гидами и
                местными экспертами.
              </li>
              <li class="about__list-item">
                Возможность открыть для себя культуру, традиции и кухню
                Казахстана в новом свете.
              </li>
            </ul>
          </div>
          <p class="about__text about__text--hide">
            TravelTime — это не просто путешествие. Это опыт, который останется с
            вами навсегда. Добро пожаловать в мир, где каждая поездка становится
            приключением, а каждый день — открытием.
          </p>

          <p class="about__text about__text--hide">
            TravelTime — это не просто путешествие. Это опыт, который останется с
            вами навсегда. Добро пожаловать в мир, где каждая поездка становится
            приключением, а каждый день — открытием.
          </p>
        </div>

        <div class="about__flex">
          <div class="about__digitals">
            <div class="about__inner">
              <p class="about__number">24</p>
              <p class="about__info">партнеров</p>
            </div>

            <div class="about__inner">
              <p class="about__number">126</p>
              <p class="about__info">активных туров</p>
            </div>

            <div class="about__inner">
              <p class="about__number">24</p>
              <p class="about__info">отелей</p>
            </div>

            <div class="about__inner">
              <p class="about__number">2165</p>
              <p class="about__info">новых клиентов</p>
            </div>
          </div>
          <div class="about__texts about__texts--mobile">
            <div class="about__box">
              <p class="about__text">Что мы предлагаем?</p>
              <ul class="about__list">
                <li class="about__list-item">
                  Удобную платформу для поиска и бронирования туров, проживания
                  и экскурсий.
                </li>
                <li class="about__list-item">
                  Уникальные маршруты, созданные профессиональными гидами и
                  местными экспертами.
                </li>
                <li class="about__list-item">
                  Возможность открыть для себя культуру, традиции и кухню
                  Казахстана в новом свете.
                </li>
              </ul>
            </div>
            <p class="about__text">
              TravelTime — это не просто путешествие. Это опыт, который останется
              с вами навсегда. Добро пожаловать в мир, где каждая поездка
              становится приключением, а каждый день — открытием.
            </p>
            <p class="about__text">
              TravelTime — это не просто путешествие. Это опыт, который останется
              с вами навсегда. Добро пожаловать в мир, где каждая поездка
              становится приключением, а каждый день — открытием.
            </p>
          </div>
        </div>
      </div>

      <section class="about__opportunity">
        <img
          class="about__opportunity-img"
          src="@/assets/image/content/about-opportunity.png"
          alt="Opportunity"
        />
        <h2 class="about__opportunity-title">Хотите стать нашим партнером?</h2>
        <p class="about__opportunity-description">
          Мы предлагаем удобный и надежный инструмент для продвижения ваших
          услуг в сфере туризма и гостиничного бизнеса.
          <span
            class="about__opportunity-description about__opportunity-description--hide"
          >
            Станьте частью команды, которая помогает путешественникам находить
            лучшие туры, отели и подарочные сертификаты.</span
          >
        </p>

        <UiButton
          class="about__opportunity-btn about__opportunity-btn--laptop"
          label="Стать партнером"
        ></UiButton>
      </section>
      <UiButton
        class="about__opportunity-btn about__opportunity-btn--mobile"
        label="Стать партнером"
      ></UiButton>
    </div>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
.about {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: 32px;
    margin: 36px 0;
    color: $surface-900;
  }
  &__content {
    display: flex;
    justify-content: space-between;
    gap: 24px;
  }
  &__imgs {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }
  &__title {
    margin-bottom: 26px;
  }
  &__img {
    max-width: 525px;
    width: 100%;
    border-radius: 16px;
    &--mobile {
      display: none;
    }
  }
  &__texts {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 405px;
    flex-grow: 1;
    font-size: 14px;
    &--mobile {
      display: none;
    }
  }
  &__flex {
    display: block;
  }
  &__text {
    font-weight: 400;
  }
  &__list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    &-item {
      margin-left: 24px;
      list-style: disc;
      font-weight: 400;
    }
  }
  &__digitals {
    display: flex;
    flex-direction: column;
    gap: 24px;
    justify-content: space-between;
    border-left: 1px solid #000;
    padding: 0 0 0 46px;
  }
  &__number {
    color: $blue-500;
    font-size: 64px;
    font-weight: 300;
  }
  &__opportunity {
    position: relative;
    height: clamp(16rem, 8.182rem + 39.09vw, 37.5rem);
    display: flex;
    flex-direction: column;
    border-radius: 24px;
    background-color: $surface-900;
    &-img {
      position: absolute;
      top: 0;
      border-radius: 24px;
      height: clamp(16rem, 8.182rem + 39.09vw, 37.5rem);
      &--mobile {
        display: none;
      }
    }
    &-title {
      font-size: clamp(1.25rem, 0.795rem + 2.27vw, 2.5rem);
      font-weight: 700;
      color: $white;
      position: relative;
      z-index: 2;
      margin: 36px 0 0 36px;
    }
    &-description {
      position: relative;
      z-index: 2;
      font-size: clamp(0.875rem, 0.648rem + 1.14vw, 1.5rem);
      font-weight: 100;
      padding: 36px;
      color: $white;
    }
    &-btn {
      background-color: $blue-500;
      color: $white;
      padding: 16px;
      opacity: 1;
      font-weight: 700;
      font-size: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      z-index: 2;
      max-width: 315px;
      width: 100%;
      margin: auto 0 32px 32px;
      height: 60px;
      &--mobile {
        display: none;
      }
    }
  }
}

@media (max-width: 375px) {
  .about {
    &__content {
      display: flex;
      flex-direction: column;
    }
    &__img {
      &:last-child {
        display: none;
      }
      &--mobile {
        display: block;
      }
    }
    &__texts {
      &--mobile {
        display: block;
      }
    }
    &__box,
    &__text {
      &--hide {
        display: none;
      }
    }
    &__flex {
      display: flex;
      gap: 12px;
    }
    &__digitals {
      border-left: none;
      border-right: 1px solid #000;
      padding: 0 0 0 0px;
    }
    &__opportunity {
      &-title {
        margin: 16px 0 0 16px;
      }
      &-description {
        margin: auto 0 0 0;
        padding: 16px;
        &--hide {
          display: none;
        }
      }
      &-btn {
        &--laptop {
          display: none;
        }
        &--mobile {
          display: flex;
          margin: 0 auto;
        }
      }
    }
  }
}
</style>
