import dotenv from "dotenv"
import bcrypt from "bcrypt"
import mongoose from "mongoose"
import { connectDB } from "../server/config/db.js"
import PartnerModel from "../server/models/Partner.js"
import TourModel from "../server/models/Tour.js"
import HotelModel from "../server/models/Hotel.js"
import FaqModel from "../server/models/Faq.js"
import UserModel from "../server/models/User.js"

dotenv.config()

const demoImage = (id) => `https://picsum.photos/seed/flyaway-${id}/1200/760`
const demoRoomImage = (id) => `https://picsum.photos/seed/flyaway-room-${id}/900/580`
const passwordHash = await bcrypt.hash("partner123", 10)

const partnerNames = [
	"Nomad Travel KZ",
	"Alatau Tour",
	"Steppe Roads",
	"Saryarka Adventures",
	"Turkistan Guide",
	"Altai Discovery",
	"Caspian Way",
	"Kolsai Trip",
	"Astana Weekend",
	"Jetisu Travel",
]

const tourNames = [
	"Кольсай и Каинды — тур выходного дня",
	"Чарынский каньон — однодневный тур из Алматы",
	"Бурабай — семейный weekend из Астаны",
	"Алтын-Эмель и Поющий бархан",
	"Туркестан: история и архитектура",
	"Большое Алматинское озеро и горы",
	"Мангистау: Бозжыра и плато Устюрт",
	"Катон-Карагай и Алтайские маршруты",
	"Алаколь — летний отдых у озера",
	"Шымбулак и Медеу — городской mountain trip",
]

const hotelNames = [
	"Alatau Grand Hotel",
	"Kolsai Lake Resort",
	"Burabay Forest Hotel",
	"Turkistan Heritage Stay",
	"Caspian Sea View Hotel",
	"Altai Eco Lodge",
	"Astana Business Comfort",
	"Shymbulak Mountain Inn",
	"Alaqol Family Hotel",
	"Jetisu Park Residence",
]

const locations = [
	{ city: "Алматы", x: 76.889709, y: 43.238949 },
	{ city: "Астана", x: 71.430565, y: 51.128201 },
	{ city: "Туркестан", x: 68.269089, y: 43.297330 },
	{ city: "Актау", x: 51.197456, y: 43.653226 },
	{ city: "Усть-Каменогорск", x: 82.605869, y: 49.948547 },
]

const buildPartner = (name, index, ownerId) => ({
	createdBy: ownerId,
	title: name,
	description: `${name} — туристический партнер FlyAway, который организует авторские маршруты по Казахстану, помогает с подбором тура и сопровождает клиентов на всех этапах поездки.`,
	avatar: demoImage(`partner-${index}`),
	logo: demoImage(`partner-logo-${index}`),
	email: `partner${index + 1}@flyaway.demo`,
	password: passwordHash,
	bin: `990000000${index}`,
	ownerName: `Менеджер ${index + 1}`,
	contacts: {
		website: `https://partner${index + 1}.flyaway.demo`,
		address: `${locations[index % locations.length].city}, офис ${20 + index}`,
		phone: `770100000${String(index).padStart(2, "0")}`,
	},
})

