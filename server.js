const express = require("express");
const Hotel = require("./models/hotels");

const app = express();
const PORT = 3000;

app.get("/hotels", async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.json(hotels);
    } catch (err) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

app.listen(PORT, () => console.log(`🚀 Сервер запущен на http://localhost:${PORT}`));
