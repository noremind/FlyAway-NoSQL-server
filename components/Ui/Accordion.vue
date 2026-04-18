<template>
  <div class="accordion">
    <article
      v-for="(item, index) in items"
      :key="item.title"
      class="accordion__item"
      :class="{ 'accordion__item--open': activeIndex === index }"
    >
      <button class="accordion__trigger" type="button" @click="toggle(index)">
        <span class="accordion__title">{{ item.title }}</span>
        <UiIcons
          icon="chevron"
          size="size-14"
          color="red-500"
          :deg="activeIndex === index ? 'up' : ''"
        />
      </button>

      <div v-if="activeIndex === index" class="accordion__content">
        <p class="accordion__text">{{ item.text }}</p>
      </div>
    </article>
  </div>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  initiallyOpen: {
    type: Number,
    default: 0,
  },
});

const activeIndex = ref(props.items.length ? props.initiallyOpen : null);

const toggle = (index) => {
  activeIndex.value = activeIndex.value === index ? null : index;
};
</script>

<style lang="scss" scoped>
.accordion {
  display: grid;
  gap: 12px;

  &__item {
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba($red-500, 0.1);
    border-radius: 8px;
    overflow: hidden;

    &--open {
      box-shadow: 0 16px 30px rgba(32, 36, 38, 0.06);
    }
  }

  &__trigger {
    width: 100%;
    min-height: 62px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 16px 18px;
    text-align: left;
    background: transparent;
  }

  &__title {
    color: $surface-900;
    font-size: 16px;
    font-weight: 600;
  }

  &__content {
    padding: 0 18px 18px;
  }

  &__text {
    color: $surface-500;
    font-size: 14px;
    line-height: 1.55;
  }
}
</style>
