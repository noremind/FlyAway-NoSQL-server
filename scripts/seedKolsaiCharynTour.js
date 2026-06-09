import dotenv from "dotenv"
import bcrypt from "bcrypt"
import mongoose from "mongoose"
import { connectDB } from "../server/config/db.js"
import PartnerModel from "../server/models/Partner.js"
import TourModel from "../server/models/Tour.js"
import UserModel from "../server/models/User.js"

dotenv.config()

const TOUR_TITLE = "Чарын, Кольсай и Каинды — 2 дня в горах Алматинской области"
const PARTNER_TITLE = "Kolsai & Charyn Travel"
const PARTNER_EMAIL = "kolsai.partner@flyaway.demo"
const PARTNER_PHONE = "+7 701 555 20 26"

const images = {
	kolsaiCover: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Kolsay_Lake.jpeg",
	kolsaiLower: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Lower_Kolsay_Lake_in_April.jpg",
	kaindy: "https://upload.wikimedia.org/wikipedia/commons/c/c2/IMG_9366-Kaindy-e.jpg",
	charyn: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Charyn_Canyon%2C_Kazakhstan_03.jpg",
}

const ensurePartner = async () => {
	let owner = await UserModel.findOne({ email: PARTNER_EMAIL })

	if (!owner) {
		owner = await UserModel.create({
			name: "Kolsai Partner",
			email: PARTNER_EMAIL,
			phone: PARTNER_PHONE,
			password: await bcrypt.hash("partner123", 10),
			role: "partner",
		})
	}

	let partner = await PartnerModel.findOne({ title: PARTNER_TITLE })

	if (!partner) {
		partner = await PartnerModel.create({
			createdBy: owner._id,
			title: PARTNER_TITLE,
			description:
				"Kolsai & Charyn Travel — партнёр FlyAway, который организует природные туры из Алматы к Чарынскому каньону, озеру Каинды и Кольсайским озёрам.",
			avatar: images.kolsaiCover,
			logo: images.kolsaiCover,
			email: PARTNER_EMAIL,
			password: await bcrypt.hash("partner123", 10),
			bin: "260700000001",
			ownerName: "Kolsai Partner",
			rating: 4.8,
			contacts: {
				website: "https://flyaway-project.vercel.app",
				address: "Алматы, проспект Абылай хана, 2",
				phone: PARTNER_PHONE,
			},
		})
	}

	return partner
}

