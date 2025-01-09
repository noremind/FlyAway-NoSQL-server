export const useAuthStore = defineStore('auth', () => {
	const isRegistered = ref(false)
	const isMobileModal = ref(false)

	const openAuthModal = () => {
		isRegistered.value = true
	}

	const closeAuthModal = () => {
		isRegistered.value = false
	}

	return {
		isRegistered,
		isMobileModal,
		openAuthModal,
		closeAuthModal,
	};
});
