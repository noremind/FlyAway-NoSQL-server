<template>
  <div class="ui-table">
    <div class="ui-table__toolbar">
      <div>
        <p class="ui-table__count">
          Всего: {{ rows.length }}
        </p>
        <p v-if="isFiltered" class="ui-table__filtered">
          Найдено: {{ filteredRows.length }}
        </p>
      </div>

      <label class="ui-table__search">
        <UiIcons icon="lupa" size="size-17-5" color="surface-400" />
        <input
          v-model.trim="search"
          type="search"
          :placeholder="filterPlaceholder"
        />
      </label>
    </div>

    <div class="ui-table__frame">
      <div v-if="loading" class="ui-table__loader">
        <span class="ui-table__spinner"></span>
        Загрузка данных
      </div>

      <table v-else class="ui-table__table">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key">
              <button
                class="ui-table__sort"
                type="button"
                @click="toggleSort(column.key)"
              >
                <span>{{ column.label }}</span>
                <span class="ui-table__sort-icon">
                  {{ sortIcon(column.key) }}
                </span>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in paginatedRows" :key="row._id || row.id">
            <td v-for="column in columns" :key="column.key">
              {{ formatValue(getValue(row, column.key)) }}
            </td>
          </tr>
          <tr v-if="!paginatedRows.length">
            <td class="ui-table__empty" :colspan="columns.length">
              Данных пока нет
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showPagination" class="ui-table__pagination">
      <button
        class="ui-table__page-btn"
        type="button"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        Назад
      </button>

      <div class="ui-table__pages">
        <button
          v-for="page in totalPages"
          :key="page"
          class="ui-table__page"
          :class="{ 'ui-table__page--active': page === currentPage }"
          type="button"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
      </div>

      <button
        class="ui-table__page-btn"
        type="button"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        Вперед
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  columns: {
    type: Array,
    default: () => [],
  },
  rows: {
    type: Array,
    default: () => [],
  },
  loading: Boolean,
  pageSize: {
    type: Number,
    default: 20,
  },
  filterPlaceholder: {
    type: String,
    default: "Поиск по таблице",
  },
});

const search = ref("");
const sortKey = ref("");
const sortDirection = ref("asc");
const currentPage = ref(1);

const getValue = (row, key) => {
  return key.split(".").reduce((value, part) => value?.[part], row);
};

const normalizeValue = (value) => {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.join(" ");
  if (typeof value === "object") return Object.values(value).join(" ");
  return String(value);
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return "-";

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return new Date(value).toLocaleDateString("ru-RU");
  }

  return value;
};

const filteredRows = computed(() => {
  const query = search.value.toLowerCase();

  if (!query) return props.rows;

  return props.rows.filter((row) => {
    return props.columns.some((column) => {
      return normalizeValue(getValue(row, column.key)).toLowerCase().includes(query);
    });
  });
});

const sortedRows = computed(() => {
  if (!sortKey.value) return filteredRows.value;

  return [...filteredRows.value].sort((firstRow, secondRow) => {
    const firstValue = normalizeValue(getValue(firstRow, sortKey.value));
    const secondValue = normalizeValue(getValue(secondRow, sortKey.value));
    const firstNumber = Number(firstValue);
    const secondNumber = Number(secondValue);
    const bothNumbers = !Number.isNaN(firstNumber) && !Number.isNaN(secondNumber);

    const compareResult = bothNumbers
      ? firstNumber - secondNumber
      : firstValue.localeCompare(secondValue, "ru", { numeric: true });

    return sortDirection.value === "asc" ? compareResult : -compareResult;
  });
});

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(sortedRows.value.length / props.pageSize));
});

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize;
  return sortedRows.value.slice(start, start + props.pageSize);
});

const showPagination = computed(() => sortedRows.value.length > props.pageSize);
const isFiltered = computed(() => !!search.value);

const toggleSort = (key) => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
    return;
  }

  sortKey.value = key;
  sortDirection.value = "asc";
};

const sortIcon = (key) => {
  if (sortKey.value !== key) return "↕";
  return sortDirection.value === "asc" ? "↑" : "↓";
};

watch([search, () => props.rows], () => {
  currentPage.value = 1;
});

watch(totalPages, (pages) => {
  if (currentPage.value > pages) {
    currentPage.value = pages;
  }
});
</script>

<style lang="scss" scoped>
.ui-table {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;

  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 14px;
    background: $surface-150;
    border: 1px solid $surface-300;
    border-radius: 8px;
  }

  &__count {
    color: $surface-900;
    font-size: 15px;
    font-weight: 700;
  }

  &__filtered {
    margin-top: 4px;
    color: $surface-400;
    font-size: 13px;
  }

  &__search {
    width: min(100%, 320px);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    background: $white;
    border: 1px solid $surface-300;
    border-radius: 8px;

    input {
      width: 100%;
      color: $surface-900;
      font-size: 14px;
    }
  }

  &__frame {
    width: 100%;
    overflow-x: auto;
    background: $white;
    border: 1px solid $surface-300;
    border-radius: 8px;
  }

  &__table {
    width: 100%;
    min-width: 760px;
    border-collapse: collapse;
  }

  th,
  td {
    padding: 14px 16px;
    text-align: left;
    color: $surface-900;
    border-bottom: 1px solid $surface-300;
    font-size: 14px;
  }

  th {
    color: $red-500;
    font-weight: 700;
    background: $surface-150;
  }

  tr {
    transition: background-color 0.2s ease;

    &:hover {
      background: $surface-150;
    }
  }

  tr:last-child td {
    border-bottom: 0;
  }

  &__sort {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
    color: inherit;
    font-weight: inherit;
  }

  &__sort-icon {
    color: $surface-400;
    font-size: 12px;
  }

  &__empty,
  &__loader {
    text-align: center;
    color: $surface-400;
  }

  &__loader {
    min-height: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    font-size: 14px;
  }

  &__spinner {
    width: 24px;
    height: 24px;
    border: 3px solid $surface-300;
    border-top-color: $red-500;
    border-radius: 50%;
    animation: tableSpin 0.8s linear infinite;
  }

  &__pagination {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    flex-wrap: wrap;
  }

  &__pages {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  &__page,
  &__page-btn {
    min-height: 36px;
    padding: 8px 12px;
    color: $surface-900;
    background: $white;
    border: 1px solid $surface-300;
    border-radius: 8px;
    transition:
      color 0.2s ease,
      background-color 0.2s ease,
      border-color 0.2s ease;

    &:hover:not(:disabled),
    &--active {
      color: $white;
      background: $red-500;
      border-color: $red-500;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

@keyframes tableSpin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 700px) {
  .ui-table {
    &__toolbar {
      align-items: stretch;
      flex-direction: column;
    }

    &__search {
      width: 100%;
    }

    &__pagination {
      justify-content: flex-start;
    }
  }
}
</style>
