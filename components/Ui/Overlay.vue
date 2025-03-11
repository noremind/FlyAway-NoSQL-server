<template>
  <transition name="overlay">
    <section v-if="isShow" class="overlay">
      <div
        class="overlay__wrapper"
        :class="{ 'overlay__wrapper--padding': btnLabel }"
      >
        <div class="overlay__header">
          <UiIcons
            class="overlay__icon down"
            icon="arrow"
            size="size-20"
            color="red-500"
            @click="emit('close')"
          ></UiIcons>

          <h2
            class="overlay__title"
            :class="{ 'overlay__title--center': !showHeaderIcons }"
          >
            {{ title }}
          </h2>

          <UiIcons
            v-if="headerIcon && showHeaderIcons"
            size="size-20"
            class="overlay__icon"
            color="red-500"
            :icon="headerIcon"
          ></UiIcons>
          <p v-if="!headerIcon && showHeaderIcons" class="overlay__reset">
            Сбросить
          </p>
          <UiIcons
            v-if="haveFavoriteIcon"
            size="size-20"
            class="overlay__icon"
            color="red-500"
            icon="heart"
          ></UiIcons>
        </div>

        <div class="overlay__content">
          <slot></slot>
        </div>

        <UiButton
          v-if="btnLabel"
          class="overlay__btn"
          :label="btnLabel"
          @click="emit('action')"
        ></UiButton>
        <BaseFooter v-if="haveFooter" class="overlay__footer"></BaseFooter>
      </div>
    </section>
  </transition>
</template>

<script setup>
const emit = defineEmits(["close", "action"]);
const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
  title: String,
  btnLabel: {
    type: String,
    default: () => "",
  },
  headerIcon: {
    type: String,
    default: () => "",
  },
  haveFooter: {
    type: Boolean,
    default: false,
  },
  showHeaderIcons: {
    type: Boolean,
    default: true,
  },
  haveFavoriteIcon: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.overlay {
  // visibility: hidden;
  position: static;
  &__header {
    display: none;
  }
  &__btn,
  &__footer {
    display: none;
  }
}
.overlay-enter-active {
  animation: overlay 0.5s;
}
.overlay-leave-active {
  animation: overlay 0.5s reverse;
}
@keyframes overlay {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0%);
  }
}
@media (max-width: 375px) {
  .overlay {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 200;
    background-color: $surface-150;
    width: 100%;
    overflow-y: scroll;
    height: 100%;
    &__wrapper {
      width: 100%;
      height: 100%;
      color: $surface-900;
      overflow-y: scroll;
      &--padding {
        padding-bottom: 75px;
      }
    }
    &__header {
      display: flex;
      justify-content: space-between;
      gap: 6px;
      align-items: center;
      height: 85px;
      padding: 20px 16px 0 16px;
      background-color: $white;
    }
    &__reset {
      color: $red-500;
      font-weight: 400;
      font-size: 14px;
      cursor: pointer;
    }
    &__icon {
      cursor: pointer;
    }
    &__title {
      font-size: 20px;
      font-weight: 400;
      flex-grow: 1;
      text-align: center;
      margin-left: 26px;
      display: inline-block;
      &--center {
        transform: translateX(-10%);
      }
    }
    &__content {
      margin-top: 16px;
      padding: 0 16px;
    }
    &__btn {
      position: absolute;
      bottom: 0;
      height: 44px;
      width: calc(100% - 32px);
      margin: 0 auto 16px 0;
      left: 17px;
      z-index: 100;
      background-color: $red-500;
      padding: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: $white;
    }
    &__footer {
      display: block;
    }
  }
}
</style>
