import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import routes from "./routes/index.js"
import dotenv from "dotenv"
// import path from "path"

dotenv.config()

const app = express()
const PORT = process.env.PORT

connectDB()

app.use(express.json())
app.use(cors())
app.use("/api", routes)
// app.use("/uploads", express.static(path.resolve("uploads")))
// app.use("/public", express.static("public"))
app.use(express.static("public"))
// app.use("/storage", express.static("public/images/avatar"))

app.get("/", (req, res) => {
	res.send(`
    <html>
      <head>
				<link rel="icon" type="image/x-icon" href="/public/images/logo/FlyAway-logo-small.png">
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
				<img src="/public/images/logo/logo-flyaway.jpg" alt="Logo" width="300px">
        <h1>Добро пожаловать на сервер!</h1>
        <a href="https://no-sql-project-client.vercel.app/ru" class="btn">Перейти на клиентскую часть</a>
      </body>
    </html>
  `)
})

app.listen(PORT, () =>
	console.log(`Сервер запущен на http://localhost:${PORT}`)
)
