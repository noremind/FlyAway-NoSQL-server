<template>
  <section class="block">
    <div class="block__wrapper">
      <img class="block__img" :src="blog?.image_url" :alt="blog?.name" />
      <div class="block__content">
        <nuxt-link class="block__link" to="/blog/1">
          <h2 class="block__title">{{ blog?.name }}</h2>
        </nuxt-link>
        <p class="block__description">
          {{ visibleText }}
          <span v-if="isTruncated" class="block__more" @click="toggleExpand">
            {{ expanded ? "скрыть" : "подробнее..." }}
          </span>
        </p>
        <div class="block__box">
          <p class="block__author">Аскар Таханов</p>
          <p class="block__date">{{ formatDate(blog?.created_at) }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  blog: {
    type: Object,
    default: () => {},
  },
});

const description = ref(props.blog?.description || " ");

const expanded = ref(false);

const isTruncated = computed(() => description.value.split(" ").length > 30);

const visibleText = computed(() => {
  if (expanded.value || !isTruncated.value) {
    return description.value;
  }
  return description.value.split(" ").slice(0, 30).join(" ") + "...";
});

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
    max-width: 240px;
    width: 100%;
    object-fit: cover;
    height: 100%;
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
    width: 100%;
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

@media (max-width: 375px) {
  .block {
    &__wrapper {
      padding: 0;
      gap: 6px;
    }
    &__img {
      max-width: 145px;
      height: 130px;
    }
    &__description {
      font-size: 10px;
    }
    &__title {
      margin-top: 6px;
      font-size: 16px;
    }
    &__box {
      padding: 0 6px 0 0;
      font-size: 10px;
    }
    &__content {
      gap: 4px;
    }
  }
}
</style>
