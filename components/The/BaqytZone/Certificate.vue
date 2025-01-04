<template>
  <section class="certificate">
    <div class="certificate__wrapper">
      <div class="certificate__box">
        <h3 class="certificate__title">Однодневный тур в озеро Кольсай</h3>
        <ul class="certificate__list">
          <li
            class="certificate__list-item"
            :class="{
              'certificate__list-item--mobile': index + 1 > 2 && !showMore,
            }"
            v-for="(list, index) in lists"
            :key="list.id"
          >
            {{ list.name }}
          </li>
        </ul>
        <p
          class="certificate__more"
          @click="toggleShowList"
          v-if="lists.length > 2"
        >
          {{ !showMore ? "подробнее..." : "скрыть" }}
        </p>
      </div>
      <div class="certificate__inner">
        <UiButton label="15 000 ₸" class="certificate__price"></UiButton>
        <div class="certificate__count">
          <UiIcons
            class="certificate__arrow down"
            size="size-20"
            icon="chevron"
          ></UiIcons>
          <UiInput class="certificate__input" :is-center="true"></UiInput>
          <UiIcons
            class="certificate__arrow"
            size="size-20"
            icon="chevron"
          ></UiIcons>
        </div>
        <!-- <UiButton
          label="Добавить"
          before-icon="plus"
          icon-color="blue-500"
          icon-size="size-24"
          class="certificate__btn-add"
        ></UiButton> -->
      </div>
    </div>
  </section>
</template>

<script setup>
const showMore = ref(false);
const lists = reactive([
  {
    id: 1,
    name: "1Горы, леса и поля позволяют отдалиться от городского шума и окунуться в мир, где царят тишина, пение птиц и шелест листьев.",
  },
  {
    id: 2,
    name: "2Горы, леса и поля позволяют отдалиться от городского шума и окунуться в мир, где царят тишина, пение птиц и шелест листьев.",
  },
  {
    id: 3,
    name: "3Горы, леса и поля позволяют отдалиться от городского шума и окунуться в мир, где царят тишина, пение птиц и шелест листьев.",
  },
  {
    id: 4,
    name: "4Горы, леса и поля позволяют отдалиться от городского шума и окунуться в мир, где царят тишина, пение птиц и шелест листьев.",
  },
]);

const toggleShowList = () => {
  showMore.value = !showMore.value;
};
</script>

<style lang="scss" scoped>
.certificate {
  &__wrapper {
    padding: 16px;
    border-radius: 16px;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    gap: 16px;
    color: $surface-900;
  }
  &__title {
    font-weight: 600;
  }
  &__more {
    color: $blue-500;
    font-weight: 400;
    font-size: 12px;
  }
  &__box {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  &__inner {
    max-width: 240px;
    flex-grow: 1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  &__list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    &-item {
      list-style: disc;
      margin-left: 20px;
      font-size: 12px;
      &--mobile {
        display: none;
      }
    }
  }
  &__count {
    display: flex;
    justify-content: space-between;
    gap: 4px;
    align-items: center;
  }
  &__arrow {
    cursor: pointer;
  }
  &__price {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    font-weight: 700;
    background-color: $blue-500;
    color: $white;
  }
  &__btn-add {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid $blue-500;
    background-color: transparent;
    color: $blue-500;
    font-weight: 600;
  }
}

@media (max-width: 375px) {
  .certificate {
    &__wrapper {
      display: flex;
      flex-direction: column;
      padding: 12px;
    }
    &__inner {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      max-width: 100%;
      gap: 26px;
    }
    &__price {
      background-color: transparent;
      color: $blue-500;
      white-space: nowrap;
      padding: 0;
      justify-content: flex-start;
      flex-grow: 1;
    }
    &__btn-add {
      flex-grow: 1;
      max-width: 160px;
    }
    &__input {
      padding: 0;
      flex-grow: 0;
      max-width: 130px;
    }
  }
}
</style>
