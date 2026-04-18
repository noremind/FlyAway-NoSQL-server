<template>
  <section class="admin-banners">
    <TheAdminCommonPageHeader
      title="Баннеры"
      description="Плакаты hero и промо-блоки для главной."
    />

    <div class="admin-banners__grid">
      <section class="admin-banners__panel">
        <div class="admin-banners__head">
          <div>
            <h2 class="admin-banners__title">Плакаты главной</h2>
            <p class="admin-banners__text">Верхний hero-слайдер.</p>
          </div>
        </div>

        <div class="admin-banners__stack">
          <UiInput label="Заголовок" v-model="posterForm.title" />
          <UiTextarea label="Описание" v-model="posterForm.description" :rows="3" />
          <UiInput label="Ссылка" placeholder="/tours/..." v-model="posterForm.link" />
          <UiInput
            label="Текст кнопки"
            placeholder="Подробнее"
            v-model="posterForm.buttonText"
          />

          <div class="admin-banners__upload">
            <UiFileUpload
              v-model="posterFiles"
              title="Загрузить"
              accept="image/png,image/jpeg,image/webp"
            />
            <button
              class="admin-banners__ghost"
              type="button"
              :disabled="isUploadingPoster || !posterFiles.length"
              @click="uploadPosterImage"
            >
              {{ isUploadingPoster ? "Загружаем..." : "Загрузить" }}
            </button>
          </div>

          <img
            v-if="posterForm.image"
            class="admin-banners__preview"
            :src="posterForm.image"
            alt="Плакат"
          />

          <button class="admin-banners__submit" type="button" @click="createPoster">
            Создать плакат
          </button>
        </div>

        <div class="admin-banners__list">
          <article
            v-for="poster in posters"
            :key="poster._id"
            class="admin-banners__item"
          >
            <img class="admin-banners__item-image" :src="poster.image" :alt="poster.title" />
            <div class="admin-banners__item-body">
              <strong>{{ poster.title }}</strong>
              <p>{{ poster.description || poster.link }}</p>
            </div>
            <button
              class="admin-banners__remove"
              type="button"
              @click="removePoster(poster)"
            >
              Удалить
            </button>
          </article>
        </div>
      </section>

      <section class="admin-banners__panel">
        <div class="admin-banners__head">
          <div>
            <h2 class="admin-banners__title">Промо-баннеры</h2>
            <p class="admin-banners__text">Слайдер с карточками ниже туров.</p>
          </div>
        </div>

        <div class="admin-banners__stack">
          <UiInput label="Название" v-model="promoForm.title" />
          <UiSelect
            label="Тип"
            :options="promoTypes"
            option-label="label"
            option-value="value"
            v-model="promoForm.type"
          />

          <UiSelect
            v-if="promoForm.type === 'our_tour'"
            label="Тур"
            :options="tourOptions"
            option-label="label"
            option-value="value"
            v-model="promoForm.link"
          />
          <UiSelect
            v-else-if="promoForm.type === 'our_hotel'"
            label="Отель"
            :options="hotelOptions"
            option-label="label"
            option-value="value"
            v-model="promoForm.link"
          />
          <UiInput
            v-else
            label="Ссылка"
            placeholder="https://..."
            v-model="promoForm.link"
          />

          <div class="admin-banners__upload">
            <UiFileUpload
              v-model="promoFiles"
              title="Загрузить"
              accept="image/png,image/jpeg,image/webp"
            />
            <button
              class="admin-banners__ghost"
              type="button"
              :disabled="isUploadingPromo || !promoFiles.length"
              @click="uploadPromoImage"
            >
              {{ isUploadingPromo ? "Загружаем..." : "Загрузить" }}
            </button>
          </div>

          <img
            v-if="promoForm.image"
            class="admin-banners__preview"
            :src="promoForm.image"
            alt="Баннер"
          />

          <button class="admin-banners__submit" type="button" @click="createPromo">
            Создать баннер
          </button>
        </div>

        <div class="admin-banners__list">
          <article
            v-for="promo in promos"
            :key="promo._id"
            class="admin-banners__item"
          >
            <img class="admin-banners__item-image" :src="promo.image" :alt="promo.title" />
            <div class="admin-banners__item-body">
              <strong>{{ promo.title }}</strong>
              <p>{{ promo.type }}</p>
            </div>
            <button
              class="admin-banners__remove"
              type="button"
              @click="removePromo(promo)"
            >
              Удалить
            </button>
          </article>
        </div>
      </section>
    </div>

    <p v-if="message" class="admin-banners__message">{{ message }}</p>
  </section>
</template>

<script setup>
definePageMeta({
  layout: "admin",
  middleware: "admin",
});

useSeo({
  title: "Баннеры",
  description: "Управление баннерами и плакатами главной страницы FlyAway.",
});

const api = useApi();
const { uploadFiles } = useBlobFiles();

const posterFiles = ref([]);
const promoFiles = ref([]);
const isUploadingPoster = ref(false);
const isUploadingPromo = ref(false);
const message = ref("");
const posters = ref([]);
const promos = ref([]);
const tours = ref([]);
const hotels = ref([]);

