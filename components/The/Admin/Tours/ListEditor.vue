<template>
  <div class="list-editor">
    <article
      v-for="(item, index) in items"
      :key="index"
      class="list-editor__item"
      :class="{ 'list-editor__item--calendar': hasCalendarField }"
    >
      <div v-if="isObjectList" class="list-editor__item-head">
        <div class="list-editor__item-copy">
          <p class="list-editor__item-kicker">{{ itemLabel(item, index) }}</p>
          <p v-if="hasCalendarField" class="list-editor__item-note">
            Даты и описание дня
          </p>
        </div>

        <button
          v-if="items.length > minItems"
          class="list-editor__remove"
          type="button"
          @click="removeItem(index)"
        >
          Удалить
        </button>
      </div>

      <div
        class="list-editor__fields"
        :class="{
          'list-editor__fields--stack': !isObjectList,
          'list-editor__fields--calendar': hasCalendarField,
        }"
      >
        <template v-if="isObjectList">
          <component
            :is="
              field.component === 'textarea'
                ? 'UiTextarea'
                : field.component === 'calendar'
                  ? 'UiCalendar'
                  : 'UiInput'
            "
            v-for="field in fields.filter((itemField) => itemField.component !== 'upload')"
            :key="field.key"
            class="list-editor__field"
            :class="{
              'list-editor__field--full': field.component === 'textarea',
              'list-editor__field--calendar': field.component === 'calendar',
            }"
            :label="field.label"
            :placeholder="field.placeholder"
            :type="field.type || 'text'"
            :rows="field.rows || 4"
            :selection-mode="field.selectionMode"
            :model-value="item?.[field.key] ?? ''"
            @update:model-value="updateObjectField(index, field.key, $event)"
          />
          <div
            v-for="field in fields.filter((itemField) => itemField.component === 'upload')"
            :key="`${field.key}-${index}-upload`"
            class="list-editor__upload"
          >
            <div v-if="item?.[field.key]" class="list-editor__upload-preview">
              <img
                class="list-editor__upload-image"
                :src="item?.[field.key]"
                :alt="field.label || 'Preview'"
              />
            </div>

            <label class="list-editor__upload-button">
              <input
                class="list-editor__upload-input"
                type="file"
                :accept="field.accept || 'image/png,image/jpeg,image/webp'"
                @change="handleUploadField(index, field, $event)"
              />
              <span>{{ field.uploadLabel || field.label || "Загрузить" }}</span>
            </label>
          </div>
        </template>

        <UiInput
          v-else
          :label="itemLabel(item, index)"
          :placeholder="placeholder"
          :model-value="item"
          @update:model-value="updateStringField(index, $event)"
        />
      </div>

      <button
        v-if="!isObjectList && items.length > minItems"
        class="list-editor__remove"
        type="button"
        @click="removeItem(index)"
      >
        Удалить
      </button>
    </article>

    <button class="list-editor__add" type="button" @click="addItem">
      {{ addLabel }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  fields: {
    type: Array,
    default: () => [],
  },
  defaultItem: {
    type: [String, Object],
    default: "",
  },
  addLabel: {
    type: String,
    default: "Добавить",
  },
  placeholder: {
    type: String,
    default: "",
  },
  itemLabelPrefix: {
    type: String,
    default: "Пункт",
  },
  minItems: {
    type: Number,
    default: 1,
  },
});

const emit = defineEmits(["remove-item", "update:modelValue"]);

const isObjectList = computed(() => props.fields.length > 0);
const hasCalendarField = computed(() =>
  props.fields.some((field) => field.component === "calendar"),
);
const items = computed(() => props.modelValue || []);

const cloneItem = () => {
  if (typeof props.defaultItem === "object" && props.defaultItem !== null) {
    return JSON.parse(JSON.stringify(props.defaultItem));
  }

  return props.defaultItem;
};

const commit = (nextItems) => {
  emit("update:modelValue", nextItems);
};

const addItem = () => {
  commit([...items.value, cloneItem()]);
};

const removeItem = (index) => {
  emit("remove-item", {
    index,
    item: items.value[index],
  });
  commit(items.value.filter((_, itemIndex) => itemIndex !== index));
};

const updateStringField = (index, value) => {
  commit(items.value.map((item, itemIndex) => (itemIndex === index ? value : item)));
};

const updateObjectField = (index, key, value) => {
  commit(
    items.value.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [key]: value } : item,
    ),
  );
};

const handleUploadField = async (index, field, event) => {
  const file = event.target.files?.[0] || null;

  if (!file) return;

  try {
    const nextValue = await field.onUpload?.(file, {
      index,
      item: items.value[index],
    });

    if (typeof nextValue === "string") {
      updateObjectField(index, field.key, nextValue);
    }
  } finally {
    event.target.value = "";
  }
};

const itemLabel = (_, index) => `${props.itemLabelPrefix} ${index + 1}`;
</script>

<style lang="scss" scoped>
.list-editor {
  display: grid;
  gap: 12px;

  &__item {
    display: grid;
    gap: 14px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba($red-500, 0.1);
    border-radius: 8px;
    box-shadow: 0 10px 22px rgba(32, 36, 38, 0.04);

    &--calendar {
      background: rgba($red-500, 0.03);
    }
  }

  &__item-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  &__item-copy {
    min-width: 0;
  }

  &__item-kicker {
    color: $surface-900;
    font-size: 14px;
    font-weight: 700;
  }

  &__item-note {
    margin-top: 4px;
    color: $surface-500;
    font-size: 12px;
    line-height: 1.4;
  }

  &__fields {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;

    &--stack {
      grid-template-columns: 1fr;
    }

    &--calendar {
      grid-template-columns: repeat(2, minmax(0, 240px)) minmax(0, 1fr);
      align-items: start;
    }
  }

  &__field {
    min-width: 0;

    &--full {
      grid-column: 1 / -1;
    }

    &--calendar {
      max-width: 240px;
    }
  }

  &__upload {
    display: grid;
    gap: 10px;
    grid-column: 1 / -1;
  }

  &__upload-preview {
    overflow: hidden;
    border-radius: 8px;
    border: 1px solid rgba($red-500, 0.08);
    background: $surface-150;
  }

  &__upload-image {
    width: 100%;
    height: 160px;
    object-fit: cover;
  }

  &__upload-button {
    width: fit-content;
    min-height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 14px;
    color: $red-500;
    border: 1px dashed rgba($red-500, 0.3);
    border-radius: 8px;
    background: rgba($red-500, 0.04);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }

  &__upload-input {
    display: none;
  }

  &__remove,
  &__add {
    width: fit-content;
    min-height: 40px;
    padding: 0 14px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
  }

  &__remove {
    color: $orange-200;
    border: 1px solid rgba($orange-200, 0.3);
    background: rgba($orange-200, 0.06);
  }

  &__add {
    color: $red-500;
    border: 1px dashed rgba($red-500, 0.3);
    background: rgba($red-500, 0.04);
  }
}

@media (max-width: 700px) {
  .list-editor {
    &__item-head {
      flex-direction: column;
    }

    &__fields {
      grid-template-columns: 1fr;

      &--calendar {
        grid-template-columns: 1fr;
      }
    }

    &__field {
      &--calendar {
        max-width: 100%;
      }
    }
  }
}
</style>
