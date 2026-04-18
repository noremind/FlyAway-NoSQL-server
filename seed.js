const Hotel = require("./models/hotels");

const newHotel = new Hotel({
    name: "Звездный Комфорт",
    rating: 5,
    reviews: 120,
    description: "Пятизвездочный гостиничный комплекс...",
    price: 66750,
    discount: 25,
    region: "Алматы",
    area: "Центр",
    services: ["Wi-Fi", "Бассейн", "Фитнес"],
    images: ["image1.jpg", "image2.jpg"],
    location: { latitude: 43.2567, longitude: 76.9286 }
});

newHotel.save()
    .then(() => console.log("✅ Отель добавлен"))
    .catch(err => console.error("Ошибка:", err))
    .finally(() => process.exit());
