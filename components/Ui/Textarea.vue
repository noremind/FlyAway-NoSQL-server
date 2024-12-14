<template>
  <div class="textarea">
    <div class="textarea__wrapper">
      <textarea
        :rows="rows"
        :cols="cols"
        :placeholder="placeholder"
        class="textarea__field"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  placeholder: String,
  rows: Number,
  cols: Number,
});
</script>

<style lang="scss" scoped>
.textarea {
  &__wrapper {
    border: 1px solid $surface-300;
    border-radius: 12px;
    padding: 12px;
  }
  &__field {
    width: 100%;
  }
}
</style>
