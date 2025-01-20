<template>
  <section class="blog">
    <div class="blog__wrapper">
      <div class="blog__top">
        <UiInput
          class="blog__top-search"
          placeholder="Введите название"
          after-icon="lupa"
          v-model="filterQueries.q"
        ></UiInput>
        <p class="blog__top-text" @click="openFilterMobile">Фильтр</p>
      </div>
      <div class="blog__header">
        <h1 class="blog__title title">Блог и Статьи</h1>
      </div>

      <div class="blog__content">
        <div class="blog__content-left">
          <section class="blog__filters">
            <div class="blog__filters-header">
              <UiIcons
                icon="filter-burger"
                size="size-36"
                color="blue-500"
              ></UiIcons>
              <h2 class="blog__filters-title">Фильтр</h2>
            </div>

            <div class="blog__filters-box">
              <UiInput
                placeholder="Введите название"
                after-icon="lupa"
                icon-color="surface-900"
                label="Поиск по названию"
                v-model="filterQueries.q"
              ></UiInput>

              <UiHashTag :tags="tags"></UiHashTag>
            </div>
          </section>
          <TheCommonAdBanner class="blog__ad"></TheCommonAdBanner>
        </div>
        <div class="blog__block">
          <section class="blog__sort">
            <h2 class="blog__sort-title">Сортировка</h2>
            <UiCheckbox
              :options="options"
              v-model="filterQueries.sort_by"
            ></UiCheckbox>
          </section>

          <div class="blog__cards" v-if="blogs">
            <TheBlogBlock
              v-for="blog in blogs"
              :key="blog"
              :blog="blog"
            ></TheBlogBlock>
          </div>

          <UiPagination
            v-if="pagination?.last_page && pagination?.last_page !== 1"
            :total-items="pagination?.total_items"
            :current-page="currentPage"
            @change-page="paginationPage"
            :last-page="pagination?.last_page"
            :per-page="pagination?.per_page"
            class="blog__pagination"
          ></UiPagination>
        </div>
      </div>
    </div>
  </section>
  <UiOverlay
    :is-show="isOpenFilterMobile"
    @close="closeFilterMobile"
    title="Фильтр"
  >
    <div class="blog__overlay-checkboxs">
      <p class="blog__overlay-bold">Сортировка</p>
      <UiCheckbox
        v-for="(item, index) in options"
        :key="index"
        :label="item.label"
      ></UiCheckbox>
    </div>
    <UiHashTag :tags="tags"></UiHashTag>
  </UiOverlay>
</template>

<script setup>
const blogs = ref(null);
const pagination = reactive({});
const currentPage = ref(1);
const isOpenFilterMobile = ref(false);
const filterQueries = reactive({
  q: null,
  sort_by: null,
  sort_order: null,
});

const options = [
  { label: "по цене", value: "price" },
  { label: "по популярности", value: "popularity" },
];

const tags = reactive([
  {
    id: 1,
    name: "активный",
  },
  {
    id: 2,
    name: "экскурсионный",
  },
  {
    id: 3,
    name: "wellness",
  },
  {
    id: 4,
    name: "активный",
  },
]);
const openFilterMobile = () => {
  isOpenFilterMobile.value = true;
};

const closeFilterMobile = () => {
  isOpenFilterMobile.value = false;
};

const getBlogs = (query = {}) => {
  useApi({
    url: "/news",
    method: "get",
    params: { ...query, page: currentPage.value },
  }).then((res) => {
    blogs.value = res.data.data;
    pagination.last_page = res.data.last_page;
    pagination.total_items = res.data.total;
    pagination.per_page = res.data.per_page;
  });
};
getBlogs();

const setQuery = (key, value) => {
  const query = {};
  filterQueries[key] = value;
  for (const key in filterQueries) {
    if (filterQueries[key] !== null && filterQueries[key] !== "") {
      query[key] = filterQueries[key];
    }
  }
  getBlogs(query);
};

const paginationPage = (page) => {
  currentPage.value = page;
  getBlogs();
};

watch(
  () => filterQueries.q,
  (newVal) => {
    newVal.length > 2 ? setQuery("q", newVal) : null;
    newVal.length === 0 ? getBlogs() : null;
  }
);

watch(
  () => filterQueries.sort_by,
  (newVal) => {
    setQuery("sort_by", newVal);
  }
);
</script>

<style lang="scss" scoped>
.blog {
  &__wrapper {
    margin: 60px 0 30px 0;
  }
  &__header {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: center;
    height: 46px;
  }
  &__content {
    width: 100%;
    display: flex;
    gap: 24px;
    margin: 36px 0;
  }
  &__filters {
    width: 255px;
    border-radius: 16px;
    background-color: $white;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.04);
    &-box {
      display: flex;
      flex-direction: column;
      gap: 36px;
      padding: 20px;
    }
    &-range {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    &-inner {
      display: flex;
      gap: 6px;
      align-items: center;
    }
    &-header {
      display: flex;
      gap: 12px;
      align-items: center;
      background-color: $blue-200;
      padding: 20px;
      border-radius: 16px;
    }
    &-title {
      color: $surface-900;
      font-size: 16px;
    }
    &-text {
      font-size: 14px;
      font-weight: 400;
      color: $surface-900;
      margin-bottom: 12px;
    }
  }
  &__overlay {
    &-checkboxs {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 32px;
    }
    &-bold {
      font-weight: 400;
      font-size: 14px;
    }
  }
  &__block {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  &__sort {
    background-color: $white;
    border-radius: 16px;
    display: flex;
    align-items: center;
    gap: 24px;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.04);
    &-title {
      padding: 26px;
      background-color: $blue-200;
      border-radius: 16px;
      color: $surface-900;
      font-size: 16px;
      margin-right: 16px;
    }
  }
  &__cards {
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  &__banner {
    grid-column: 1 / -1;
  }
  &__pagination {
    margin: 0 auto;
    &--scroll {
      position: absolute;
      bottom: 0;
      z-index: 3;
      margin-bottom: 12px;
    }
  }
  &__top {
    display: none;
  }
}

@media (max-width: 375px) {
  .blog {
    &__wrapper {
      margin: 16px 0;
    }
    &__top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      &-text {
        color: $blue-500;
        font-weight: 400;
        cursor: pointer;
      }
      &-search {
        width: 100%;
        background-color: $white;
        border-radius: 26px;
      }
    }
    &__ad,
    &__filters,
    &__sort {
      display: none;
    }
    &__content {
      margin: 16px 0;
      gap: 0;
    }
  }
}
</style>
