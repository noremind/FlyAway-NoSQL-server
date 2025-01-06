<template>
  <section class="ticket">
    <div class="ticket__wrapper">
      <div class="ticket__header">
        <h2 class="ticket__title title">Билет №12345</h2>
        <button type="button" class="ticket__refund" @click="openRefundModal">
          Оформить возврат
        </button>
      </div>

      <div class="ticket__box">
        <div class="ticket__box-inner">
          <img
            class="ticket__qr"
            src="@/assets/image/content/qr-code.png"
            alt="Qr Code"
          />
          <button type="button" class="ticket__btn button-primary">
            Активный билет
          </button>
        </div>
        <div class="ticket__content">
          <div class="ticket__content-box">
            <div class="ticket__content-inner">
              <img
                class="ticket__avatar"
                src="@/assets/image/common/tour-avatar.png"
                alt="Avatar"
              />
              <p class="ticket__name">Mili Tour</p>
            </div>
            <div class="ticket__reviews">
              <p class="ticket__count">20 отзывов</p>
              <UiIcons
                class="ticket__star"
                size="size-14"
                color="yellow-500"
                icon="star"
              ></UiIcons>
              <p class="ticket__average">4,1</p>
            </div>
          </div>

          <section class="ticket__content-info">
            <h3 class="ticket__content-title">Звездный Комфорт</h3>
            <p class="ticket__content-about">Об отеле</p>
            <p class="ticket__content-description">
              Приглашаем вас отправиться в увлекательное путешествие на
              Кольсайские озера — настоящую жемчужину Алматинской области, где
              природа поражает своей первозданной красотой и чистотой.
            </p>
            <div>
              <p class="ticket__content-text">Что вас ждет:</p>
              <ul class="ticket__content-list">
                <li class="ticket__content-list-item">
                  Три живописных озера на разных высотах, окруженные густыми
                  хвойными лесами и величественными горами. Насладитесь
                  кристально чистой водой и свежим воздухом, вдали от городской
                  суеты.
                </li>
              </ul>
            </div>

            <div class="ticket__premium">
              <UiIcons
                color="blue-500"
                size="size-20"
                icon="circle-check"
              ></UiIcons>
              <p class="ticket__premium-text">Вы выбрали премиум номер</p>
            </div>

            <table class="ticket__table">
              <tbody>
                <tr class="ticket__tr">
                  <td class="ticket__td">Дата</td>
                  <td class="ticket__td">25 декабря 2024</td>
                </tr>
                <tr class="ticket__tr ticket__tr--blue">
                  <td>Ваши билеты</td>
                </tr>
                <tr class="ticket__tr">
                  <td class="ticket__td">Дата от</td>
                  <td class="ticket__td">24 декабря 2024</td>
                </tr>
                <tr class="ticket__tr">
                  <td class="ticket__td">Дата до</td>
                  <td class="ticket__td">26 декабря 2024</td>
                </tr>
                <tr class="ticket__tr ticket__tr--padding">
                  <td class="ticket__td ticket__td--bold">Премиум</td>
                  <td class="ticket__td">3 дня х 20 000 ₸</td>
                </tr>
                <tr class="ticket__tr ticket__tr--padding">
                  <td class="ticket__td ticket__td--bold">Скидка</td>
                  <td class="ticket__td">-20%</td>
                </tr>
                <tr class="ticket__tr ticket__tr--padding">
                  <td class="ticket__td ticket__td--bold">Итого</td>
                  <td class="ticket__td">24 800 ₸</td>
                </tr>
                <tr class="ticket__tr ticket__tr--blue">
                  <td>Способ оплаты</td>
                </tr>
                <tr class="ticket__tr">
                  <td class="ticket__td ticket__td--box">
                    <UiIcons
                      icon="credit-card"
                      color="blue-500"
                      size="size-24"
                    ></UiIcons>
                    <span>Банковская карта</span>
                  </td>
                  <td class="ticket__td"></td>
                </tr>
                <tr class="ticket__tr">
                  <td class="ticket__td ticket__td--box">
                    <span>4400 ... 8909</span>
                  </td>
                  <td class="ticket__td"></td>
                </tr>
              </tbody>
            </table>
            <UiButton
              before-icon="upload"
              icon-color="blue-500"
              label="Скачать билет"
              class="ticket__download"
            ></UiButton>
          </section>
        </div>
      </div>
    </div>
  </section>
  <UiModal
    max-width="600px"
    :is-show="isOpenRefundModal"
    @close="closeRefundModal"
  >
    <ModalsRefund
      @next-step="cancelledStatusRefundModal"
      @close-modal="closeRefundModal"
    ></ModalsRefund>
  </UiModal>

  <UiModal
    max-width="600px"
    :is-show="statusRefundModal === 'success'"
    @close="closeStatusRefundModal"
  >
    <ModalsStatus
      title="Возврат оформлен"
      btn-label="Перейти в Туры"
      goTo="/tours"
    ></ModalsStatus>
  </UiModal>

  <UiModal
    max-width="600px"
    :is-show="statusRefundModal === 'cancelled'"
    @close="closeStatusRefundModal"
  >
    <ModalsInfo
      title="Возврат невозможен"
      description="Возврат не возможен так как, вы до события осталось 72 часа, для дальнейнего выяснение обстоястельсво свяжитесь с службой поддержкой"
      btn-label="Контакты"
    ></ModalsInfo>
  </UiModal>
