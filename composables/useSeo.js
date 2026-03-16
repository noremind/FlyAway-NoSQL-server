export function useSeo({ title, description }) {
	let logotype = "https://flyaway-project.vercel.app/assets/logo/FlyAwayLogo-full.png";

	useSeoMeta({
		title: `FlyAway - ${title}`,
		ogTitle: `FlyAway - ${title}`,
		description: description,
		ogDescription: description,
		image: logotype,
		ogImage: logotype,
	});
}