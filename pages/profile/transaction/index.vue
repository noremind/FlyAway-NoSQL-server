<template>
  <section class="transaction">
    <div class="transaction__wrapper">
      <div class="transaction__banner">
        <img
          class="transaction__banner-img"
          src="@/assets/image/content/carving.png"
          alt="Banner"
        />
        <div class="transaction__box">
          <h2 class="transaction__title">Мои бонусы</h2>
          <p class="transaction__price">10 400 Б</p>
        </div>
        <div class="transaction__inner">
          <div class="transaction__inner-box">
            <UiIcons icon="copy" size="size-24" color="white"></UiIcons>
            <p class="transaction__inner-text">
              Скопировать реферальную ссылку
            </p>
          </div>
          <p class="transaction__id">ID: 5028736416</p>
          <p
            class="transaction__question transaction__question--mobile"
            @click="openOverlay"
          >
            Как получить бонусы?
          </p>
        </div>
      </div>

      <p class="transaction__question" @click="openBonusModal">
        Как получить бонусы?
      </p>

      <div class="transaction__table">
        <table class="transaction__table">
          <thead>
            <tr>
              <th class="transaction__header">Название</th>
              <th class="transaction__header">Тип</th>
              <th class="transaction__header">Дата</th>
              <th class="transaction__header">Сумма</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in transactions"
              :key="index"
              class="transaction__row"
            >
              <td class="transaction__cell">{{ item.name }}</td>
              <td class="transaction__cell transaction__cell--type">
                <span class="transaction__type-badge">{{ item.type }}</span>
              </td>
              <td class="transaction__cell">{{ item.date }}</td>
              <td class="transaction__cell transaction__cell--amount">
                <span
                  class="transaction__amount"
                  :class="{
                    'transaction__amount--positive': item.amount > 0,
                    'transaction__amount--negative': item.amount < 0,
                    'transaction__amount--refund': item.refund,
                  }"
                >
                  {{ formatAmount(item.amount) }}
                </span>
                <div v-if="item.refund" class="transaction__refund-text">
                  Возврат средств
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="transaction__blocks">
        <section class="transaction__block" v-for="block in 10" :key="block">
          <div class="transaction__block-box">
            <h3 class="transaction__block-title">Однодевный тур на Кольсай</h3>
            <p class="transaction__block-baige">тур</p>
          </div>
          <div class="transaction__block-box">
            <p class="transaction__block-price">- 13 800 ₸</p>
            <p class="transaction__block-date">12.11.2024</p>
          </div>
        </section>
      </div>
    </div>
  </section>

  <UiModal
    max-width="830px"
    :is-show="isOpenBonusModal"
    @close="closeBonusModal"
  >
    <ModalsHowGetBonus></ModalsHowGetBonus>
  </UiModal>

  <UiOverlay
    :is-show="isOpenOverlay"
    :show-header-icons="false"
    title="Как получить бонусы?"
    @close="closeOverlay"
    :have-footer="true"
  >
    <ModalsHowGetBonus></ModalsHowGetBonus>
  </UiOverlay>
</template>

<script setup>
const isOpenBonusModal = ref(false);
const isOpenOverlay = ref(false);

const openOverlay = () => {
  isOpenOverlay.value = true;
};

const closeOverlay = () => {
  isOpenOverlay.value = false;
};

const closeBonusModal = () => {
  isOpenBonusModal.value = false;
};

const openBonusModal = () => {
  isOpenBonusModal.value = true;
};

const transactions = ref([
  {
    name: "Однодневный тур на Кольсай",
    type: "тур",
    date: "12.11.2024",
    amount: -13800,
    refund: false,
  },
  {
    name: "Однодневный тур на Кольсай",
    type: "тур",
    date: "12.11.2024",
    amount: 24800,
    refund: false,
  },
  {
    name: "Однодневный тур на Кольсай",
    type: "тур",
    date: "12.11.2024",
    amount: 13800,
    refund: true,
  },
  {
    name: "Однодневный тур на Кольсай",
    type: "тур",
    date: "12.11.2024",
    amount: 24800,
    refund: false,
  },
  {
    name: "Однодневный тур на Кольсай",
    type: "тур",
    date: "12.11.2024",
    amount: -13800,
    refund: false,
  },
  {
    name: "Однодневный тур на Кольсай",
    type: "тур",
    date: "12.11.2024",
    amount: 24800,
    refund: false,
  },
]);

