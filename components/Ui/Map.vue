<template>
  <div class="map-i">
    <div ref="mapContainer" class="map-i__wrapper"></div>

    <div class="map-i__meta">
      <p class="map-i__title">
        {{
          selectable
            ? "Нажмите на карту, чтобы выбрать место"
            : "Точка на карте"
        }}
      </p>

      <p v-if="loadError" class="map-i__error">
        {{ loadError }}
      </p>

      <p v-else-if="currentPoint" class="map-i__coords">
        <span><b>x:</b> {{ currentPoint.x }}</span>
        <span><b>y:</b> {{ currentPoint.y }}</span>
      </p>

      <p v-if="!loadError && currentAddress" class="map-i__address">
        <b>Адрес:</b> {{ currentAddress }}
      </p>
      <p v-else-if="!loadError && currentPoint" class="map-i__empty">
        Адрес определяется...
      </p>
      <p v-else-if="!loadError" class="map-i__empty">Точка не выбрана</p>

      <div
        v-if="selectable && currentPoint && !loadError"
        class="map-i__actions"
      >
        <button class="map-i__clear" type="button" @click="clearPoint">
          Сбросить точку
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    default: null,
  },
  x: {
    type: Number,
    default: null,
  },
  y: {
    type: Number,
    default: null,
  },
  center: {
    type: Array,
    default: () => [76.889709, 43.238949],
  },
  zoom: {
    type: Number,
    default: 15,
  },
  markerText: {
    type: String,
    default: "Выбранная точка",
  },
  selectable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const { createMap, reverseGeocode } = useYandexMaps();

const mapContainer = ref(null);
const mapInstance = shallowRef(null);
const currentPoint = ref(null);
const currentAddress = ref("");
const loadError = ref("");

let geocodeRequestId = 0;

const normalizePoint = (value) => {
  if (Array.isArray(value) && value.length >= 2) {
    const x = Number(value[0]);
    const y = Number(value[1]);

    if (Number.isFinite(x) && Number.isFinite(y)) {
      return { x, y };
    }
  }

  if (!value || typeof value !== "object") {
    return null;
  }

  const x = Number(value.x ?? value.lng ?? value.lon ?? value.longitude);
  const y = Number(value.y ?? value.lat ?? value.latitude);

  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return null;
  }

  return { x, y };
};

const pointToCoords = (point) => [point.x, point.y];

const normalizeAddress = (value) => String(value || "").trim();

const emitPoint = (point, address = currentAddress.value) => {
  if (!point) {
    emit("update:modelValue", null);
    return;
  }

  const normalizedAddress = normalizeAddress(address);

  emit("update:modelValue", {
    x: point.x,
    y: point.y,
    address: normalizedAddress,
    label: normalizedAddress,
  });
};

const getPointFromProps = () => {
  return (
    normalizePoint(props.modelValue) ||
    normalizePoint({ x: props.x, y: props.y })
  );
};

const syncMapState = ({ centerMap = false } = {}) => {
  if (!mapInstance.value) {
    return;
  }

  mapInstance.value.setMarkerText?.(props.markerText);
  mapInstance.value.setZoom?.(props.zoom);

  if (currentPoint.value) {
    mapInstance.value.setMarker?.(pointToCoords(currentPoint.value));

    if (centerMap) {
      mapInstance.value.setCenter?.(pointToCoords(currentPoint.value));
    }

    return;
  }

  mapInstance.value.clearMarker?.();
  mapInstance.value.setCenter?.(props.center);
};

const destroyMap = () => {
  if (mapInstance.value && typeof mapInstance.value.destroy === "function") {
    mapInstance.value.destroy();
  }

  mapInstance.value = null;
};

const syncFromProps = () => {
  const point = getPointFromProps();
  currentPoint.value = point;
  currentAddress.value = normalizeAddress(
    props.modelValue?.label || props.modelValue?.address || "",
  );

  syncMapState({ centerMap: Boolean(point) });
};

const resolveAddressForPoint = async (point) => {
  const requestId = ++geocodeRequestId;
  const address =
    (await reverseGeocode(pointToCoords(point), {
      kind: "house",
      results: 1,
    })) ||
    (await reverseGeocode(pointToCoords(point), {
      kind: "street",
      results: 1,
    }));

  if (requestId !== geocodeRequestId) {
    return "";
  }

  return normalizeAddress(address);
};

const handleSelect = async (coordinates) => {
  if (!Array.isArray(coordinates) || coordinates.length < 2) {
    return;
  }

  const point = {
    x: Number(coordinates[0]),
    y: Number(coordinates[1]),
  };

  currentPoint.value = point;
  currentAddress.value = "";
  emitPoint(point);

  const address = await resolveAddressForPoint(point);

  if (!address || !currentPoint.value) {
    return;
  }

  currentAddress.value = address;
  emitPoint(point, address);
};

const mountMap = async () => {
  if (!mapContainer.value || mapInstance.value) {
    return;
  }

  loadError.value = "";
  syncFromProps();

  try {
    await nextTick();

    mapInstance.value = await createMap({
      container: mapContainer.value,
      center: currentPoint.value
        ? pointToCoords(currentPoint.value)
        : props.center,
      zoom: props.zoom,
      markerCoordinates: currentPoint.value
        ? pointToCoords(currentPoint.value)
        : null,
      markerText: props.markerText,
      selectable: props.selectable,
      onSelect: handleSelect,
    });

    if (!mapInstance.value) {
      loadError.value = "Не удалось инициализировать Yandex Maps";
      return;
    }

    syncMapState({ centerMap: Boolean(currentPoint.value) });
  } catch (error) {
    loadError.value = error?.message || "Не удалось загрузить Yandex Maps";
    console.error("[UiMap]", error);
  }
};

const clearPoint = () => {
  geocodeRequestId += 1;
  currentPoint.value = null;
  currentAddress.value = "";
  emit("update:modelValue", null);
  void mountMap();
};

onMounted(async () => {
  await nextTick();
  await mountMap();
});

watch(
  () => props.modelValue,
  () => {
    syncFromProps();
  },
  { deep: true },
);

watch(
  () => [props.x, props.y],
  () => {
    syncFromProps();
  },
);

watch(
  () => props.center,
  () => {
    if (currentPoint.value) {
      return;
    }

    syncMapState();
  },
  { deep: true },
);

watch(
  () => props.zoom,
  () => {
    syncMapState();
  },
);

watch(
  () => props.markerText,
  () => {
    syncMapState();
  },
);

onBeforeUnmount(() => {
  destroyMap();
});
</script>

<style scoped lang="scss">
.map-i {
  width: 100%;

  &__wrapper {
    width: 100%;
    min-height: 360px;
    height: 300px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: $box-shadow-md;
    background: $white;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 12px;
    padding: 12px 14px;
    border-radius: 12px;
    background: rgba($red-500, 0.08);
    border: 1px solid rgba($red-500, 0.2);
    min-height: 72px;
  }

  &__title {
    font-size: 13px;
    font-weight: 700;
    color: $surface-500;
  }

  &__error {
    font-size: 14px;
    font-weight: 600;
    color: $red-500;
  }

  &__coords {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    font-size: 14px;
    color: $surface-500;
  }

  &__address,
  &__empty {
    font-size: 14px;
    color: $surface-500;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
  }

  &__clear {
    border: 0;
    background: transparent;
    color: $red-500;
    font-weight: 700;
    cursor: pointer;
    padding: 0;
  }

  @media screen and (max-width: 767px) {
    &__wrapper {
      min-height: 320px;
      height: 320px;
    }
  }
}
</style>