const buildTour = (title, index, partnerId) => {
	const loc = locations[index % locations.length]
	const basePrice = 18000 + index * 4500
	return {
		title,
		description: `${title}. Маршрут подходит для путешественников, которые хотят увидеть природные и культурные места Казахстана без сложной самостоятельной подготовки.`,
		avatar: demoImage(`tour-cover-${index}`),
		images: [demoImage(`tour-${index}-1`), demoImage(`tour-${index}-2`), demoImage(`tour-${index}-3`)],
		price: basePrice,
		discount: index % 3 === 0 ? 20 : index % 3 === 1 ? 15 : 0,
		is_hot: index < 6,
		rating: Number((4.2 + (index % 6) * 0.12).toFixed(1)),
		reviewsCount: 8 + index * 3,
		duration: index % 2 === 0 ? "1 день" : "2 дня и 1 ночь",
		highlights: ["Комфортный транспорт", "Сопровождение гида", "Красивые фотолокации"],
		dates: ["2026-06-20", "2026-06-27"],
		dateDetails: [
			{ date: "2026-06-20", text: "Основной выезд группы" },
			{ date: "2026-06-27", text: "Дополнительный выезд" },
		],
		availabilityDates: [
			{ date: "2026-06-20", timeFrom: "07:00", timeTo: "21:00", seats: 24, bookedSeats: index },
			{ date: "2026-06-27", timeFrom: "07:00", timeTo: "21:00", seats: 24, bookedSeats: 0 },
		],
		departureCity: loc.city,
		departurePoint: `${loc.city}, центральная точка сбора`,
		departureLocation: { x: loc.x, y: loc.y, address: `${loc.city}, центр`, label: "Точка отправления" },
		departureMapImage: demoImage(`departure-map-${index}`),
		routeMapImage: demoImage(`route-map-${index}`),
		program: [
			{ time: "07:00", text: "Сбор группы и выезд" },
			{ time: "11:00", text: "Прибытие на основную локацию" },
			{ time: "18:30", text: "Возвращение в город" },
		],
		routePlaces: [
			{ title: "Главная локация", image: demoImage(`route-place-${index}-1`) },
			{ title: "Смотровая площадка", image: demoImage(`route-place-${index}-2`) },
		],
		packingList: ["Удобная обувь", "Вода", "Документы", "Power bank"],
		recommendations: ["Подходит для новичков", "Уточняйте погоду перед выездом"],
		includes: ["Транспорт", "Гид", "Базовая страховка"],
		excludes: ["Личные расходы", "Питание вне программы"],
		ticketTypes: [
			{ title: "Стандарт", subtitle: "Взрослый билет", price: basePrice },
			{ title: "Детский", subtitle: "7–13 лет", price: Math.round(basePrice * 0.65) },
		],
		contacts: { website: "https://flyaway.demo", phone: "+7 701 000 00 00", address: `${loc.city}, офис партнера`, instagram: "@flyaway.kz" },
		partner: partnerId,
	}
}

const buildHotel = (name, index, partnerId) => {
	const loc = locations[index % locations.length]
	const price = 18000 + index * 5000
	return {
		name,
		partner: partnerId,
		description: `${name} — комфортный отель для туристов FlyAway с удобной локацией, базовыми сервисами и понятными условиями проживания.`,
		content: `Отель ${name} подходит для семейных поездок, деловых остановок и отдыха после экскурсионных маршрутов. Гости могут выбрать номер подходящего класса и оставить заявку на бронирование.`,
		rating: Number((4.1 + (index % 7) * 0.11).toFixed(1)),
		reviewsCount: 5 + index * 2,
		location: `${loc.city}, район ${index + 1}`,
		images: [demoImage(`hotel-${index}-1`), demoImage(`hotel-${index}-2`), demoImage(`hotel-${index}-3`)],
		price,
		discount: index % 4 === 0 ? 20 : index % 4 === 1 ? 10 : 0,
		is_hot: index < 5,
		coordinates: { x: loc.x + index * 0.01, y: loc.y + index * 0.005, address: `${loc.city}, район ${index + 1}`, label: name },
		contacts: { website: "https://hotel.flyaway.demo", phone: "+7 702 000 00 00", address: `${loc.city}, район ${index + 1}`, instagram: "@flyaway.hotel" },
		nearby_points: [{ label: "до центра", value: "10 минут" }, { label: "до аэропорта", value: "25 минут" }],
		policy: ["Заезд после 14:00", "Выезд до 12:00", "Ранний заезд по запросу"],
		meals: ["Завтрак", "Ресторан", "Мини-бар"],
		amenities: ["Wi‑Fi", "Парковка", "Кондиционер", "Трансфер"],
		paid_services: ["SPA", "Прачечная", "Дополнительный трансфер"],
		family_features: ["Семейные номера", "Детская кроватка по запросу"],
		accessibility: ["Лифт", "Помощь персонала"],
		entertainment: ["Бассейн", "Зона отдыха"],
		room_types: [
			{ name: "Эконом", price, description: "Уютный номер для короткой остановки.", benefits: ["Душ", "Wi‑Fi", "Телевизор"], images: [demoRoomImage(`${index}-econom`)] },
			{ name: "Стандарт", price: price + 9000, description: "Комфортный номер для пары или семьи.", benefits: ["Большая кровать", "Wi‑Fi", "Завтрак"], images: [demoRoomImage(`${index}-standard`)] },
			{ name: "Премиум", price: price + 22000, description: "Просторный номер с улучшенным видом.", benefits: ["Балкон", "Завтрак", "Мини-бар"], images: [demoRoomImage(`${index}-premium`)] },
		],
	}
}

