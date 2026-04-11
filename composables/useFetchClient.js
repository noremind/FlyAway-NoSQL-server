export async function useFetchClient(options = {}) {
	const authStore = useAuthStore()

	const normalizeError = (error) => {
		return (
			error?.data ||
			error?.response?._data ||
			error?.response?.data ||
			error?.response || {
				message: error?.message || "Request failed",
			}
		)
	}

	const headers = {
		Accept: "application/json",
		// "Content-Type": options?.content_type || "application/json",
		"X-Localization": options.locale,
		"Authorization": `Bearer ${authStore.getToken || ""}`,
		...options?.headers,
	};

	try {
		const response = await $fetch(options.url, {
			body: options?.data || options?.body,
			method: options?.method || "get",
			baseURL: options.baseURL,
			params: options?.params || options?.query,
			headers,
		});

		const data = response

		return data;

	} catch (error) {
		const normalizedError = normalizeError(error)
		console.log(normalizedError)
		if (error?.response?.status === 401 || error?.statusCode === 401) {
			authStore.logout({ type: 'local' })
		}
		throw normalizedError;
	}
};
