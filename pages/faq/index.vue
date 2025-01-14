<template>
  <section class="faq">
    <div class="faq__wrapper">
      <UiInput
        class="faq__search"
        placeholder="Введите название"
        after-icon="lupa"
      ></UiInput>
      <h1 class="faq__title title">Часто задаваемые вопросы (FAQ)</h1>

      <div class="faq__content">
        <TheFaqAside></TheFaqAside>

        <div class="faq__accordions">
          <section class="faq__accordion">
            <h2 class="faq__accordion-title">О покупке туров</h2>
            <div class="faq__accordion-block">
              <TheFaqAccordion
                v-for="accordion in 6"
                :key="accordion"
              ></TheFaqAccordion>
            </div>
          </section>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const faqs = ref(null);
const getFaqs = () => {
  useApi({
    url: "/faqs",
    method: "get",
  })
    .then((res) => {
      console.log(res.data);
      faqs.value = res.data?.faqs;
    })
    .catch((error) => {
      console.log(error);
    });
};
getFaqs();
</script>

<style lang="scss" scoped>
.faq {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: 32px;
    margin: 36px 0;
    color: $surface-900;
  }
  &__search {
    background-color: $white;
    border-radius: 24px;
    display: none;
  }
  &__title {
    margin-bottom: 6px;
  }
  &__content {
    display: flex;
    gap: 16px;
  }
  &__accordions {
    background-color: $white;
    width: 100%;
    padding: 24px;
    border-radius: 24px;
    height: 100%;
  }
  &__accordion {
    &-title {
      color: $blue-500;
      font-weight: 400;
      margin-bottom: 16px;
    }
    &-block {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }
}

@media (max-width: 375px) {
  .faq {
    &__wrapper {
      margin: 12px 0;
    }
    &__search {
      display: block;
    }
  }
}
</style>
