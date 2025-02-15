const express = require("express")
const cors = require("cors")
const Hotel = require("./models/hotels")

const app = express()
const PORT = 5000

// Используем CORS
app.use(cors())

app.get("/hotels", async (req, res) => {
	try {
		const hotels = await Hotel.find()
		res.json(hotels)
	} catch (err) {
		res.status(500).json({ error: "Ошибка сервера" })
	}
})

app.listen(PORT, () =>
	console.log(`🚀 Сервер запущен на http://localhost:${PORT}`)
)