const buildTourPayload = (partnerId) => ({
	title: TOUR_TITLE,
	description:
		"Двухдневный тур из Алматы по самым известным природным местам юго-востока Казахстана. За одну поездку туристы увидят Чарынский каньон, горное село Саты, озеро Каинды с затопленными елями и Нижнее озеро Кольсай. Маршрут подходит для тех, кто хочет за короткое время увидеть каньон, горные озёра, хвойные леса и атмосферу Северного Тянь-Шаня.",
	avatar: images.kolsaiCover,
	images: [images.kolsaiCover, images.kaindy, images.charyn, images.kolsaiLower],
	price: 59900,
	discount: 10,
	is_hot: true,
	rating: 4.8,
	reviewsCount: 18,
	duration: "2 дня / 1 ночь",
	highlights: [
		"Чарынский каньон и Долина замков",
		"Озеро Каинды с затопленными елями",
		"Нижнее озеро Кольсай",
		"Ночь в горном селе Саты",
		"Прогулка среди хвойных лесов Северного Тянь-Шаня",
		"Маршрут подходит для фото, отдыха и лёгкого трекинга",
	],
	dates: ["2026-07-12", "2026-07-19", "2026-07-26", "2026-08-02", "2026-08-09"],
	dateDetails: [
		{ date: "2026-07-12", text: "Основной летний выезд группы" },
		{ date: "2026-07-19", text: "Выезд на выходные с ночёвкой в Саты" },
		{ date: "2026-07-26", text: "Выезд к Чарыну, Каинды и Кольсаю" },
		{ date: "2026-08-02", text: "Августовский выезд для группы до 18 человек" },
		{ date: "2026-08-09", text: "Дополнительный летний выезд" },
	],
	availabilityDates: [
		{ date: "2026-07-12", timeFrom: "06:00", timeTo: "22:00", seats: 18, bookedSeats: 0 },
		{ date: "2026-07-19", timeFrom: "06:00", timeTo: "22:00", seats: 18, bookedSeats: 0 },
		{ date: "2026-07-26", timeFrom: "06:00", timeTo: "22:00", seats: 18, bookedSeats: 0 },
		{ date: "2026-08-02", timeFrom: "06:00", timeTo: "22:00", seats: 18, bookedSeats: 0 },
		{ date: "2026-08-09", timeFrom: "06:00", timeTo: "22:00", seats: 18, bookedSeats: 0 },
	],
	departureCity: "Алматы",
	departurePoint: "Алматы, проспект Абылай хана, 2, возле Центрального стадиона",
	departureLocation: {
		x: 76.889709,
		y: 43.238949,
		address: "Алматы, проспект Абылай хана, 2",
		label: "Точка сбора группы",
	},
	departureMapImage: images.kolsaiCover,
	routeMapImage: images.charyn,
	program: [
		{ time: "1 день, 06:00", text: "Выезд из Алматы на комфортабельном микроавтобусе." },
		{ time: "1 день, 09:30", text: "Остановка по дороге, лёгкий завтрак или кофе." },
		{ time: "1 день, 11:00", text: "Прибытие в Чарынский каньон, прогулка по смотровым площадкам и Долине замков." },
		{ time: "1 день, 13:30", text: "Обед в формате ланч-бокса или кафе по маршруту." },
		{ time: "1 день, 15:00", text: "Переезд в сторону села Саты." },
		{ time: "1 день, 18:30", text: "Размещение в гостевом доме." },
		{ time: "1 день, 19:30", text: "Ужин, свободное время и отдых после дороги." },
		{ time: "2 день, 07:30", text: "Завтрак в гостевом доме." },
		{ time: "2 день, 08:30", text: "Выезд к озеру Каинды." },
		{ time: "2 день, 09:30", text: "Прогулка у озера Каинды, фотосъёмка и свободное время." },
		{ time: "2 день, 12:00", text: "Возвращение в Саты и обед." },
		{ time: "2 день, 13:30", text: "Переезд к Нижнему озеру Кольсай." },
		{ time: "2 день, 14:00", text: "Прогулка вдоль озера Кольсай, свободное время и фотографии." },
		{ time: "2 день, 17:00", text: "Выезд обратно в Алматы." },
		{ time: "2 день, 21:00", text: "Ориентировочное прибытие в Алматы." },
	],
	routePlaces: [
		{ title: "Чарынский каньон", image: images.charyn },
		{ title: "Озеро Каинды", image: images.kaindy },
		{ title: "Нижнее озеро Кольсай", image: images.kolsaiLower },
		{ title: "Село Саты", image: images.kolsaiCover },
	],
	packingList: [
		"Удостоверение личности",
		"Удобная обувь для прогулок",
		"Тёплая кофта или ветровка",
		"Дождевик",
		"Вода",
		"Power bank",
		"Солнцезащитные очки",
		"Личные лекарства",
		"Наличные деньги для дополнительных расходов",
	],
	recommendations: [
		"Маршрут подходит для туристов без специальной горной подготовки.",
		"Перед поездкой рекомендуется уточнить прогноз погоды.",
		"Для прогулок у озёр лучше выбрать удобную обувь с нескользящей подошвой.",
		"В горах вечером может быть прохладно даже летом.",
	],
	includes: [
		"Трансфер Алматы — Чарын — Саты — Каинды — Кольсай — Алматы",
		"Проживание 1 ночь в гостевом доме в селе Саты",
		"Питание: ужин, завтрак, обед",
		"Сопровождение гида",
		"Входные билеты в национальные парки",
		"Помощь при посадке, размещении и прохождении маршрута",
	],
	excludes: [
		"Личные расходы",
		"Конная прогулка или внедорожный трансфер к Каинды, если потребуется",
		"Дополнительное питание вне программы",
		"Индивидуальная страховка",
		"Аренда дождевика, трекинговых палок и личного снаряжения",
	],
	ticketTypes: [
		{ title: "Стандарт", subtitle: "Взрослый билет", price: 59900 },
		{ title: "Детский", subtitle: "7–13 лет", price: 44900 },
	],
	contacts: {
		website: "https://flyaway-project.vercel.app",
		phone: PARTNER_PHONE,
		address: "Алматы, проспект Абылай хана, 2",
		instagram: "@flyaway.kz",
	},
	partner: partnerId,
	hotels: [],
})

const run = async () => {
	await connectDB()

	const partner = await ensurePartner()
	const payload = buildTourPayload(partner._id)

	const tour = await TourModel.findOneAndUpdate(
		{ title: TOUR_TITLE },
		{ $set: payload },
		{ new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
	)

	await PartnerModel.findByIdAndUpdate(partner._id, { $addToSet: { tours: tour._id } })

	console.log(`✅ Тур добавлен или обновлен: ${tour.title}`)
	console.log(`👤 Партнер: ${partner.title}`)
	console.log("🔑 Демо-доступ партнера: kolsai.partner@flyaway.demo / partner123")

	await mongoose.disconnect()
}

run().catch(async (error) => {
	console.error("❌ Ошибка при добавлении тура:", error)
	await mongoose.disconnect()
	process.exit(1)
})