const formatAmount = (amount) => {
  const absAmount = Math.abs(amount).toLocaleString();
  const prefix = amount > 0 ? "+" : "-";
  return `${prefix} ${absAmount} ₸`;
};
</script>

<style lang="scss" scoped>
.transaction {
  &__wrapper {
    background-color: $white;
    padding: 16px;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  &__banner {
    width: 100%;
    height: 160px;
    background-color: $blue-500;
    border-radius: 16px;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    position: relative;
    z-index: 1;
    &-img {
      position: absolute;
      max-width: 500px;
      width: 100%;
      z-index: 2;
      opacity: 0.2;
      left: 0;
      top: -60px;
    }
  }
  &__title {
    font-size: 400;
    font-size: 24px;
    color: $white;
  }
  &__box {
    position: relative;
    z-index: 3;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  &__price {
    color: $white;
    font-size: 40px;
    font-weight: 700;
  }
  &__inner {
    text-align: right;
    &-box {
      display: flex;
      gap: 6px;
      align-items: center;
    }
    &-text {
      color: $white;
      font-size: 12px;
      margin-bottom: 8px;
    }
  }
  &__id {
    font-size: 14px;
    color: $white;
    font-weight: 600;
  }
  &__question {
    font-weight: 400;
    color: $blue-500;
  }
  &__table {
    width: 100%;
    border-collapse: collapse;
    font-family: Arial, sans-serif;

    thead {
      background-color: $blue-200;
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;

      .transaction__header {
        text-align: left;
        padding: 12px;
        color: $blue-500;
        font-weight: 600;
        border-bottom: 2px solid $blue-500;
      }
    }

    tbody {
      .transaction__row {
        border-bottom: 1px solid #eef4f8;

        &:nth-child(even) {
          background-color: $blue-200;
        }

        .transaction__cell {
          padding: 16px 12px;
          font-size: 14px;
          height: 44px;
          font-weight: 100;
          color: $surface-900;

          &--type {
            .transaction__type-badge {
              background-color: $blue-300;
              color: $blue-500;
              padding: 6px 10px;
              font-weight: 100;
              border-radius: 16px;
            }
          }

          &--amount {
            font-weight: 700;

            .transaction__amount {
              font-weight: 700;
              font-size: 16px;
              &--positive {
                color: $green-400;
              }

              &--negative {
                color: $orange-200;
              }

              &--refund {
                color: $surface-900;
              }
            }

            .transaction__refund-text {
              font-size: 12px;
              color: $surface-900;
              margin-top: 4px;
              font-weight: 100;
            }
          }
        }
      }
    }
  }
  &__blocks {
    display: flex;
    flex-direction: column;
    color: $surface-900;
    background-color: $white;
    border-radius: 16px;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
  }
  &__block {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid $surface-400;
    padding: 4px 8px;

    &:last-child {
      border-bottom-right-radius: 16px;
      border-bottom-left-radius: 16px;
      border: none;
    }
    &:first-child {
      border-top-right-radius: 16px;
      border-top-left-radius: 16px;
    }
    &:nth-child(odd) {
      background-color: $blue-200;
    }
    &-box:last-child {
      text-align: right;
    }
    &-title {
      font-size: 12px;
      font-weight: 400;
    }
    &-baige {
      font-size: 12px;
      padding: 2px 6px;
      border-radius: 36px;
      background-color: $blue-300;
      color: $blue-500;
      display: inline-block;
    }
    &-price {
      font-size: 14px;
      font-weight: 700;
      color: $green-400;
    }
    &-date {
      font-size: 10px;
    }
  }
}

@media (max-width: 375px) {
  .transaction {
    &__wrapper {
      padding: 0;
      background-color: transparent;
    }
    &__inner-box,
    &__question,
    &__table {
      display: none;
    }
    &__banner {
      padding: 12px;
    }
    &__question {
      &--mobile {
        position: absolute;
        z-index: 2;
        display: block;
        color: $white;
        font-size: 12px;
        bottom: 20px;
        white-space: nowrap;
        right: 16px;
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }
}
</style>
