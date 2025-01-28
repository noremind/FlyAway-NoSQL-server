<template>
  <div class="calendar">
    <p class="calendar__label">{{ label }}</p>
    <Calendar
      class="calendar__field"
      v-model="model"
      :showIcon="haveIcon"
      dateFormat="dd.mm.yy"
      :placeholder="placeholder"
    >
      <template #inputicon="{ clickCallback }">
        <UiIcons icon="lupa"></UiIcons>
      </template>
    </Calendar>
  </div>
</template>

<script setup>
import Calendar from "primevue/calendar";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: [Date, String],
    default: () => null,
  },
  label: {
    type: String,
    default: "",
  },
  haveIcon: {
    type: Boolean,
    default: true,
  },
  placeholder: String,
});
const model = ref(props.modelValue);

watch(
  () => model.value,
  (newVal) => {
    emit("update:modelValue", newVal);
  }
);
</script>

<style scoped lang="scss">
.calendar {
  position: relative;
  margin-top: 14px;
  &__label {
    position: absolute;
    top: -19px;
    font-weight: 400;
    font-size: 14px;
    color: $surface-900;
  }
  &__field {
    background-color: inherit;
    border: none;
    border-radius: inherit;
    padding: inherit;
    width: inherit;
    color: inherit;
  }
}
</style>
