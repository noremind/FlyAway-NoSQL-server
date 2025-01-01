<template>
  <TreeSelect
    v-model="selection"
    :options="testData"
    selectionMode="checkbox"
    :placeholder="placeholder"
    class="w-full"
  />
</template>

<script setup>
import TreeSelect from "primevue/treeselect";
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: String,
});

const selection = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    selection.value = newValue;
  },
  { deep: true }
);

const emit = defineEmits(["update:modelValue"]);

watch(
  selection,
  (newValue) => {
    emit("update:modelValue", newValue);
  },
  { deep: true }
);

const testData = [
  {
    key: "0",
    label: "Documents",
    data: "Documents Folder",
    icon: "pi pi-fw pi-inbox",
    partialChecked: false, // Add initial state (optional)
    checked: false, // Add initial state (optional)
    children: [
      {
        key: "0-0",
        label: "Work",
        data: "Work Folder",
        icon: "pi pi-fw pi-cog",
        partialChecked: false,
        checked: false,
        children: [
          {
            key: "0-0-0",
            label: "Expenses.doc",
            icon: "pi pi-fw pi-file",
            data: "Expenses Document",
            partialChecked: false,
            checked: false,
          },
        ],
      },
    ],
  },
];
</script>

<style lang="scss" scoped></style>
