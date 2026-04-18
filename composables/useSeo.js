export function useSeo({ title, description }) {
	const logotype =
		"https://flyaway-project.vercel.app/assets/logo/FlyAwayLogo-full.png"

	const resolvedTitle = computed(() => {
		const value = unref(title)
		return value ? `FlyAway - ${value}` : "FlyAway"
	})

	const resolvedDescription = computed(() => {
		return unref(description) || "FlyAway"
	})

	useSeoMeta({
		title: resolvedTitle,
		ogTitle: resolvedTitle,
		description: resolvedDescription,
		ogDescription: resolvedDescription,
		image: logotype,
		ogImage: logotype,
	})
}
