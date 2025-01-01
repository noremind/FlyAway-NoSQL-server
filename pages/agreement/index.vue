<template>
  <section class="agreement">
    <div class="agreement__wrapper">
      <h1 class="agreement__title title">Политика конфиденциальности</h1>

      <p class="agreement__info">
        Дата вступления в силу:
        <span class="agreement__date">20 июля 2024 года</span>
      </p>

      <div class="agreement__block" v-for="block in 6" :key="block">
        <p class="agreement__bold">{{ block }}. Общие положения</p>
        <p class="agreement__text">
          Настоящая Политика конфиденциальности (далее – "Политика") определяет
          порядок обработки и защиты персональных данных пользователей (далее –
          "Пользователи") онлайн-сервиса [название сервиса], предоставляемого
          [название компании] (далее – "Компания"). Мы стремимся обеспечить
          конфиденциальность ваших данных в соответствии с применимым
          законодательством о защите персональной информации.
        </p>
        <div class="agreement__box">
          <p class="agreement__text">
            Собранные данные используются для следующих целей:
          </p>
          <ul class="agreement__list">
            <li class="agreement__list-item">
              Обеспечение работы сервиса и предоставления запрашиваемых услуг.
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
.agreement {
  &__wrapper {
    color: $surface-900;
    margin: 36px 0 46px 0;
    display: flex;
    flex-direction: column;
    gap: 32px;
  }
  &__date {
    font-weight: 400;
  }
  &__block {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  &__bold {
    font-weight: 400;
  }
  &__list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    &-item {
      list-style: disc;
      margin-left: 24px;
    }
  }
}
</style>