const faqItems = [
	["Как забронировать тур?", "Выберите тур, дату, количество билетов и способ оплаты. После успешного оформления билет появится в личном кабинете.", "Туры"],
	["Как работает бронирование отелей?", "Для отелей создается заявка. После отправки менеджер связывается с клиентом и подтверждает детали проживания.", "Отели"],
	["Можно ли оплатить бонусами?", "Да, если на бонусном кошельке достаточно средств. Списание отображается в истории операций.", "Оплата"],
	["Кто может оставить отзыв?", "Отзыв по туру может оставить пользователь, у которого есть завершенная покупка этого тура.", "Отзывы"],
	["Как стать партнером?", "Нужно заполнить заявку партнера. После создания бизнес-профиля партнер получает доступ к админ-панели.", "Партнеры"],
	["Где посмотреть мои билеты?", "Все активные и завершенные туры находятся в личном кабинете в разделе Мои туры.", "Личный кабинет"],
	["Что означает горячий тур?", "Это предложение с повышенной актуальностью, скидкой или ограниченным количеством мест.", "Туры"],
	["Можно ли отменить бронь?", "Отмена зависит от статуса заявки и правил партнера. Для уточнения нужно связаться с менеджером.", "Бронирование"],
	["Как работает рейтинг партнера?", "Рейтинг партнера рассчитывается по рейтингам его туров и отелей.", "Рейтинг"],
	["Какие данные нужны для отеля?", "Для заявки обычно нужны имя, телефон, даты проживания, выбранный номер и комментарий.", "Отели"],
]

const run = async () => {
	await connectDB()
	try {
		await Promise.all([
			PartnerModel.deleteMany({}),
			TourModel.deleteMany({}),
			HotelModel.deleteMany({}),
			FaqModel.deleteMany({}),
		])

		const partners = []
		for (let i = 0; i < partnerNames.length; i += 1) {
			const owner = await UserModel.findOneAndUpdate(
				{ email: `owner${i + 1}@flyaway.demo` },
				{ $set: { name: `Владелец партнера ${i + 1}`, email: `owner${i + 1}@flyaway.demo`, password: passwordHash, role: "user", isVerified: true } },
				{ new: true, upsert: true, setDefaultsOnInsert: true }
			)
			partners.push(await PartnerModel.create(buildPartner(partnerNames[i], i, owner._id)))
		}

		const tours = []
		const hotels = []
		for (let i = 0; i < 10; i += 1) {
			const partner = partners[i]
			const tour = await TourModel.create(buildTour(tourNames[i], i, partner._id))
			const hotel = await HotelModel.create(buildHotel(hotelNames[i], i, partner._id))
			tours.push(tour)
			hotels.push(hotel)
			await PartnerModel.findByIdAndUpdate(partner._id, { $addToSet: { tours: tour._id, hotels: hotel._id } })
		}

		await FaqModel.insertMany(faqItems.map(([question, answer, category], index) => ({ question, answer, category, order: index + 1, isActive: true })))

		console.log("✅ Demo seed completed")
		console.log(`Партнеры: ${partners.length}`)
		console.log(`Туры: ${tours.length}`)
		console.log(`Отели: ${hotels.length}`)
		console.log(`FAQ: ${faqItems.length}`)
		console.log("Пароль партнеров: partner123")
	} catch (error) {
		console.error("❌ Demo seed error:", error)
		process.exitCode = 1
	} finally {
		await mongoose.connection.close()
	}
}

run()
