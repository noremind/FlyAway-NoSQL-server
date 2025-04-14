export async function useApi(options = {}) {
	const config = useRuntimeConfig();
	const userStore = ref(useAuthStore());
	const commonStore = useCommonStore();
	// const { $i18n } = useNuxtApp();
	// const route = useRoute()
	// const locale = $i18n.locale;




	commonStore.setLoader(true);

	const headers = {
		Accept: "application/json",
		"Content-Type": "application/json",
		// "X-Localization": locale.value !== 'kz' ? locale.value : 'kk',
		...options?.headers,
	};

	if (userStore.value.getToken) {
		headers.Authorization = `Bearer ${userStore.value.getToken}`;
	}

	try {
		const response = await useFetch(options.url, {
			body: options?.data,
			method: options?.method || "get",
			baseURL: config.public.baseURL,
			params: options?.params || options?.query,
			headers,
		});

		const data = response?.data.value
		const error = response?.error.value?.data
		commonStore.setLoader(false);

		if (error) throw error

		return data;

	} catch (error) {
		if (error.statusCode === 401) {
			userStore.value.logoutUser()
		}
		throw error;
	}
};
