export const useCommonStore = defineStore('common', () => {
	const isLoader = ref(false)

	const setLoader = (boolean) => {
		isLoader.value = boolean
	}

	return {
		isLoader,
		setLoader
	}
})