import { uploadToBlob } from "../utils/uploadToBlob.js"

export const testUploadToBlob = async (req, res) => {
	try {
		const { fileName, mimeType, size, base64Data, folder } = req.body

		if (!fileName || !mimeType || !size || !base64Data) {
			return res.status(400).json({
				message: "fileName, mimeType, size и base64Data обязательны",
			})
		}

		const cleanBase64 = base64Data.includes(",")
			? base64Data.split(",")[1]
			: base64Data
		const buffer = Buffer.from(cleanBase64, "base64")

		const result = await uploadToBlob(
			{
				originalname: fileName,
				mimetype: mimeType,
				size,
				buffer,
			},
			folder || "uploads"
		)

		res.json({
			message: "Файл успешно загружен в Blob",
			...result,
		})
	} catch (error) {
		console.error("Blob upload test error:", error)
		res.status(500).json({
			message: error.message || "Не удалось загрузить файл в Blob",
		})
	}
}
