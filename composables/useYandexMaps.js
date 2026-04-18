let yandexMapsLoadPromise = null

const getYandexMapsSrc = (apiKey) =>
	`https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(apiKey)}&lang=ru_RU`

const normalizeAddress = (value) => String(value || "").trim()

const toYandexCoords = (coordinates) => {
	if (!Array.isArray(coordinates) || coordinates.length < 2) {
		return null
	}

	const x = Number(coordinates[0])
	const y = Number(coordinates[1])

	if (!Number.isFinite(x) || !Number.isFinite(y)) {
		return null
	}

	// The app stores coordinates as [longitude, latitude],
	// while Yandex Maps 2.1 expects [latitude, longitude].
	return [y, x]
}

const fromYandexCoords = (coordinates) => {
	if (!Array.isArray(coordinates) || coordinates.length < 2) {
		return null
	}

	const latitude = Number(coordinates[0])
	const longitude = Number(coordinates[1])

	if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
		return null
	}

	return [longitude, latitude]
}

const readGeoObjectAddress = (geoObject) => {
	if (!geoObject?.properties?.get) {
		return ""
	}

	const text = normalizeAddress(geoObject.properties.get("text"))
	const name = normalizeAddress(geoObject.properties.get("name"))
	const description = normalizeAddress(geoObject.properties.get("description"))

	return text || [description, name].filter(Boolean).join(", ") || name || description
}

export const useYandexMaps = () => {
	const config = useRuntimeConfig()
	const apiKey = String(config.public?.yandexMapsApiKey || "").trim()

	const load = async () => {
		if (import.meta.server) {
			return null
		}

		if (!apiKey) {
			throw new Error("Не найден `NUXT_PUBLIC_YANDEX_MAPS_API_KEY` для Yandex Maps.")
		}

		if (window.ymaps?.ready) {
			return new Promise((resolve) => {
				window.ymaps.ready(() => resolve(window.ymaps))
			})
		}

		if (yandexMapsLoadPromise) {
			return yandexMapsLoadPromise
		}

		yandexMapsLoadPromise = new Promise((resolve, reject) => {
			const existingScript =
				document.querySelector("#yandex-maps-sdk") ||
				document.querySelector('script[src*="api-maps.yandex.ru/2.1/"]')

			const script = existingScript || document.createElement("script")

			const handleError = () => {
				yandexMapsLoadPromise = null
				reject(
					new Error(
						"Не удалось загрузить Yandex Maps. Проверь ключ API, ограничения по Referer и доступность api-maps.yandex.ru.",
					),
				)
			}

			const finalize = () => {
				if (!window.ymaps?.ready) {
					handleError()
					return
				}

				window.ymaps.ready(() => resolve(window.ymaps))
			}

			if (!existingScript) {
				script.id = "yandex-maps-sdk"
				script.src = getYandexMapsSrc(apiKey)
				script.async = true
				script.defer = true
				script.type = "text/javascript"
				document.head.appendChild(script)
			}

			script.addEventListener("load", finalize, { once: true })
			script.addEventListener("error", handleError, { once: true })
		})

		return yandexMapsLoadPromise
	}

	const reverseGeocode = async (coordinates, options = {}) => {
		const ymaps = await load()
		const yandexCoords = toYandexCoords(coordinates)

		if (!ymaps || !yandexCoords) {
			return ""
		}

		try {
			const result = await ymaps.geocode(yandexCoords, {
				kind: options.kind,
				results: options.results || 1,
			})

			return readGeoObjectAddress(result?.geoObjects?.get?.(0))
		} catch {
			return ""
		}
	}

	const createPlacemark = (ymaps, coordinates, title) => {
		const yandexCoords = toYandexCoords(coordinates)

		if (!yandexCoords) {
			return null
		}

		return new ymaps.Placemark(
			yandexCoords,
			{
				balloonContent: title,
			},
			{
				preset: "islands#redIcon",
			},
		)
	}

	const createMap = async ({
		container,
		center,
		zoom = 15,
		markerCoordinates = null,
		markerText = "",
		selectable = false,
		onSelect = null,
	}) => {
		const ymaps = await load()
		const yandexCenter = toYandexCoords(center)

		if (!container || !ymaps || !yandexCenter) {
			return null
		}

		const map = new ymaps.Map(container, {
			center: yandexCenter,
			zoom,
			controls: [],
		})

		let marker = null
		let markerTitle = markerText

		const syncMarker = (coordinates = null) => {
			if (marker) {
				map.geoObjects.remove(marker)
				marker = null
			}

			if (!Array.isArray(coordinates) || coordinates.length < 2) {
				return
			}

			marker = createPlacemark(ymaps, coordinates, markerTitle)

			if (marker) {
				map.geoObjects.add(marker)
			}
		}

		if (Array.isArray(markerCoordinates) && markerCoordinates.length >= 2) {
			syncMarker(markerCoordinates)
		}

		let clickHandler = null

		if (selectable && typeof onSelect === "function") {
			clickHandler = (event) => {
				const normalizedCoordinates = fromYandexCoords(event.get("coords"))

				if (!normalizedCoordinates) {
					return
				}

				syncMarker(normalizedCoordinates)
				onSelect(normalizedCoordinates)
			}

			map.events.add("click", clickHandler)
		}

		return {
			map,
			marker,
			setCenter(nextCenter) {
				const nextYandexCenter = toYandexCoords(nextCenter)

				if (!nextYandexCenter) {
					return
				}

				map.setCenter(nextYandexCenter)
			},
			setZoom(nextZoom) {
				if (!Number.isFinite(nextZoom)) {
					return
				}

				map.setZoom(nextZoom)
			},
			setMarker(coordinates) {
				syncMarker(coordinates)
			},
			clearMarker() {
				syncMarker(null)
			},
			setMarkerText(nextTitle = "") {
				markerTitle = nextTitle

				if (marker) {
					const currentCoordinates = fromYandexCoords(
						marker.geometry?.getCoordinates?.(),
					)

					syncMarker(currentCoordinates)
				}
			},
			destroy() {
				if (clickHandler) {
					map.events.remove("click", clickHandler)
				}

				if (marker) {
					map.geoObjects.remove(marker)
				}

				if (typeof map.destroy === "function") {
					map.destroy()
				}
			},
		}
	}

	return {
		load,
		createMap,
		reverseGeocode,
	}
}
