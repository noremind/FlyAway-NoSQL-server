<template>
  <div
    class="file-upload"
    :class="{
      'file-upload--dragover': isDragOver,
      'file-upload--filled': hasFiles,
    }"
  >
    <input
      ref="inputRef"
      class="file-upload__input"
      type="file"
      :multiple="props.multiple"
      :accept="props.accept"
      @change="changeFiles"
    />

    <div
      class="file-upload__dropzone"
      @dragenter.prevent="setDragState(true)"
      @dragover.prevent="setDragState(true)"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <div class="file-upload__hero">
        <span class="file-upload__badge">
          {{ props.multiple ? "Несколько файлов" : "Один файл" }}
        </span>

        <div class="file-upload__copy">
          <p class="file-upload__title">{{ props.title }}</p>
          <p class="file-upload__text">
            {{ helperText }}
          </p>
        </div>

        <div class="file-upload__actions">
          <button class="file-upload__button" type="button" @click="openPicker">
            {{ hasFiles ? "Заменить" : "Выбрать файл" }}
          </button>

          <button
            v-if="hasFiles"
            class="file-upload__ghost"
            type="button"
            @click="clearFiles"
          >
            Очистить
          </button>
        </div>
      </div>

      <div v-if="previewItems.length" class="file-upload__list">
        <article
          v-for="(item, index) in previewItems"
          :key="`${item.name}-${item.size}-${index}`"
          class="file-upload__item"
        >
          <div class="file-upload__thumb" :class="{ 'file-upload__thumb--file': !item.isImage }">
            <img
              v-if="item.isImage && item.url"
              class="file-upload__thumb-image"
              :src="item.url"
              :alt="item.name"
            />
            <span v-else class="file-upload__thumb-ext">
              {{ item.extension }}
            </span>
          </div>

          <div class="file-upload__meta">
            <p class="file-upload__name">{{ item.name }}</p>
            <p class="file-upload__size">{{ formatFileSize(item.size) }}</p>
          </div>

          <button
            class="file-upload__remove"
            type="button"
            @click="removeFile(index)"
          >
            Убрать
          </button>
        </article>
      </div>

      <div v-else class="file-upload__empty">
        <p class="file-upload__empty-title">Перетащите файл сюда</p>
        <p class="file-upload__empty-text">
          {{ emptyText }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: "Загрузите файлы",
  },
  accept: {
    type: String,
    default: "image/*",
  },
  multiple: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(["update:modelValue"])

const inputRef = ref(null)
const previewItems = ref([])
const isDragOver = ref(false)

const fileList = computed(() => props.modelValue || [])
const hasFiles = computed(() => fileList.value.length > 0)

const acceptLabel = computed(() => {
  if (!props.accept) {
    return "Любой формат"
  }

  return props.accept
    .split(",")
    .map((item) => item.trim().replace("image/", "").replace(".", "").toUpperCase())
    .filter(Boolean)
    .join(", ")
})

const helperText = computed(() => {
  if (!hasFiles.value) {
    return props.multiple
      ? `Можно выбрать несколько файлов. Поддержка: ${acceptLabel.value}`
      : `Поддержка: ${acceptLabel.value}`
  }

  return props.multiple
    ? `Выбрано файлов: ${fileList.value.length}`
    : "Файл готов к загрузке"
})

const emptyText = computed(() => {
  return props.multiple
    ? `Можно добавить сразу несколько файлов. Форматы: ${acceptLabel.value}`
    : `Поддерживаемые форматы: ${acceptLabel.value}`
})

const revokePreviewUrls = () => {
  previewItems.value.forEach((item) => {
    if (item.url) {
      URL.revokeObjectURL(item.url)
    }
  })
}

const buildPreviewItems = (files) => {
  revokePreviewUrls()

  previewItems.value = (files || [])
    .filter((file) => typeof File === "undefined" || file instanceof File)
    .map((file) => {
      const isImage = file.type?.startsWith("image/")
      const extension = file.name?.split(".").pop()?.toUpperCase() || "FILE"

      return {
        name: file.name || "Файл",
        size: Number(file.size || 0),
        extension,
        isImage,
        url: isImage ? URL.createObjectURL(file) : "",
      }
    })
}

watch(
  () => props.modelValue,
  (files) => {
    buildPreviewItems(files)
  },
  { immediate: true, deep: true },
)

onBeforeUnmount(() => {
  revokePreviewUrls()
})

const formatFileSize = (size) => {
  if (!size) {
    return "0 KB"
  }

  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }

  return `${Math.max(1, Math.round(size / 1024))} KB`
}

const setDragState = (value) => {
  isDragOver.value = value
}

const handleDragLeave = (event) => {
  if (event.currentTarget?.contains(event.relatedTarget)) {
    return
  }

  setDragState(false)
}

