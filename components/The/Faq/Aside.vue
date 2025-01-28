<template>
  <div class="aside">
    <div class="aside__wrapper">
      <ul class="aside__list">
        <li
          class="aside__list-item"
          :class="{ 'aside__list-item--active': selectedFaq.id === list.id }"
          v-for="list in faqs"
          :key="list.id"
          @click="emit('changeFaq', list)"
        >
          {{ list.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["changeFaq"]);
const props = defineProps({
  faqs: {
    type: Array,
    default: () => [],
  },
  selectedFaq: {
    type: Object,
    default: () => {},
  },
});
</script>

<style lang="scss" scoped>
.aside {
  &__wrapper {
    background-color: $white;
    border-radius: 16px;
    width: 255px;
  }
  &__list {
    display: flex;
    flex-direction: column;
    color: $surface-900;
    &-item {
      padding: 22px 16px;
      cursor: pointer;
      font-size: 14px;
      &:first-child {
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
      }
      &:last-child {
        border-bottom-left-radius: 16px;
        border-bottom-right-radius: 16px;
      }
      &--active {
        color: black;
        background-color: $blue-200;
        font-weight: 600;
      }
    }
  }
}

@media (max-width: 375px) {
  .aside {
    display: none;
  }
}
</style>
