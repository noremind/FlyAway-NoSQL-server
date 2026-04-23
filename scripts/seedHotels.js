import dotenv from "dotenv"
import mongoose from "mongoose"
import { connectDB } from "../server/config/db.js"
import PartnerModel from "../server/models/Partner.js"
import HotelModel from "../server/models/Hotel.js"

dotenv.config()

const normalizeString = (value) => String(value || "").trim()

const TEST_HOTELS = [
	{
		name: "FlyAway Mountain Resort",
		description:
			"Современный курорт рядом с горами с просторными номерами, бассейном и видом на вершины.",
		rating: 4.8,
		location: "Алматы, Медеуский район",
		content:
			"Подходит для семейного отдыха, weekend-trip и деловых гостей. На территории есть ресторан, SPA-зона, трансфер до популярных туристических точек и панорамная терраса.",
		images: [
			"https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80",
			"https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1400&q=80",
		],
	},
	{
		name: "FlyAway City Hotel",
		description:
			"Городской отель в центре с удобным расположением, завтраками и рабочими зонами.",
		rating: 4.5,
		location: "Астана, Есильский район",
		content:
			"Оптимален для коротких поездок, командировок и туристов, которые хотят жить ближе к деловому и культурному центру. Есть конференц-зал, lounge и быстрый check-in.",
		images: [
			"https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&w=1400&q=80",
			"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
		],
	},
	{
		name: "FlyAway Lakeside Retreat",
		description:
			"Уютный отель для спокойного отдыха у воды с природными маршрутами и тишиной.",
		rating: 4.7,
		location: "Боровое, Акмолинская область",
		content:
			"Лучше всего подходит для уединенного отдыха, романтических поездок и семейных выходных. Включает прогулочные зоны, ресторан местной кухни и видовые номера.",
		images: [
			"https://images.unsplash.com/photo-1501117716987-c8e1ecb210f9?auto=format&fit=crop&w=1400&q=80",
			"https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1400&q=80",
		],
	},
	{
		name: "FlyAway Canyon Lodge",
		description:
			"Отель рядом с природными достопримечательностями для активных путешествий и туров выходного дня.",
		rating: 4.6,
		location: "Шарын, Алматинская область",
		content:
			"Подходит для путешественников, которые едут на природу и хотят остановиться ближе к маршрутам. Есть парковка, ранний завтрак и организация экскурсий.",
		images: [
			"https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1400&q=80",
			"https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1400&q=80",
		],
	},
]

const resolvePartner = async () => {
	const explicitPartnerId = normalizeString(process.env.SEED_PARTNER_ID)

	if (explicitPartnerId) {
		const partner = await PartnerModel.findById(explicitPartnerId)
		if (partner) return partner

		throw new Error(`Партнер с SEED_PARTNER_ID=${explicitPartnerId} не найден`)
	}

	const partner = await PartnerModel.findOne().sort({ createdAt: 1 })

	if (!partner) {
		throw new Error(
			"Не найден ни один партнер. Сначала создайте partner-запись, потом запускайте seed отелей."
		)
	}

	return partner
}

const upsertHotel = async (partner) => {
	const createdHotels = []

	for (const item of TEST_HOTELS) {
		const hotel = await HotelModel.findOneAndUpdate(
			{ name: item.name },
			{
				$set: {
					name: item.name,
					partner: partner._id,
					description: item.description,
					rating: item.rating,
					location: item.location,
					content: item.content,
					images: item.images,
				},
			},
			{
				new: true,
				upsert: true,
				setDefaultsOnInsert: true,
			}
		)

		createdHotels.push(hotel)
	}

	await PartnerModel.findByIdAndUpdate(partner._id, {
		$addToSet: {
			hotels: { $each: createdHotels.map((hotel) => hotel._id) },
		},
	})

	return createdHotels
}

const run = async () => {
	await connectDB()

	try {
		const partner = await resolvePartner()
		const hotels = await upsertHotel(partner)

		console.log(`\n✅ Seed completed for partner: ${partner.title}`)
		console.log(`🏨 Hotels in seed: ${hotels.length}`)
		hotels.forEach((hotel, index) => {
			console.log(`${index + 1}. ${hotel.name} — ${hotel.location}`)
		})
	} catch (error) {
		console.error("\n❌ Hotel seed error:", error.message)
		process.exitCode = 1
	} finally {
		await mongoose.connection.close()
	}
}

run()
