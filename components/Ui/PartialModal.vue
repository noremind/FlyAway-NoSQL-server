<template>
  <transition name="partial">
    <div
      class="partial"
      v-if="isShow"
      ref="partialBlock"
      @click="closePartial($event)"
    >
      <div class="partial__wrapper" :style="{ height: height }">
        <span class="partial__line"></span>

        <div class="partial__content">
          <slot name="body"></slot>
        </div>

        <div class="partial__fixed">
          <slot name="fixed"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
const partialBlock = ref(null);
const emit = defineEmits(["close"]);
const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
  height: {
    type: String,
    default: "75%",
  },
  darkBg: {
    type: Boolean,
    default: true,
  },
});

const closePartial = (event) => {
  if (event?.target && event?.target.classList[0] === "partial") {
    emit("close");
  }
};
</script>

<style lang="scss" scoped>
.partial {
  display: none;
}
.partial-enter-active {
  animation: partial 0.2s;
}
.partial-leave-active {
  animation: partial 0.3s reverse;
}

@keyframes partial {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0%);
  }
}

@media (max-width: 375px) {
  .partial {
    position: fixed;
    z-index: 300;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: block;

    &__wrapper {
      position: absolute;
      background-color: $white;
      width: 100%;
      bottom: 0;
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      overflow-y: scroll;
      z-index: 301;
    }
    &__line {
      width: 100px;
      height: 2px;
      border-radius: 4px;
      background-color: $surface-300;
      position: inherit;
      left: 50%;
      transform: translateX(-50%);
      top: 10px;
    }
    &__content {
      padding: 30px 16px 16px 16px;
    }
    &__fixed {
      padding: 0 16px;
      position: absolute;
      bottom: 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    }
  }
}
</style>
