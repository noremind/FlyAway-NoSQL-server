export const useFavouritesStore = defineStore("favourites", () => {
  const userStore = useAuthStore();
  const favouriteTours = ref([]);

  const normalizeString = (value) => String(value || "").trim();

  const userKey = computed(() => {
    const user = userStore.getUser;
    return normalizeString(user?._id || user?.id);
  });

  const storageKey = computed(() => {
    return userKey.value ? `flyaway:favourites:tours:${userKey.value}` : "";
  });

  const normalizeTour = (tour) => {
    if (!tour || typeof tour !== "object") {
      return null;
    }

    const id = normalizeString(tour._id || tour.id);

    if (!id) {
      return null;
    }

    return {
      _id: id,
      title: normalizeString(tour.title || tour.name),
      name: normalizeString(tour.name || tour.title),
      description: normalizeString(tour.description || tour.preview_text),
      preview_text: normalizeString(tour.preview_text || tour.description),
      avatar: tour.avatar || tour.image || tour.images?.[0] || "",
      images: Array.isArray(tour.images) ? tour.images.filter(Boolean) : [],
      price: Number(tour.price) || 0,
      discount: Number(tour.discount) || 0,
      rating: Number(tour.rating) || 0,
      reviewsCount: Number(tour.reviewsCount || tour.review_count) || 0,
      review_count: Number(tour.review_count || tour.reviewsCount) || 0,
      is_hot: Boolean(tour.is_hot),
      createdAt: tour.createdAt || "",
      dates: Array.isArray(tour.dates) ? tour.dates : [],
      dateDetails: Array.isArray(tour.dateDetails) ? tour.dateDetails : [],
      availabilityDates: Array.isArray(tour.availabilityDates)
        ? tour.availabilityDates
        : [],
      partner: tour.partner || null,
    };
  };

  const loadFavourites = () => {
    if (!import.meta.client || !storageKey.value) {
      favouriteTours.value = [];
      return;
    }

    try {
      const rawValue = localStorage.getItem(storageKey.value);
      const parsedValue = JSON.parse(rawValue || "[]");

      favouriteTours.value = Array.isArray(parsedValue)
        ? parsedValue.map((item) => normalizeTour(item)).filter(Boolean)
        : [];
    } catch {
      favouriteTours.value = [];
    }
  };

  const persistFavourites = () => {
    if (!import.meta.client || !storageKey.value) {
      return;
    }

    localStorage.setItem(storageKey.value, JSON.stringify(favouriteTours.value));
  };

  const isFavourite = (tourId) => {
    const normalizedId = normalizeString(tourId);

    if (!normalizedId) {
      return false;
    }

    return favouriteTours.value.some((tour) => tour._id === normalizedId);
  };

  const addFavourite = (tour) => {
    const normalizedTour = normalizeTour(tour);

    if (!normalizedTour || isFavourite(normalizedTour._id)) {
      return false;
    }

    favouriteTours.value.unshift(normalizedTour);
    persistFavourites();
    return true;
  };

  const removeFavourite = (tourId) => {
    const normalizedId = normalizeString(tourId);
    const nextTours = favouriteTours.value.filter((tour) => tour._id !== normalizedId);

    if (nextTours.length === favouriteTours.value.length) {
      return false;
    }

    favouriteTours.value = nextTours;
    persistFavourites();
    return true;
  };

  const toggleFavourite = (tour) => {
    const normalizedTour = normalizeTour(tour);

    if (!normalizedTour) {
      return false;
    }

    if (isFavourite(normalizedTour._id)) {
      removeFavourite(normalizedTour._id);
      return false;
    }

    addFavourite(normalizedTour);
    return true;
  };

  watch(
    storageKey,
    () => {
      loadFavourites();
    },
    { immediate: true },
  );

  return {
    favouriteTours,
    loadFavourites,
    isFavourite,
    addFavourite,
    removeFavourite,
    toggleFavourite,
  };
});
