<template>
  <div class="pagination">
    <Paginator
      :rows="perPage"
      :first="(currentPage - 1) * perPage"
      :totalRecords="totalItems"
      @page="onPageChange"
    ></Paginator>
    <span
      :class="{ 'p-paginator-page-selected': checkLastPage }"
      class="pagination__last-page"
      @click="clickLastPage"
      >{{ lastPage }}</span
    >
  </div>
</template>

<script setup>
const emit = defineEmits(["changePage"]);
const checkedPage = ref(1);

const checkLastPage = computed(() => {
  return checkedPage.value === props.lastPage;
});

const clickLastPage = (event) => {
  const page = +event.target.innerText;
  if (page <= props.lastPage) {
    checkedPage.value = page;
    emit("changePage", checkedPage.value);
    if (process.client) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }
};

const onPageChange = (event) => {
  const page = event.page + 1;
  if (page <= props.lastPage) {
    checkedPage.value = page;
    emit("changePage", checkedPage.value);

    if (process.client) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }
};

const props = defineProps({
  totalItems: {
    type: Number,
    default: 10,
  },
  lastPage: {
    type: Number,
    default: 0,
  },
  perPage: {
    type: Number,
    default: 1,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
});
</script>

<style lang="scss" scoped>
.pagination {
  position: relative;
  max-width: 240px;
  display: flex;
  &__last-page {
    position: relative;
    font-size: 13px;
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    right: 13px;
    cursor: pointer;
    border-radius: 21px;
    margin-inline: 4px;
    background-color: transparent;
  }
}
</style>
