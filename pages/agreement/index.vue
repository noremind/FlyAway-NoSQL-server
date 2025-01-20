<template>
  <section class="agreement">
    <div class="agreement__wrapper" v-if="agreement">
      <h1 class="agreement__title title">Политика конфиденциальности</h1>

      <p class="agreement__info">
        Дата вступления в силу:
        <span class="agreement__date">
          {{ formatDate(agreement.updated_at) }}</span
        >
      </p>

      <div class="agreement__block" v-html="agreement.content"></div>
    </div>
  </section>
</template>

<script setup>
const agreement = ref(null);

const getAgreement = () => {
  useApi({
    url: "/pages/terms",
    mehtod: "get",
  }).then((res) => {
    agreement.value = res.data;
  });
};
getAgreement();
</script>

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
