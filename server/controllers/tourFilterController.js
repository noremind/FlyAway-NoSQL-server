import TourModel from "../models/Tour.js"

const normalizeString = (value) => {
	if (value === null || value === undefined) return ""
	return String(value).trim()
}

const sortValues = (values = []) => {
	return [...values].sort((left, right) =>
		String(left).localeCompare(String(right), "ru", {
			sensitivity: "base",
			numeric: true,
		})
	)
}

const getDistinctNormalized = async (field) => {
	const values = await TourModel.distinct(field)

	return sortValues(
		values
			.map((item) => normalizeString(item))
			.filter(Boolean)
	)
}

export const getTourFilterCities = async (req, res) => {
	try {
		const cities = await getDistinctNormalized("departureCity")

		return res.json({
			data: cities.map((value) => ({ label: value, value })),
		})
	} catch (error) {
		console.error("Ошибка при получении городов туров:", error)
		return res.status(500).json({
			message: "Ошибка при получении списка городов",
		})
	}
}

export const getTourFilterDurations = async (req, res) => {
	try {
		const durations = await getDistinctNormalized("duration")

		return res.json({
			data: durations.map((value) => ({ label: value, value })),
		})
	} catch (error) {
		console.error("Ошибка при получении продолжительностей туров:", error)
		return res.status(500).json({
			message: "Ошибка при получении списка продолжительностей",
		})
	}
}
