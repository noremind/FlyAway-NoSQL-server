<template>
  <div class="my-hotels">
    <div class="my-hotels__wrapper">
      <div class="my-hotels__cards">
        <TheProfileHotelTicket
          v-for="card in 8"
          :key="card"
        ></TheProfileHotelTicket>
      </div>
    </div>
    <br />

    <UiPagination class="my-hotels__paginatoin"></UiPagination>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.my-hotels {
  &__wrapper {
    background-color: $white;
    padding: 16px;
    border-radius: 16px;
  }
  &__tabs {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__cards {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin: 24px 0;
  }
}
</style>
