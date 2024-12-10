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
  border-radius: 16px;
  &__wrapper {
    width: 100%;
    // padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    position: relative;
  }
  &__img {
    border-radius: 16px;
    position: relative;
    width: 100%;
    min-width: 158px;
    max-width: 292px;
    width: 100%;
    object-fit: cover;
    z-index: -1;
  }
  &__title {
    color: $surface-900;
    position: absolute;
    // bottom: 15px;
    background-color: rgba(255, 255, 255, 0.8);
    font-size: 20px;
    font-weight: 700;
    border-radius: 16px;
    padding: 6px 0;
    width: 80%;
    text-align: center;
    margin: 12px;
  }
}

@media (max-width: 768px) {
  .hotel {
    &__title {
      font-size: 16px;
    }
  }
}
</style>
