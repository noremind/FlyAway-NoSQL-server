<template>
  <div>
    <label class="checkbox-container">
      <input type="checkbox" :value="modelValue" v-model="model" />
      <span class="custom-checkbox"></span>
      {{ label }}
    </label>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  label: String,
  modelValue: {
    type: [Number, String],
    default: () => null,
  },
});
const model = ref(props.modelValue);

// const options = [
//   { label: "По цене", value: "price" },
//   { label: "По популярности", value: "popularity" },
// ];

const selectedOptions = ref([]);
</script>

<style lang="scss" scoped>
.checkbox-container {
  display: flex;
  align-items: center;
  font-size: 16px;
  cursor: pointer;
}

.checkbox-container input {
  display: none;
}

.custom-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid $blue-500;
  border-radius: 50%;
  margin-right: 8px;
  position: relative;
  background-color: $white;
  transition: all 0.3s ease;
}

.checkbox-container input:checked + .custom-checkbox::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: $blue-500;
}
</style>
