import { deleteFromBlob, uploadBase64File } from "../utils/uploadToBlob.js"

export const uploadStorageFile = async (req, res) => {
	try {
		const result = await uploadBase64File(req.body.file, {
			bucket: req.body.bucket,
			entityId: req.body.entityId || req.userId || "draft",
			scope: req.body.scope || "default",
		})

		return res.status(201).json({
			message: "File uploaded",
			data: result,
		})
	} catch (error) {
		console.error("Storage upload error:", error)
		return res.status(500).json({
			message: error.message || "Failed to upload file",
		})
	}
}

export const deleteStorageFile = async (req, res) => {
	try {
		const result = await deleteFromBlob(req.body.url || req.body.urls)

		return res.json({
			message: "File deleted",
			data: result,
		})
	} catch (error) {
		console.error("Storage delete error:", error)
		return res.status(500).json({
			message: error.message || "Failed to delete file",
		})
	}
}
