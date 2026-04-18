import { uploadToBlob } from "../utils/uploadToBlob.js"
import AdModel from "../models/Ad.js"
import BannerModel from "../models/Banner.js"
import HotelModel from "../models/Hotel.js"
import PartnerModel from "../models/Partner.js"
import TourModel from "../models/Tour.js"

export const testUploadToBlob = async (req, res) => {
	try {
		const { fileName, mimeType, size, base64Data, folder } = req.body

		if (!fileName || !mimeType || !size || !base64Data) {
			return res.status(400).json({
				message: "fileName, mimeType, size и base64Data обязательны",
			})
		}

		const cleanBase64 = base64Data.includes(",")
			? base64Data.split(",")[1]
			: base64Data
		const buffer = Buffer.from(cleanBase64, "base64")

		const result = await uploadToBlob(
			{
				originalname: fileName,
				mimetype: mimeType,
				size,
				buffer,
			},
			folder || "uploads"
		)

		res.json({
			message: "Файл успешно загружен в Blob",
			...result,
		})
	} catch (error) {
		console.error("Blob upload test error:", error)
		res.status(500).json({
			message: error.message || "Не удалось загрузить файл в Blob",
		})
	}
}

export const seedDemoContent = async (req, res) => {
	try {
		const partner = await PartnerModel.findOneAndUpdate(
			{ title: "Demo Mountain Travel" },
			{
				title: "Demo Mountain Travel",
				description: "Однодневные и weekend туры по Алматинской области.",
				email: "demo-partner@flyaway.local",
				ownerName: "Demo Owner",
				bin: "123456789012",
				logo: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=300&q=80",
				avatar: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=300&q=80",
				contacts: {
					address: "Алматы, Абая 120",
					phone: "87010000000",
					website: "https://flyaway-project.vercel.app",
				},
			},
			{ new: true, upsert: true, setDefaultsOnInsert: true }
		)

		const hotel = await HotelModel.findOneAndUpdate(
			{ name: "Demo Chalet Kolsai" },
			{
				name: "Demo Chalet Kolsai",
				partner: partner._id,
				description: "Уютный горный отель рядом с озерами и маршрутами.",
				rating: 4.8,
				location: "Кольсай",
				content: "Панорамные номера, завтрак, трансфер и горячий чай после маршрута.",
				images: [
					"https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
					"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
				],
			},
			{ new: true, upsert: true, setDefaultsOnInsert: true }
		)

		const tour = await TourModel.findOneAndUpdate(
			{ title: "Demo Тур на Кольсай" },
			{
				title: "Demo Тур на Кольсай",
				description: "Однодневная поездка к озерам, каньону и смотровым площадкам.",
				avatar: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80",
				images: [
					"https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80",
					"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80",
				],
				price: 45000,
				discount: 20,
				is_hot: true,
				rating: 4.9,
				duration: "1 день",
				highlights: ["Озера Кольсай", "Чарынский каньон", "Комфортный трансфер"],
				dates: ["2026-05-12", "2026-05-19"],
				availabilityDates: [
					{ date: "2026-05-12", timeFrom: "06:00", timeTo: "23:00", seats: 18, bookedSeats: 5 },
					{ date: "2026-05-19", timeFrom: "06:00", timeTo: "23:00", seats: 18, bookedSeats: 18 },
				],
				departureCity: "Алматы",
				departurePoint: "Байтурсынова / Абая",
				departureLocation: {
					x: 76.92848,
					y: 43.23895,
					address: "Алматы, Байтурсынова / Абая",
					label: "Точка отправления",
				},
				departureMapImage: "https://static-maps.yandex.ru/1.x/?lang=ru_RU&ll=76.92848,43.23895&z=11&size=450,240&l=map",
				routeMapImage: "https://static-maps.yandex.ru/1.x/?lang=ru_RU&ll=78.235,42.95&z=7&size=600,320&l=map",
				program: [
					{ time: "06:00", text: "Сбор и отправление из Алматы" },
					{ time: "10:30", text: "Прибытие на Кольсай и прогулка" },
					{ time: "17:00", text: "Выезд обратно" },
				],
				routePlaces: [
					{
						title: "Озеро Кольсай",
						image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80",
					},
					{
						title: "Чарынский каньон",
						image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
					},
				],
				packingList: ["Документ", "Вода", "Теплая одежда"],
				recommendations: ["Средняя сложность", "Удобная обувь"],
				includes: ["Трансфер", "Сопровождение", "Экосбор"],
				excludes: ["Личные расходы"],
				ticketTypes: [
					{ title: "Взрослый", subtitle: "23+", price: 45000 },
					{ title: "Детский", subtitle: "7-13 лет", price: 32000 },
				],
				contacts: {
					website: "https://flyaway-project.vercel.app",
					phone: "87010000000",
					address: "Алматы",
					instagram: "@flyaway_demo",
				},
				partner: partner._id,
				hotels: [hotel._id],
			},
			{ new: true, upsert: true, setDefaultsOnInsert: true }
		)

		await PartnerModel.findByIdAndUpdate(partner._id, {
			$set: { tours: [tour._id], hotels: [hotel._id] },
		})

		const banner = await BannerModel.findOneAndUpdate(
			{ title: "Demo Hero Banner" },
			{
				title: "Туры на Кольсай и Чарын",
				description: "Готовые маршруты на ближайшие даты.",
				image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80",
				link: `/tours/${tour._id}`,
				buttonText: "Выбрать тур",
			},
			{ new: true, upsert: true, setDefaultsOnInsert: true }
		)

		const ad = await AdModel.findOneAndUpdate(
			{ title: "Demo Promo Banner" },
			{
				title: "Горный отдых",
				image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
				link: String(hotel._id),
				type: "our_hotel",
			},
			{ new: true, upsert: true, setDefaultsOnInsert: true }
		)

		return res.json({
			message: "Demo content seeded",
			data: {
				partnerId: partner._id,
				tourId: tour._id,
				hotelId: hotel._id,
				bannerId: banner._id,
				adId: ad._id,
			},
		})
	} catch (error) {
		console.error("Seed demo content error:", error)
		return res.status(500).json({
			message: error.message || "Failed to seed demo content",
		})
	}
}
