<template>
  <div class="profile-main">
    <div class="profile-main__wrapper">
      <div class="profile-main__side">
        <div class="profile-main__box">
          <img
            class="profile-main__avatar"
            src="@/assets/image/common/avatar-user.jpeg"
            alt="Avatar"
          />
          <div class="profile-main__inner">
            <div class="profile-main__inner-box">
              <UiIcons color="blue-500" icon="upload"></UiIcons>
              <p class="profile-main__box-text profile-main__box-text--upload">
                Загрузить другое фото
              </p>
            </div>
            <div class="profile-main__inner-box">
              <UiIcons color="orange-200" icon="trash" size="size-14"></UiIcons>
              <p class="profile-main__box-text profile-main__box-text--delete">
                Удалить аватарку
              </p>
            </div>
          </div>
        </div>

        <UiInput label="Ваше имя" placeholder="Дана"></UiInput>
        <UiInput
          label="Номер телефона"
          placeholder="+7 (777) 777 77 77"
        ></UiInput>

        <UiButton
          class="profile-main__btn button-primary"
          label="Сохранить"
        ></UiButton>
      </div>
      <div class="profile-main__side">
        <UiInput label="Ваша почта" placeholder="dana1234@gmail.com"></UiInput>

        <UiCalendar label="Дата рождения" class="profile-main__calendar" />

        <UiSelect
          class="profile-main__select"
          v-model="selectCity"
          :options="cities"
          label="Пол"
        ></UiSelect>
      </div>
    </div>
  </div>
</template>

<script setup>
const cities = reactive([
  {
    id: 1,
    name: "Алматы",
  },
  {
    id: 2,
    name: "Астана",
  },
  {
    id: 3,
    name: "Қызылорда",
  },
]);
const selectCity = ref(cities[0]);
</script>

<style lang="scss" scoped>
.profile-main {
  &__wrapper {
    display: flex;
    justify-content: space-between;
    gap: 46px;
    margin: 12px 0;
    background-color: $white;
    padding: 16px;
    border-radius: 16px;
  }
  &__side {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    height: 100%;
    &:last-child {
      margin-top: 14px;
    }
  }
  &__select {
    border-radius: 26px;
    background-color: transparent;
    border: 1px solid $surface-300;
  }
  &__btn {
    margin-top: 16px;
  }
  &__calendar {
    border-radius: 26px;
    background-color: transparent;
    border: 1px solid $surface-300;
    width: 100%;
    padding: 4px;
    &-text {
      color: $surface-900;
      font-size: 14px;
      font-weight: 400;
    }
  }
  &__box {
    display: flex;
    gap: 12px;
    align-items: center;
    &-text {
      font-size: 12px;
      cursor: pointer;
      &--upload {
        color: $blue-500;
      }
      &--delete {
        color: $orange-200;
      }
    }
  }
  &__inner {
    display: flex;
    gap: 4px;
    flex-direction: column;
    &-box {
      display: flex;
      gap: 6px;
      align-items: center;
    }
  }
  &__avatar {
    width: 66px;
    height: 66px;
    border-radius: 50%;
    object-fit: cover;
  }
}
</style>