</template>

<script setup>
const statusRefundModal = ref("");
const isOpenRefundModal = ref(false);

const openRefundModal = () => {
  isOpenRefundModal.value = true;
};
const closeRefundModal = () => {
  isOpenRefundModal.value = false;
};

const cancelledStatusRefundModal = () => {
  statusRefundModal.value = "cancelled";
};

const successStatusRefundModal = () => {
  statusRefundModal.value = "success";
};

const closeStatusRefundModal = () => {
  statusRefundModal.value = "";
};
</script>

<style lang="scss" scoped>
.ticket {
  &__wrapper {
    padding: 20px;
    background-color: $white;
    border-radius: 16px;
  }
  &__header {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }
  &__refund {
    color: $orange-200;
    font-size: 14px;
  }
  &__premium {
    display: flex;
    gap: 8px;
    align-items: center;
    &-text {
      color: $blue-500;
      font-weight: 400;
    }
  }
  &__box {
    display: flex;
    justify-content: space-between;
    margin: 26px 0;
    gap: 26px;
    &-inner {
      display: flex;
      flex-direction: column;
      gap: 30px;
      max-width: 245px;
      width: 100%;
    }
  }
  &__qr {
    max-width: 100%;
    object-fit: cover;
  }
  &__btn {
    font-weight: 600;
    font-size: 14px;
  }
  &__avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }
  &__content {
    width: 100%;
    &-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    &-inner {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    &-info {
      display: flex;
      flex-direction: column;
      gap: 24px;
      margin: 16px 0;
      color: $surface-900;
    }
    &-about {
      font-weight: 400;
    }
    &-list {
      display: flex;
      flex-direction: column;
      &-item {
        list-style: disc;
        margin-left: 30px;
      }
    }
  }
  &__reviews {
    display: flex;
    gap: 6px;
    align-items: center;
  }
  &__name {
    color: $surface-900;
    font-size: 14px;
    font-weight: 400;
  }
  &__count {
    font-size: 12.5px;
    color: $surface-300;
    font-weight: 400;
  }
  &__average {
    font-size: 12.5px;
    color: $surface-900;
    font-weight: 400;
  }
  &__table {
    color: $surface-900;
  }
  &__tr &__td:last-child {
    text-align: right;
    font-weight: 400;
  }
  &__td {
    font-weight: 100;
    padding-top: 4px;
    &--bold {
      font-weight: 400;
    }
    &--box {
      display: flex;
      gap: 4px;
      align-items: center;
    }
  }
  &__tr {
    &--padding td {
      padding-top: 24px;
    }
    &--blue {
      color: $blue-500;
      font-weight: 400;
      & td {
        padding-top: 16px;
      }
    }
  }
  &__download {
    border: 1px solid $blue-500;
    max-width: 240px;
    background-color: transparent;
    width: 100%;
    display: flex;
    justify-content: center;
    color: $blue-500;
    padding: 10px;
  }
}
</style>
