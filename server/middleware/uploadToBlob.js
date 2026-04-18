import { del, put } from "@vercel/blob"

const MAX_FILE_SIZE = 4.5 * 1024 * 1024
const BLOB_TOKEN_ERROR = "BLOB_READ_WRITE_TOKEN is not configured"

const folderMap = {
	tours: "flyaway/tours",
	hotels: "flyaway/hotels",
	users: "flyaway/users",
	partners: "flyaway/partners",
	banners: "flyaway/main/banners",
	posters: "flyaway/main/posters",
	general: "flyaway/general",
}

const normalizeSegment = (value, fallback = "draft") => {
	return String(value || fallback)
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9/_-]+/gi, "-")
}

export const buildBlobFolder = ({ bucket = "general", entityId, scope = "default" } = {}) => {
	const baseFolder = folderMap[bucket] || folderMap.general
	return `${baseFolder}/${normalizeSegment(entityId)}/${normalizeSegment(scope)}`
}

export const uploadToBlob = async (file, folder = "uploads") => {
	if (!file) {
		throw new Error("File is required")
	}

	if (!process.env.BLOB_READ_WRITE_TOKEN) {
		throw new Error(BLOB_TOKEN_ERROR)
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

export const uploadBase64File = async (filePayload, location = {}) => {
	if (!filePayload?.base64Data) {
		throw new Error("File data is required")
	}

	const { fileName, mimeType, size, base64Data } = filePayload
	const cleanBase64 = base64Data.includes(",")
		? base64Data.split(",")[1]
		: base64Data
	const buffer = Buffer.from(cleanBase64, "base64")
	const folder =
		typeof location === "string" ? location : buildBlobFolder(location)

	return uploadToBlob(
		{
			originalname: fileName || "file",
			mimetype: mimeType,
			size: Number(size) || buffer.length,
			buffer,
		},
		folder
	)
}

const isBlobUrl = (value) =>
	typeof value === "string" &&
	(value.includes("vercel-storage.com") || value.includes("blob.vercel-storage"))

export const deleteFromBlob = async (urls) => {
	const targets = (Array.isArray(urls) ? urls : [urls]).filter(isBlobUrl)

	if (!targets.length) {
		return { deleted: 0 }
	}

	if (!process.env.BLOB_READ_WRITE_TOKEN) {
		throw new Error(BLOB_TOKEN_ERROR)
	}

	await del(targets, {
		token: process.env.BLOB_READ_WRITE_TOKEN,
	})

	return {
		deleted: targets.length,
	}
}
