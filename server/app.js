import express from "express"
import cors from "cors"
import path from "path"
import routes from "./routes/index.js"

const app = express()
const publicDir = path.resolve(process.cwd(), "public")
const uploadsDir = path.resolve(process.cwd(), "uploads")

app.use(cors())
app.use(express.json({ limit: "10mb" }))
app.use("/api", routes)
app.use("/public", express.static(publicDir))
app.use("/uploads", express.static(uploadsDir))
app.use("/storage", express.static(uploadsDir))

app.get("/", (req, res) => {
	res.send(`
    <html>
      <head>
        <link rel="icon" type="image/x-icon" href="/public/images/logo/FlyAway-logo-small.png">
        <title>FlyAway Server</title>
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
        <img src="https://flyaway-project.vercel.app/assets/logo/FlyAwayLogo.png" alt="Logo" width="300">
        <h1>Добро пожаловать на сервер FlyAway</h1>
        <a href="https://flyaway-project.vercel.app/ru" class="btn">Перейти на клиентскую часть</a>
      </body>
    </html>
  `)
})

export default app
