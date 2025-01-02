
export function goTo(path, query = {}) {
	const router = useRouter()
	router.push({ path, query })
}