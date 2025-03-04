export default defineNuxtRouteMiddleware((to, from) => {
	const userStore = useAuthStore();

	if (!userStore?.isLoggedIn) {
		userStore?.openAuthModalRegister();
		return navigateTo("/");
	}
});