const normalizeFiles = (incomingFiles, append = false) => {
  const nextFiles = Array.from(incomingFiles || []).filter(Boolean)

  if (!props.multiple) {
    return nextFiles.slice(0, 1)
  }

  if (!append) {
    return nextFiles
  }

  const combined = [...fileList.value, ...nextFiles]
  const uniqueFiles = []
  const fileKeys = new Set()

  combined.forEach((file) => {
    const key = `${file.name}-${file.size}-${file.lastModified}`

    if (fileKeys.has(key)) {
      return
    }

    fileKeys.add(key)
    uniqueFiles.push(file)
  })

  return uniqueFiles
}

const updateFiles = (incomingFiles, append = false) => {
  emit("update:modelValue", normalizeFiles(incomingFiles, append))
}

const openPicker = () => {
  inputRef.value?.click()
}

const changeFiles = (event) => {
  updateFiles(event.target.files, props.multiple)

  if (event.target) {
    event.target.value = ""
  }
}

const handleDrop = (event) => {
  setDragState(false)
  updateFiles(event.dataTransfer?.files, props.multiple)
}

const removeFile = (index) => {
  const nextFiles = [...fileList.value]
  nextFiles.splice(index, 1)
  emit("update:modelValue", nextFiles)
}

const clearFiles = () => {
  emit("update:modelValue", [])
}
</script>

<style lang="scss" scoped>
.file-upload {
  width: 100%;

  &__input {
    display: none;
  }

  &__dropzone {
    min-height: 176px;
    display: grid;
    gap: 18px;
    padding: 18px;
    background:
      linear-gradient(180deg, rgba($white, 0.96) 0%, rgba($surface-150, 0.92) 100%);
    border: 1px dashed rgba($red-500, 0.3);
    border-radius: 18px;
    box-shadow: $box-shadow;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      transform 0.2s ease,
      background-color 0.2s ease;
  }

  &--dragover &__dropzone {
    border-color: $red-500;
    box-shadow: 0 18px 38px rgba($red-500, 0.12);
    transform: translateY(-1px);
    background:
      linear-gradient(180deg, rgba($red-100, 0.7) 0%, rgba($white, 0.98) 100%);
  }

  &--filled &__dropzone {
    border-style: solid;
    border-color: rgba($red-500, 0.14);
  }

  &__hero {
    display: grid;
    gap: 12px;
  }

  &__badge {
    width: fit-content;
    min-height: 28px;
    display: inline-flex;
    align-items: center;
    padding: 0 10px;
    color: $red-500;
    background: rgba($red-500, 0.08);
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  &__copy {
    display: grid;
    gap: 6px;
  }

  &__title {
    color: $surface-900;
    font-size: 17px;
    font-weight: 700;
    line-height: 1.2;
  }

  &__text,
  &__empty-text,
  &__size {
    color: $surface-500;
    font-size: 13px;
    line-height: 1.45;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  &__button,
  &__ghost,
  &__remove {
    border: 0;
    cursor: pointer;
    transition:
      transform 0.2s ease,
      background-color 0.2s ease,
      color 0.2s ease;
  }

  &__button {
    min-height: 42px;
    padding: 0 16px;
    color: $white;
    background: $red-500;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;

    &:hover {
      transform: translateY(-1px);
    }
  }

  &__ghost {
    min-height: 42px;
    padding: 0 14px;
    color: $surface-900;
    background: rgba($surface-200, 0.75);
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
  }

  &__list {
    display: grid;
    gap: 12px;
  }

  &__item {
    display: grid;
    grid-template-columns: 76px minmax(0, 1fr) auto;
    gap: 12px;
    align-items: center;
    padding: 10px;
    background: rgba($white, 0.92);
    border: 1px solid rgba($red-500, 0.08);
    border-radius: 14px;
  }

  &__thumb {
    width: 76px;
    height: 76px;
    overflow: hidden;
    border-radius: 12px;
    background: rgba($surface-150, 0.9);
    border: 1px solid rgba($surface-200, 0.8);

    &--file {
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba($surface-150, 0.95);
    }
  }

  &__thumb-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__thumb-ext {
    color: $surface-900;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
  }

  &__meta {
    min-width: 0;
    display: grid;
    gap: 4px;
  }

  &__name,
  &__empty-title {
    color: $surface-900;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.35;
  }

  &__name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__remove {
    min-height: 36px;
    padding: 0 12px;
    color: $red-500;
    background: rgba($red-500, 0.08);
    border-radius: 10px;
    font-size: 13px;
    font-weight: 700;
  }

  &__empty {
    display: grid;
    gap: 4px;
    padding: 8px 2px 0;
  }
}

@media (max-width: 700px) {
  .file-upload {
    &__dropzone {
      min-height: 156px;
      padding: 14px;
      gap: 14px;
      border-radius: 16px;
    }

    &__item {
      grid-template-columns: 60px minmax(0, 1fr);
      align-items: start;
    }

    &__thumb {
      width: 60px;
      height: 60px;
    }

    &__remove {
      grid-column: 1 / -1;
      justify-self: start;
    }
  }
}
</style>
