// utils/uploadToBlob.js
import { put } from "@vercel/blob"

const MAX_FILE_SIZE = 4.5 * 1024 * 1024

export const uploadToBlob = async (file, folder = "uploads") => {
	if (!file) {
		throw new Error("File is required")
	}

	if (file.size > MAX_FILE_SIZE) {
		throw new Error("File size must be less than 4.5MB")
	}

	const safeName = file.originalname.replace(/\s+/g, "-")
	const pathname = `${folder}/${Date.now()}-${safeName}`

	const blob = await put(pathname, file.buffer, {
		access: "public",
		token: process.env.BLOB_READ_WRITE_TOKEN,
		contentType: file.mimetype,
	})

	return {
		url: blob.url,
		pathname: blob.pathname,
	}
}
