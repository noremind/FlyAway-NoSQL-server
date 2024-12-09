<template>
  <section class="hotel">
    <div class="hotel__wrapper">
      <img
        class="hotel__img"
        src="@/assets/image/content/hotel-card.png"
        alt="Hotel"
      />
      <h3 class="hotel__title">Домики в горах</h3>
    </div>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
.hotel {
  max-width: 292px;
  width: 100%;
  position: relative;
  height: 200px;
  border-radius: 16px;
  &__wrapper {
    width: 100%;
    height: 200px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
  }
  &__img {
    border-radius: 16px;
    position: absolute;
    width: 100%;
    object-fit: cover;
    z-index: -1;
  }
  &__title {
    color: $surface-900;
    background-color: rgba(255, 255, 255, 0.8);
    font-size: 20px;
    font-weight: 700;
    border-radius: 16px;
    padding: 6px 0;
    width: 100%;
    text-align: center;
    margin: 12px;
  }
}
</style>
