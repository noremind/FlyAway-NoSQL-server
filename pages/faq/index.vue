<template>
  <section class="faq">
    <div class="faq__wrapper">
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

<script setup></script>

<style lang="scss" scoped>
.faq {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: 32px;
    margin: 36px 0;
    color: $surface-900;
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
</style>