const posterForm = reactive({
  title: "",
  description: "",
  link: "/",
  buttonText: "Подробнее",
  image: "",
});

const promoForm = reactive({
  title: "",
  type: "our_tour",
  link: "",
  image: "",
});

const promoTypes = [
  { label: "Тур", value: "our_tour" },
  { label: "Отель", value: "our_hotel" },
  { label: "Партнер", value: "our_partner" },
  { label: "Ссылка", value: "another" },
];

const tourOptions = computed(() =>
  tours.value.map((tour) => ({
    label: tour.title,
    value: tour._id,
  })),
);

const hotelOptions = computed(() =>
  hotels.value.map((hotel) => ({
    label: hotel.name,
    value: hotel._id,
  })),
);

const resetPosterForm = () => {
  posterForm.title = "";
  posterForm.description = "";
  posterForm.link = "/";
  posterForm.buttonText = "Подробнее";
  posterForm.image = "";
  posterFiles.value = [];
};

const resetPromoForm = () => {
  promoForm.title = "";
  promoForm.type = "our_tour";
  promoForm.link = "";
  promoForm.image = "";
  promoFiles.value = [];
};

const loadData = async () => {
  const [posterRes, promoRes, tourRes, hotelRes] = await Promise.all([
    api.client({ url: "/banners" }),
    api.client({ url: "/ads" }),
    api.client({ url: "/tours" }),
    api.client({ url: "/hotels" }),
  ]);

  posters.value = posterRes.data || [];
  promos.value = promoRes.data || [];
  tours.value = tourRes.data || [];
  hotels.value = hotelRes.data || [];
};

const uploadPosterImage = async () => {
  isUploadingPoster.value = true;

  try {
    const [uploaded] = await uploadFiles({
      files: posterFiles.value,
      bucket: "posters",
      entityId: "main",
      scope: "hero",
    });
    posterForm.image = uploaded?.url || "";
  } finally {
    isUploadingPoster.value = false;
  }
};

const uploadPromoImage = async () => {
  isUploadingPromo.value = true;

  try {
    const [uploaded] = await uploadFiles({
      files: promoFiles.value,
      bucket: "banners",
      entityId: "main",
      scope: "promo",
    });
    promoForm.image = uploaded?.url || "";
  } finally {
    isUploadingPromo.value = false;
  }
};

const createPoster = async () => {
  if (!posterForm.title || !posterForm.image) return;

  await api.client({
    url: "/banners/create",
    method: "post",
    data: posterForm,
  });

  message.value = "Плакат добавлен";
  resetPosterForm();
  await loadData();
};

const createPromo = async () => {
  if (!promoForm.title || !promoForm.image || !promoForm.link) return;

  await api.client({
    url: "/ads/create",
    method: "post",
    data: promoForm,
  });

  message.value = "Баннер добавлен";
  resetPromoForm();
  await loadData();
};

const removePoster = async (poster) => {
  await api.client({
    url: `/banners/${poster._id}`,
    method: "delete",
  });
  await loadData();
};

const removePromo = async (promo) => {
  await api.client({
    url: `/ads/${promo._id}`,
    method: "delete",
  });
  await loadData();
};

onMounted(loadData);
</script>

<style lang="scss" scoped>
.admin-banners {
  display: grid;
  gap: 20px;

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }

  &__panel {
    display: grid;
    gap: 18px;
    padding: 22px;
    background: rgba(255, 255, 255, 0.94);
    border: 1px solid rgba($red-500, 0.1);
    border-radius: 12px;
    box-shadow: 0 18px 42px rgba(32, 36, 38, 0.08);
  }

  &__stack,
  &__list {
    display: grid;
    gap: 14px;
  }

  &__title {
    color: $surface-900;
    font-size: 18px;
    font-weight: 700;
  }

  &__text {
    margin-top: 4px;
    color: $surface-500;
    font-size: 13px;
  }

  &__upload {
    display: grid;
    gap: 10px;
  }

  &__ghost,
  &__submit,
  &__remove {
    width: fit-content;
    min-height: 40px;
    padding: 0 14px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 700;
  }

  &__ghost {
    color: $red-500;
    background: rgba($red-500, 0.06);
    border: 1px solid rgba($red-500, 0.14);
  }

  &__submit {
    color: $white;
    background: $red-500;
  }

  &__remove {
    color: $orange-200;
    background: rgba($orange-200, 0.08);
    border: 1px solid rgba($orange-200, 0.2);
  }

  &__preview,
  &__item-image {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 12px;
  }

  &__item {
    display: grid;
    gap: 12px;
    padding: 14px;
    background: rgba($red-500, 0.03);
    border-radius: 12px;
  }

  &__item-body {
    display: grid;
    gap: 4px;

    strong {
      color: $surface-900;
      font-size: 15px;
      font-weight: 700;
    }

    p {
      color: $surface-500;
      font-size: 13px;
      line-height: 1.45;
    }
  }

  &__message {
    color: $green-400;
    font-size: 14px;
    font-weight: 600;
  }
}

@media (max-width: 900px) {
  .admin-banners {
    &__grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
