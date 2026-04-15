import express from "express"
import cors from "cors"
import { connectDB } from "./config/mongoDB.js"
import routes from "./routes/index.js"
import dotenv from "dotenv"
import path from "path"

dotenv.config()

const app = express()
const PORT = process.env.PORT

connectDB()

app.use(express.json({ limit: "10mb" }))
app.use(cors())
app.use("/public", express.static("public"))
app.use("/api", routes)
app.get("/storage", app.use("/storage", express.static("public/images/avatar")))

app.get("/upload-test", (req, res) => {
	res.sendFile(path.resolve("public/upload-test.html"))
})

app.get("/", (req, res) => {
	res.send(`
    <html>
      <head>
				<link rel="icon" type="image/x-icon" href="/public/favicon.ico">
        <title>FlyAway Серверная Часть</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
          .btn {
            display: inline-block;
            padding: 10px 20px;
            font-size: 18px;
            color: white;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
          }
          .btn:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
				<img src="https://flyaway-project.vercel.app/assets/logo/FlyAwayLogo.png" alt="Logo" width="300px">
        <h1>Добро пожаловать на сервер!</h1>
        <a href="https://flyaway-project.vercel.app/" class="btn">Перейти на клиентскую часть</a>
      </body>
    </html>
  `)
})

app.listen(PORT, () =>
	console.log(`Сервер запущен на http://localhost:${PORT}`),
)
