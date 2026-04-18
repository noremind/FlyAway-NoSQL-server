<template>
  <section class="tour-editor">
    <div v-if="isBooting" class="tour-editor__loading">Загружаем тур...</div>

    <form v-else class="tour-editor__shell" @submit.prevent="submitTour">
      <div class="tour-editor__main">
        <section class="tour-editor__card tour-editor__card--hero">
          <div class="tour-editor__hero-grid">
            <UiInput
              label="Название тура*"
              placeholder="Однодневный тур на Кольсай"
              v-model="form.title"
            />

            <UiSelect
              v-if="!isPartnerUser"
              label="Партнер*"
              placeholder="Выберите партнера"
              :options="partnerOptions"
              option-label="label"
              option-value="value"
              v-model="selectedPartnerId"
            />

            <UiInput
              label="Продолжительность"
              placeholder="2 дня и 1 ночь"
              v-model="form.duration"
            />

            <label class="tour-editor__toggle">
              <input v-model="form.is_hot" type="checkbox" />
              <span>Горящий тур</span>
            </label>
          </div>
        </section>

        <section class="tour-editor__card">
          <div class="tour-editor__section-head">
            <div>
              <h2 class="tour-editor__section-title">Галерея</h2>
              <p class="tour-editor__section-text">
                Главное изображение и галерея тура загружаются файлами.
              </p>
            </div>
          </div>

          <div class="tour-editor__gallery">
            <div class="tour-editor__cover">
              <img
                v-if="coverImage"
                class="tour-editor__cover-image"
                :src="coverImage"
                :alt="form.title || 'Тур'"
              />
              <div v-else class="tour-editor__cover-empty">Обложка тура</div>
            </div>

            <div class="tour-editor__gallery-fields">
              <div class="tour-editor__upload-box">
                <UiFileUpload
                  v-model="coverFiles"
                  title="Загрузить главное изображение"
                  accept="image/png,image/jpeg,image/webp"
                />
              </div>

              <div class="tour-editor__upload-box">
                <UiFileUpload
                  v-model="galleryFiles"
                  title="Загрузить фото тура"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                />
              </div>
            </div>
          </div>
        </section>

        <UiTabs
          class="tour-editor__tabs"
          :tabs="tabs"
          v-model="selectedTab"
          type="line"
        />

        <section v-if="selectedTab.id === 1" class="tour-editor__card">
          <div class="tour-editor__section-head">
            <div>
              <h2 class="tour-editor__section-title">О туре</h2>
              <p class="tour-editor__section-text">
                База карточки и программа.
              </p>
            </div>
          </div>

          <div class="tour-editor__stack">
            <UiTextarea
              label="Описание"
              placeholder="Коротко опишите впечатление от тура"
              v-model="form.description"
            />

            <TheAdminToursListEditor
              v-model="form.highlights"
              add-label="Добавить пункт"
              placeholder="Что ждет туриста"
              item-label-prefix="Пункт"
              :default-item="''"
            />

            <div class="tour-editor__map">
              <div class="tour-editor__section-head">
                <div>
                  <h3 class="tour-editor__section-title">Точка отправления</h3>
                  <p class="tour-editor__section-text">
                    Выберите место прямо на карте.
                  </p>
                </div>
                <button
                  class="tour-editor__ghost"
                  type="button"
                  @click="clearDepartureLocation"
                >
                  Сбросить
                </button>
              </div>

              <UiMap
                v-model="form.departureLocation"
                :selectable="true"
                :center="[76.889709, 43.238949]"
                marker-text="Точка отправления"
              />
            </div>

            <TheAdminToursListEditor
              v-model="form.dates"
              add-label="Добавить день"
              placeholder="25 декабря 2026"
              item-label-prefix="Дата"
              :default-item="{ date: null }"
              :fields="dateFields"
            />

            <TheAdminToursListEditor
              v-model="form.program"
              add-label="Добавить шаг программы"
              item-label-prefix="Шаг"
              :default-item="{ startDate: null, endDate: null, text: '' }"
              :fields="programFields"
            />
          </div>
        </section>

        <section v-else-if="selectedTab.id === 2" class="tour-editor__card">
          <div class="tour-editor__section-head">
            <div>
              <h2 class="tour-editor__section-title">Маршрут</h2>
              <p class="tour-editor__section-text">
                Точки маршрута и карта тура.
              </p>
            </div>
          </div>

          <div class="tour-editor__stack">
            <TheAdminToursListEditor
              v-model="form.routePlaces"
              add-label="Добавить точку"
              item-label-prefix="Точка"
              :default-item="{ title: '', image: '' }"
              :fields="routeFields"
            />

            <UiMediaField
              label="Карта маршрута"
              :preview="routeMapPreview"
              :has-modes="false"
            >
              <div class="tour-editor__upload-box">
                <UiFileUpload
                  v-model="routeMapFiles"
                  title="Загрузить карту маршрута"
                  accept="image/png,image/jpeg,image/webp"
                />
              </div>
            </UiMediaField>
          </div>
        </section>

        <section v-else-if="selectedTab.id === 3" class="tour-editor__card">
          <div class="tour-editor__section-head">
            <div>
              <h2 class="tour-editor__section-title">Для туристов</h2>
              <p class="tour-editor__section-text">
                Что взять, что включено и что важно.
              </p>
            </div>
          </div>

          <div class="tour-editor__stack">
            <TheAdminToursListEditor
              v-model="form.packingList"
              add-label="Добавить пункт"
              placeholder="Одежда"
              item-label-prefix="С собой"
              :default-item="''"
            />

            <TheAdminToursListEditor
              v-model="form.recommendations"
              add-label="Добавить рекомендацию"
              placeholder="Уровень сложности"
              item-label-prefix="Рекомендация"
              :default-item="''"
            />

            <div class="tour-editor__grid">
              <TheAdminToursListEditor
                v-model="form.includes"
                add-label="Добавить включенное"
                placeholder="Транспорт"
                item-label-prefix="Включено"
                :default-item="''"
              />

              <TheAdminToursListEditor
                v-model="form.excludes"
                add-label="Добавить исключение"
                placeholder="Личные расходы"
                item-label-prefix="Не включено"
                :default-item="''"
              />
            </div>
          </div>
        </section>

        <section v-else class="tour-editor__card">
          <div class="tour-editor__section-head">
            <div>
              <h2 class="tour-editor__section-title">Контакты</h2>
              <p class="tour-editor__section-text">
                Контакты для карточки тура.
              </p>
            </div>

            <button
              class="tour-editor__ghost"
              type="button"
              @click="fillPartnerContacts"
            >
              Взять из партнера
            </button>
          </div>

          <div class="tour-editor__grid">
            <UiInput
              label="Website"
              placeholder="https://..."
              v-model="form.contacts.website"
            />
            <UiInput
              label="Телефон"
              placeholder="+7 777 000 00 00"
              v-model="form.contacts.phone"
            />
            <UiInput
              label="Instagram"
              placeholder="@flyaway"
              v-model="form.contacts.instagram"
            />
            <UiInput
              label="Адрес"
              placeholder="Алматы, Абая 10"
              v-model="form.contacts.address"
            />
          </div>
        </section>

        <p v-if="message" class="tour-editor__message">{{ message }}</p>
      </div>

      <aside class="tour-editor__side">
        <section class="tour-editor__card tour-editor__card--sticky">
          <div class="tour-editor__summary">
            <div class="tour-editor__summary-head">
              <div class="tour-editor__summary-brand">
                <img
                  v-if="
                    selectedPartnerData?.logo || selectedPartnerData?.avatar
                  "
                  class="tour-editor__summary-avatar"
                  :src="
                    selectedPartnerData?.logo || selectedPartnerData?.avatar
                  "
                  :alt="selectedPartnerData?.title || 'Партнер'"
                />
                <span
                  v-else
                  class="tour-editor__summary-avatar tour-editor__summary-avatar--empty"
                >
                  {{
                    selectedPartnerData?.title?.charAt(0)?.toUpperCase() || "P"
                  }}
                </span>
                <div>
                  <p class="tour-editor__summary-partner">
                    {{ selectedPartnerData?.title || "Партнер" }}
                  </p>
                  <h2 class="tour-editor__summary-title">
                    {{ form.title || "Новый тур" }}
                  </h2>
                </div>
              </div>

              <span
                v-if="Number(form.discount) > 0"
                class="tour-editor__summary-badge"
              >
                -{{ Number(form.discount) }}%
              </span>
            </div>

            <div class="tour-editor__summary-preview">
              <img
                v-if="coverImage"
                class="tour-editor__summary-image"
                :src="coverImage"
                :alt="form.title || 'Тур'"
              />
              <div v-else class="tour-editor__summary-empty">Превью</div>
            </div>

            <div class="tour-editor__summary-stats">
              <div class="tour-editor__summary-stat">
                <span>Фото</span>
                <strong>{{ imageCount }}</strong>
              </div>
              <div class="tour-editor__summary-stat">
                <span>Маршрут</span>
                <strong>{{ routeCount }}</strong>
              </div>
              <div class="tour-editor__summary-stat">
                <span>Билеты</span>
                <strong>{{ ticketCount }}</strong>
              </div>
            </div>

            <div class="tour-editor__grid">
              <UiInput
                label="Цена"
                type="number"
                placeholder="45000"
                v-model="form.price"
              />
              <UiInput
                label="Скидка"
                type="number"
                placeholder="20"
                v-model="form.discount"
              />
            </div>

            <div class="tour-editor__result">
              <span>Итоговая цена</span>
              <strong>{{ discountedPrice.toLocaleString("ru-RU") }} ₸</strong>
            </div>
          </div>

          <div class="tour-editor__tickets">
            <div class="tour-editor__section-head">
              <div>
                <h3 class="tour-editor__section-title">Билеты</h3>
                <p class="tour-editor__section-text">
                  Правая колонка карточки.
                </p>
              </div>
            </div>

            <TheAdminToursListEditor
              v-model="form.ticketTypes"
              add-label="Добавить билет"
              item-label-prefix="Билет"
              :default-item="{ title: '', subtitle: '', price: '' }"
              :fields="ticketFields"
            />
          </div>

          <button
            class="tour-editor__submit"
            type="submit"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? "Сохраняем..." : submitLabel }}
          </button>
        </section>
      </aside>
    </form>
  </section>
