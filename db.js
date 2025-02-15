const mongoose = require("mongoose")
require("dotenv").config()


const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.rexkz.mongodb.net/saparTime?retryWrites=true&w=majority&appName=Cluster0`

mongoose
	.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("✅ Подключено к MongoDB"))
	.catch((err) => console.error("Ошибка подключения:", err))

module.exports = mongoose
