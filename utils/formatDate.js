export function formatDate(dateStr, time = false) {
	const date = new Date(dateStr);
	const year = date.getUTCFullYear();
	const month = String(date.getUTCMonth() + 1).padStart(2, "0");
	const day = String(date.getUTCDate()).padStart(2, "0");

	let formattedDate = `${day}.${month}.${year}`;

	if (time) {
		const hours = String(date.getUTCHours()).padStart(2, "0");
		const minutes = String(date.getUTCMinutes()).padStart(2, "0");
		formattedDate += ` ${hours}:${minutes}`;
	}

	return formattedDate;
}