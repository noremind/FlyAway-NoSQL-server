<template>
  <teleport to="body">
    <div class="modal" v-if="isShow">
      <div class="modal__wrapper" @click="emit('close')"></div>
      <div class="modal__block" :style="{ maxWidth: maxWidth }">
        <div class="modal__head" :class="{ 'p-0': withoutPadding }">
          <div class="modal__title" v-if="title">{{ title }}</div>
          <UiIcons
            v-if="hideClose"
            icon="circle-close"
            size="size-24"
            @click="emit('close')"
            class="modal__close"
            :class="{ '-only': !title }"
          />
        </div>
        <div class="modal__content" :class="{ 'p-0': withoutPadding }">
          <slot></slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
const props = defineProps({
  isShow: Boolean,
  maxWidth: String,
  hideClose: {
    type: Boolean,
    default: true,
  },
  title: String,
  withoutPadding: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  z-index: 100;
  align-items: center;
  justify-content: center;
  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 16px 0;
  }
  &__title {
    color: $surface-900;
    font-size: 17.5px;
    font-weight: 700;
    line-height: 21px;
  }
  &__wrapper {
    position: absolute;
    z-index: -1;
    width: 1000%;
    height: 1000%;
    background: rgba(0, 0, 0, 0.5);
    transition: 0.2s;
  }
  &__block {
    background: $white;
    border-radius: 16px;
    min-height: 160px;
    max-width: 300px;
    width: 100%;
    position: relative;
  }
  &__close {
    cursor: pointer;
    z-index: 1;
    &.-only {
      position: absolute;
      right: 16px;
      top: 16px;
    }
  }
  &__content {
    padding: 16px;
  }
}

.p-0 {
  padding: 0;
}
</style>
