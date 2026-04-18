import bcrypt from "bcrypt"
import UserModel from "../../../../models/User.js"
import { sanitizeUser } from "../../../../utils/sanitizeUser.js"
import { deleteFromBlob, uploadBase64File } from "../../../../utils/uploadToBlob.js"

const selfEditableFields = ["name", "phone", "birthDate", "gender", "avatar"]
const adminEditableFields = [...selfEditableFields, "role", "isVerified"]

export const patchUpdateUser = async (req, res) => {
	try {
		const editableFields =
			req.userRole === "admin" ? adminEditableFields : selfEditableFields
		const update = {}

		for (const field of editableFields) {
			if (Object.prototype.hasOwnProperty.call(req.body, field)) {
				update[field] = req.body[field]
			}
		}

		if (update.email) {
			update.email = update.email.trim().toLowerCase()
		}

		if (Object.prototype.hasOwnProperty.call(update, "phone")) {
			const normalizedPhone = update.phone
				? String(update.phone).replace(/\D/g, "")
				: null

			if (normalizedPhone) {
				update.phone = normalizedPhone
			} else {
				delete update.phone
				await UserModel.updateOne({ _id: req.params.id }, { $unset: { phone: "" } })
			}
		}

		if (req.body.password) {
			update.password = await bcrypt.hash(req.body.password, 10)
		}

		const currentUser = await UserModel.findById(req.params.id)

		if (!currentUser) {
			return res.status(404).json({ message: "User was not found" })
		}

		if (req.body.avatarFile?.base64Data) {
			const uploadedAvatar = await uploadBase64File(req.body.avatarFile, {
				bucket: "users",
				entityId: req.params.id,
				scope: "avatar",
			})

			if (currentUser.avatar) {
				await deleteFromBlob(currentUser.avatar)
			}

			update.avatar = uploadedAvatar.url
		} else if (Object.prototype.hasOwnProperty.call(req.body, "avatar") && req.body.avatar === null) {
			if (currentUser.avatar) {
				await deleteFromBlob(currentUser.avatar)
			}

			update.avatar = null
		}

		const user = await UserModel.findByIdAndUpdate(req.params.id, update, {
			new: true,
			runValidators: true,
		})

		return res.json({
			message: "User updated",
			data: sanitizeUser(user),
		})
	} catch (error) {
		console.error("Update user error:", error)
		if (error.code === 11000) {
			const field = Object.keys(error.keyPattern || error.keyValue || {})[0]
			return res.status(409).json({
				message:
					field === "email"
						? "User with this email already exists"
						: "User with this phone already exists",
			})
		}

		return res.status(500).json({ message: "Failed to update user" })
	}
}
