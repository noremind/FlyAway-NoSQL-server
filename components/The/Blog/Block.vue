<template>
  <section class="block">
    <div class="block__wrapper">
      <img
        class="block__img"
        src="@/assets/image/content/tour-card.png"
        alt="Preview"
      />
      <div class="block__content">
        <nuxt-link class="block__link" to="/blog/1">
          <h2 class="block__title">Почему стоит отправиться в поход?</h2>
        </nuxt-link>
        <p class="block__description">
          {{ visibleText }}
          <span v-if="isTruncated" class="block__more" @click="toggleExpand">
            {{ expanded ? "скрыть" : "подробнее..." }}
          </span>
        </p>
        <div class="block__box">
          <p class="block__author">Аскар Таханов</p>
          <p class="block__date">10.11.2024</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";

// Текст описания
const description =
  "Походы — это не просто активный отдых, это настоящее путешествие к себе и природе. В современном ритме жизни, полном экранов, дедлайнов и суеты, поход становится глотком свежего воздуха — буквально и в переносном смысле.";

// Состояние развёрнутого текста
const expanded = ref(false);

// Проверка, нужно ли усекать текст
const isTruncated = computed(() => description.split(" ").length > 30);

// Логика отображения текста
const visibleText = computed(() => {
  if (expanded.value || !isTruncated.value) {
    return description;
  }
  return description.split(" ").slice(0, 30).join(" ") + "...";
});

// Переключение состояния
const toggleExpand = () => {
  expanded.value = !expanded.value;
};
</script>

<style lang="scss" scoped>
.block {
  &__wrapper {
    padding: 16px;
    border-radius: 16px;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.04);
    background-color: $white;
    width: 100%;
    color: $surface-900;
    display: flex;
    gap: 16px;
  }
  &__img {
    border-radius: 16px;
    width: 240px;
    object-fit: cover;
  }
  &__title {
    font-size: 20px;
    font-weight: 700;
    cursor: pointer;
    color: $surface-900;
  }
  &__link {
    color: $surface-900;
  }
  &__content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    justify-content: space-between;
  }
  &__description {
    font-size: 14px;
    font-weight: 100;
  }
  &__box {
    display: flex;
    gap: 4px;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    color: $surface-400;
  }
  &__more {
    color: $blue-500;
    font-weight: 400;
    cursor: pointer;
    display: block;
  }
}
</style>
