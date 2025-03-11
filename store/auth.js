export const useAuthStore = defineStore('auth', () => {
	const router = useRouter()
	const route = useRoute()

	const tokenCookie = useCookie("token", {
		maxAge: 604800,
	});

	const userCookie = useCookie("user", {
		maxAge: 604800,
	});

	const user = ref(userCookie.value);
	const token = ref(tokenCookie.value);

	const isOpenRegisteredModal = ref(null)
	const isOpenLoginModal = ref(null)
	const isMobileModal = ref(false)

	const isLoggedIn = computed(() => !!token.value);
	const getToken = computed(() => token.value);
	const getUser = computed(() => user.value);

	const setToken = (tokenInfo) => {
		token.value = tokenInfo
		tokenCookie.value = tokenInfo
	}

	const openAuthModalRegister = () => {
		isOpenRegisteredModal.value = true
	}
	const closeAuthModalRegister = () => {
		router.push({ path: route.path, query: {} })
		isOpenRegisteredModal.value = false
	}

	const openAuthModalLogin = () => {
		isOpenLoginModal.value = true
	}
	const closeAuthModalLogin = () => {
		router.push({ path: route.path, query: {} })
		isOpenLoginModal.value = false
	}

	const logoutUser = (route) => {
		tokenCookie.value = null
		userCookie.value = null
		router.push(route ? route : '/')
	}

	const setUser = () => {
		useApi({
			url: '/users/current-info',
			method: 'get'
		}).then(res => {
			userCookie.value = res
		})
	}

	watch(
		() => userCookie.value,
		(newVal) => {
			user.value = newVal;
		},
		{ immediate: true }
	);

	watch(
		() => tokenCookie.value,
		(newVal) => {
			token.value = newVal;
		},
		{ immediate: true }
	);

	return {
		user,
		token,
		isOpenRegisteredModal,
		isOpenLoginModal,
		isMobileModal,
		openAuthModalRegister,
		closeAuthModalRegister,
		openAuthModalLogin,
		closeAuthModalLogin,
		isLoggedIn,
		getToken,
		getUser,
		setUser,
		setToken,
		logoutUser
	};
});
