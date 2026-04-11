<template>
  <div class="ui-table">
    <table class="ui-table__table">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row._id || row.id">
          <td v-for="column in columns" :key="column.key">
            {{ getValue(row, column.key) }}
          </td>
        </tr>
        <tr v-if="!rows.length">
          <td class="ui-table__empty" :colspan="columns.length">
            Данных пока нет
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  columns: {
    type: Array,
    default: () => [],
  },
  rows: {
    type: Array,
    default: () => [],
  },
});

const getValue = (row, key) => {
  return key.split(".").reduce((value, part) => value?.[part], row) ?? "-";
};
</script>

<style lang="scss" scoped>
.ui-table {
  width: 100%;
  overflow-x: auto;
  background: $white;
  border: 1px solid $surface-300;
  border-radius: 8px;

  &__table {
    width: 100%;
    min-width: 720px;
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

  &__empty {
    text-align: center;
    color: $surface-400;
  }
}
</style>
