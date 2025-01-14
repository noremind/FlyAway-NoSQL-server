export async function useApi(options = {}) {
	const config = useRuntimeConfig();
	// const store = ref(useAuthStore());
	// const commonStore = useCommonStore();
	// const { $i18n } = useNuxtApp();
	// const route = useRoute()
	// const locale = $i18n.locale;




	// commonStore.setLoader(true);
	// const tokenCookie = useCookie("token", {
	// 	maxAge: 604800,
	// });

	const headers = {
		Accept: "application/json",
		"Content-Type": "application/json",
		// "X-Localization": locale.value !== 'kz' ? locale.value : 'kk',
		...options?.headers,
	};

	// if (store.value.getToken) {
	// 	headers.Authorization = `Bearer ${tokenCookie.value}`;
	// }

	try {
		const response = await useFetch(options.url, {
			body: options?.data,
			method: options?.method || "get",
			baseURL: config.public.baseURL,
			params: options?.params || options?.query,
			headers,
		});

		const data = response?.data.value
		const error = response?.error.value

		if (error) throw error


		// commonStore.setLoader(false);
		console.log(data)
		return data;

	} catch (error) {
		throw error;
	}
};