</template>

<script setup>
const props = defineProps({
  mode: {
    type: String,
    default: "create",
  },
  tourId: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["saved"]);

const userStore = useAuthStore();
const router = useRouter();
const api = useApi();
const { uploadFiles } = useBlobFiles();

const tabs = [
  { id: 1, name: "О туре" },
  { id: 2, name: "Маршрут" },
  { id: 3, name: "Для туристов" },
  { id: 4, name: "Контакты" },
];

const dateFields = [
  {
    key: "date",
    label: "Дата",
    component: "calendar",
    placeholder: "Выберите дату",
  },
];

const programFields = [
  {
    key: "startDate",
    label: "Дата от",
    component: "calendar",
    placeholder: "Выберите дату начала",
  },
  {
    key: "endDate",
    label: "Дата до",
    component: "calendar",
    placeholder: "Выберите дату окончания",
  },
  { key: "text", label: "Описание", placeholder: "Сбор на месте отправления" },
];

const routeFields = [
  { key: "title", label: "Название", placeholder: "Озеро Кольсай" },
  {
    key: "image",
    label: "Изображение",
    component: "upload",
    uploadLabel: "Загрузить фото",
    accept: "image/png,image/jpeg,image/webp",
    onUpload: async (file) => {
      const entityId = props.tourId || selectedPartnerId.value || "draft";
      const [uploaded] = await uploadFiles({
        files: [file],
        bucket: "tours",
        entityId,
        scope: "route-place",
      });

      return uploaded?.url || "";
    },
  },
];

const ticketFields = [
  { key: "title", label: "Название", placeholder: "Взрослый 23+" },
  { key: "subtitle", label: "Подпись", placeholder: "от 23 лет" },
  { key: "price", label: "Цена", placeholder: "15000", type: "number" },
];

const createFormState = () => ({
  title: "",
  description: "",
  avatar: "",
  images: [""],
  duration: "",
  price: "",
  discount: "",
  is_hot: true,
  highlights: [""],
  dates: [{ date: null }],
  departureCity: "",
  departurePoint: "",
  departureLocation: null,
  program: [{ startDate: null, endDate: null, text: "" }],
  routePlaces: [{ title: "", image: "" }],
  routeMapImage: "",
  packingList: [""],
  recommendations: [""],
  includes: [""],
  excludes: [""],
  ticketTypes: [
    { title: "Взрослый 23+", subtitle: "", price: "" },
    { title: "Детский 7-13", subtitle: "", price: "" },
  ],
  contacts: {
    website: "",
    phone: "",
    instagram: "",
    address: "",
  },
});

const ensureStringList = (value) => {
  return Array.isArray(value) && value.length ? value : [""];
};

const ensureObjectList = (value, fallback) => {
  return Array.isArray(value) && value.length ? value : [fallback];
};

const normalizeStringArray = (value) => {
  return (value || []).map((item) => String(item || "").trim()).filter(Boolean);
};

const normalizeObjectArray = (value, keys) => {
  return (value || [])
    .map((item) =>
      keys.reduce((acc, key) => {
        acc[key] = String(item?.[key] ?? "").trim();
        return acc;
      }, {}),
    )
    .filter((item) => keys.some((key) => item[key]));
};

const parseCalendarDate = (value) => {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const text = String(value || "").trim();
  if (!text) return null;

  if (text.includes(".")) {
    const [day, month, yearRaw] = text.split(".");
    if (!day || !month || !yearRaw) return null;

    const year = String(yearRaw || "");
    const normalizedYear = year.length === 2 ? `20${year}` : year;
    const date = new Date(`${normalizedYear}-${month}-${day}`);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  const fallbackDate = new Date(text);
  return Number.isNaN(fallbackDate.getTime()) ? null : fallbackDate;
};

const formatCalendarDate = (value) => {
  if (!value) return "";

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("ru-RU");
};

const parseProgramPeriod = (value) => {
  if (!value || typeof value !== "string") {
    return {
      startDate: null,
      endDate: null,
    };
  }

  const [startText, endText] = value
    .split(" - ")
    .map((item) => String(item || "").trim());

  if (!startText && !endText) {
    return {
      startDate: null,
      endDate: null,
    };
  }

  return {
    startDate: parseCalendarDate(startText),
    endDate: parseCalendarDate(endText),
  };
};

const normalizeDateItems = (value) => {
  return (value || [])
    .map((item) => {
      const date = formatCalendarDate(item?.date);

      if (!date) {
        return null;
      }

      return { date };
    })
    .filter(Boolean);
};

const normalizeProgramItems = (value) => {
  return (value || [])
    .map((item) => {
      const startDate = formatCalendarDate(item?.startDate);
      const endDate = formatCalendarDate(item?.endDate);
      const text = String(item?.text ?? "").trim();
      const normalizedTime = [startDate, endDate].filter(Boolean).join(" - ");

      if (!normalizedTime && !text) {
        return null;
      }

      return {
        time: normalizedTime,
        text,
      };
    })
    .filter(Boolean);
};

const form = reactive(createFormState());
const selectedTab = ref(tabs[0]);
const selectedPartnerId = ref("");
const partners = ref([]);
const message = ref("");
const isSubmitting = ref(false);
const isBooting = ref(props.mode === "edit");
const coverFiles = ref([]);
const galleryFiles = ref([]);
const routeMapFiles = ref([]);
const localCoverPreview = ref("");
const localRouteMapPreview = ref("");

const isPartnerUser = computed(() => userStore.getUser?.role === "partner");

const partnerOptions = computed(() =>
  partners.value.map((partner) => ({
    label: partner.title,
    value: partner._id,
  })),
);

const selectedPartnerData = computed(() => {
  return (
    partners.value.find((partner) => partner._id === selectedPartnerId.value) ||
    null
  );
});

const buildLocalPreview = (file) => {
  if (typeof File === "undefined" || !(file instanceof File)) {
    return "";
  }

  if (!file.type?.startsWith("image/")) {
    return "";
  }

  return URL.createObjectURL(file);
};

const revokeLocalPreview = (previewRef) => {
  if (!previewRef.value) {
    return;
  }

  URL.revokeObjectURL(previewRef.value);
  previewRef.value = "";
};

const coverImage = computed(() => {
  return (
    localCoverPreview.value ||
    form.avatar ||
    form.images.find((item) => item) ||
    ""
  );
});

const routeMapPreview = computed(() => {
  return localRouteMapPreview.value || form.routeMapImage || "";
});

const discountedPrice = computed(() => {
  const price = Number(form.price) || 0;
  const discount = Number(form.discount) || 0;
  const total = price - (price * discount) / 100;
  return total > 0 ? total : price;
});

const imageCount = computed(() => {
  const list = new Set([form.avatar, ...form.images].filter(Boolean));
  return list.size;
});

const routeCount = computed(() => {
  return form.routePlaces.filter((item) => item?.title || item?.image).length;
});

const ticketCount = computed(() => {
  return form.ticketTypes.filter((item) => item?.title || item?.price).length;
});

const applyFormState = (tour) => {
  Object.assign(form, createFormState(), {
    title: tour?.title || "",
    description: tour?.description || "",
    avatar: tour?.avatar || "",
    images: ensureStringList(tour?.images),
    duration: tour?.duration || "",
    price: tour?.price?.toString?.() || "",
    discount: tour?.discount?.toString?.() || "",
    is_hot: Boolean(tour?.is_hot),
    highlights: ensureStringList(tour?.highlights),
    dates: ensureStringList(tour?.dates).map((date) => ({
      date: parseCalendarDate(date),
    })),
    departureCity: tour?.departureCity || "",
    departurePoint: tour?.departurePoint || "",
    departureLocation: tour?.departureLocation || null,
    program: ensureObjectList(tour?.program, {
      startDate: null,
      endDate: null,
      text: "",
    }).map((item) => ({
      ...item,
      ...parseProgramPeriod(item.time),
    })),
    routePlaces: ensureObjectList(tour?.routePlaces, { title: "", image: "" }),
    routeMapImage: tour?.routeMapImage || "",
    packingList: ensureStringList(tour?.packingList),
    recommendations: ensureStringList(tour?.recommendations),
    includes: ensureStringList(tour?.includes),
    excludes: ensureStringList(tour?.excludes),
    ticketTypes: ensureObjectList(tour?.ticketTypes, {
      title: "",
      subtitle: "",
      price: "",
    }).map((item) => ({
      title: item.title || "",
      subtitle: item.subtitle || "",
      price: item.price?.toString?.() || "",
    })),
    contacts: {
      website: tour?.contacts?.website || "",
      phone: tour?.contacts?.phone || "",
      instagram: tour?.contacts?.instagram || "",
      address: tour?.contacts?.address || "",
    },
  });
};

const buildPayload = () => ({
  title: form.title.trim(),
  description: form.description.trim(),
  avatar: form.avatar.trim(),
  images: normalizeStringArray(form.images),
  duration: form.duration.trim(),
  price: Number(form.price) || 0,
  discount: Number(form.discount) || 0,
  is_hot: Boolean(form.is_hot),
  highlights: normalizeStringArray(form.highlights),
  dates: normalizeDateItems(form.dates).map((item) => item.date),
  departureCity: form.departureCity.trim(),
  departurePoint: form.departurePoint.trim(),
  departureLocation: form.departureLocation,
  program: normalizeProgramItems(form.program),
  routePlaces: normalizeObjectArray(form.routePlaces, ["title", "image"]),
  routeMapImage: form.routeMapImage.trim(),
  packingList: normalizeStringArray(form.packingList),
  recommendations: normalizeStringArray(form.recommendations),
  includes: normalizeStringArray(form.includes),
  excludes: normalizeStringArray(form.excludes),
  ticketTypes: normalizeObjectArray(form.ticketTypes, [
    "title",
    "subtitle",
    "price",
  ]).map((item) => ({
    ...item,
    price: Number(item.price) || 0,
  })),
  contacts: {
    website: form.contacts.website.trim(),
    phone: form.contacts.phone.trim(),
    instagram: form.contacts.instagram.trim(),
    address: form.contacts.address.trim(),
  },
  partner: selectedPartnerId.value,
});

const fillPartnerContacts = () => {
  const contacts = selectedPartnerData.value?.contacts;

  if (!contacts) return;

  form.contacts.website = contacts.website || form.contacts.website;
  form.contacts.phone = contacts.phone || form.contacts.phone;
  form.contacts.address = contacts.address || form.contacts.address;
};

const clearDepartureLocation = () => {
  form.departureLocation = null;
};

watch(
  coverFiles,
  (files) => {
    revokeLocalPreview(localCoverPreview);
    localCoverPreview.value = buildLocalPreview(files?.[0]);
  },
  { deep: true },
);

watch(
  routeMapFiles,
  (files) => {
    revokeLocalPreview(localRouteMapPreview);
    localRouteMapPreview.value = buildLocalPreview(files?.[0]);
  },
  { deep: true },
);

const uploadPendingMedia = async () => {
  const entityId = props.tourId || selectedPartnerId.value || "draft";

  const coverUploads = coverFiles.value.length
    ? await uploadFiles({
        files: coverFiles.value,
        bucket: "tours",
        entityId,
        scope: "cover",
      })
    : [];

  const galleryUploads = galleryFiles.value.length
    ? await uploadFiles({
        files: galleryFiles.value,
        bucket: "tours",
        entityId,
        scope: "gallery",
      })
    : [];

  const coverUrl = coverUploads.map((item) => item.url).find(Boolean) || "";
  const galleryUrls = galleryUploads.map((item) => item.url).filter(Boolean);
  const routeMapUpload = routeMapFiles.value.length
    ? await uploadFiles({
        files: routeMapFiles.value,
        bucket: "tours",
        entityId,
        scope: "route-map",
      })
    : [];
  const routeMapUrl =
    routeMapUpload.map((item) => item.url).find(Boolean) || "";

  return {
    coverUrl,
    galleryUrls,
    routeMapUrl,
  };
};

const loadPartners = async () => {
  if (isPartnerUser.value) {
    const response = await api.client({ url: "/partners/me" });
    const currentPartner = response.data;
    partners.value = currentPartner ? [currentPartner] : [];
    selectedPartnerId.value = currentPartner?._id || "";
    return;
  }

  const response = await api.client({ url: "/partners" });
  partners.value = response.data || [];
};

const loadTour = async () => {
  if (!props.tourId) return;

  const response = await api.client({ url: `/tours/${props.tourId}` });
  const tour = response.data;

  applyFormState(tour);
  selectedPartnerId.value = tour?.partner?._id || tour?.partner || "";
};

const submitLabel = computed(() =>
  props.mode === "edit" ? "Сохранить изменения" : "Создать тур",
);

const submitTour = async () => {
  message.value = "";

  if (!form.title.trim()) {
    message.value = "Укажите название тура";
    return;
  }

  if (!selectedPartnerId.value) {
    message.value = "Выберите партнера";
    return;
  }

  isSubmitting.value = true;

  try {
    const { coverUrl, galleryUrls, routeMapUrl } = await uploadPendingMedia();
    const payload = buildPayload();

    const mergedImages = [
      ...normalizeStringArray(form.images),
      ...(coverUrl ? [coverUrl] : []),
      ...galleryUrls,
    ];

    payload.images = Array.from(new Set(mergedImages));

    if (coverUrl) {
      payload.avatar = coverUrl;
    } else if (!payload.avatar && payload.images[0]) {
      payload.avatar = payload.images[0];
    }

    if (routeMapUrl) {
      payload.routeMapImage = routeMapUrl;
    }

    const response =
      props.mode === "edit"
        ? await api.client({
            url: `/tours/${props.tourId}`,
            method: "patch",
            data: payload,
          })
        : await api.client({
            url: "/tours/create",
            method: "post",
            data: payload,
          });

    emit("saved", response.data);
    coverFiles.value = [];
    galleryFiles.value = [];
    routeMapFiles.value = [];
    revokeLocalPreview(localCoverPreview);
    revokeLocalPreview(localRouteMapPreview);

    if (props.mode === "create" && response.data?._id) {
      await router.push(`/admin/tours/${response.data._id}`);
      return;
    }

    message.value = "Тур сохранен";
  } catch (error) {
    message.value = error?.message || "Не удалось сохранить тур";
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  try {
    await loadPartners();

    if (props.mode === "edit") {
      await loadTour();
    } else if (isPartnerUser.value) {
      fillPartnerContacts();
    }
  } catch (error) {
    message.value = error?.message || "Не удалось загрузить форму тура";
  } finally {
    isBooting.value = false;
  }
});

onBeforeUnmount(() => {
  revokeLocalPreview(localCoverPreview);
  revokeLocalPreview(localRouteMapPreview);
});
</script>

<style lang="scss" scoped>
.tour-editor {
  &__loading {
    min-height: 260px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $surface-500;
    font-size: 15px;
    font-weight: 600;
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba($red-500, 0.1);
    border-radius: 8px;
  }

  &__shell {
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.65fr);
    gap: 20px;
    align-items: start;
  }

  &__main,
  &__side {
    display: grid;
    gap: 18px;
  }

  &__card {
    display: grid;
    gap: 18px;
    padding: 22px;
    background: rgba(255, 255, 255, 0.94);
    border: 1px solid rgba($red-500, 0.1);
    border-radius: 8px;
    box-shadow: 0 20px 48px rgba(32, 36, 38, 0.06);

    &--hero {
      gap: 14px;
    }

    &--sticky {
      position: sticky;
      top: 100px;
    }
  }

  &__hero-grid,
  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  &__toggle {
    min-height: 48px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 0 14px;
    background: rgba($red-500, 0.04);
    border: 1px solid rgba($red-500, 0.12);
    border-radius: 8px;
    color: $surface-900;
    font-size: 14px;
    font-weight: 600;

    input {
      accent-color: $red-500;
    }
  }

  &__gallery {
    display: grid;
    grid-template-columns: minmax(280px, 0.82fr) minmax(0, 1fr);
    gap: 18px;
    align-items: start;
  }

  &__cover,
  &__summary-preview {
    min-height: 260px;
    overflow: hidden;
    border-radius: 8px;
    background: $surface-150;
    border: 1px solid rgba($red-500, 0.08);
  }

  &__cover-image,
  &__summary-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__cover-empty,
  &__summary-empty {
    min-height: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $surface-400;
    font-size: 14px;
    font-weight: 600;
  }

  &__gallery-fields,
  &__stack,
  &__tickets {
    display: grid;
    gap: 14px;
  }

  &__upload-box {
    display: grid;
    gap: 10px;
  }

  &__map {
    display: grid;
    gap: 12px;
    width: 100%;
  }

  &__section-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }

  &__section-title {
    color: $surface-900;
    font-size: 18px;
    font-weight: 700;
  }

  &__section-text {
    margin-top: 4px;
    color: $surface-500;
    font-size: 13px;
    line-height: 1.45;
  }

  &__ghost {
    min-height: 38px;
    padding: 0 12px;
    color: $red-500;
    background: rgba($red-500, 0.06);
    border: 1px solid rgba($red-500, 0.12);
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
  }

  &__summary {
    display: grid;
    gap: 16px;
  }

  &__summary-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  &__summary-brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__summary-avatar {
    width: 40px;
    height: 40px;
    flex: 0 0 40px;
    border-radius: 50%;
    object-fit: cover;

    &--empty {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: $white;
      background: $red-500;
      font-size: 14px;
      font-weight: 700;
    }
  }

  &__summary-partner {
    color: $surface-500;
    font-size: 13px;
    font-weight: 600;
  }

  &__summary-title {
    margin-top: 4px;
    color: $surface-900;
    font-size: 20px;
    font-weight: 700;
    line-height: 1.2;
  }

  &__summary-badge {
    min-height: 28px;
    display: inline-flex;
    align-items: center;
    padding: 0 10px;
    color: $white;
    background: $red-500;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 700;
  }

  &__summary-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }

  &__summary-stat {
    display: grid;
    gap: 4px;
    padding: 12px;
    background: rgba($red-500, 0.04);
    border-radius: 8px;

    span {
      color: $surface-500;
      font-size: 12px;
      font-weight: 600;
    }

    strong {
      color: $surface-900;
      font-size: 18px;
      font-weight: 700;
    }
  }

  &__result {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 14px 16px;
    color: $surface-900;
    background: rgba($red-500, 0.05);
    border-radius: 8px;

    span {
      font-size: 14px;
      font-weight: 600;
    }

    strong {
      color: $red-500;
      font-size: 20px;
      font-weight: 700;
    }
  }

  &__tabs {
    width: fit-content;
  }

  &__submit {
    width: 100%;
    min-height: 48px;
    color: $white;
    background: $red-500;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 700;
    transition: background-color 0.2s ease;

    &:hover {
      background: $red-400;
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  &__message {
    color: $red-500;
    font-size: 14px;
    font-weight: 600;
  }
}

@media (max-width: 1180px) {
  .tour-editor {
    &__shell,
    &__gallery {
      grid-template-columns: 1fr;
    }

    &__card--sticky {
      position: static;
    }
  }
}

@media (max-width: 700px) {
  .tour-editor {
    &__card {
      padding: 18px;
    }

    &__hero-grid,
    &__grid,
    &__summary-stats {
      grid-template-columns: 1fr;
    }

    &__tabs {
      width: 100%;
      overflow-x: auto;
    }

    &__gallery {
      gap: 14px;
    }

    &__cover,
    &__summary-preview {
      min-height: 180px;
    }

    &__cover-empty,
    &__summary-empty {
      min-height: 180px;
    }
  }
}
</style>
