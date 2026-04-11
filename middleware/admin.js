export default defineNuxtRouteMiddleware(async () => {
  const tokenCookie = useCookie("token");
  const userCookie = useCookie("user");

  if (!tokenCookie.value) {
    return navigateTo("/");
  }

  let user = userCookie.value;

  if (!user?.role) {
    try {
      const config = useRuntimeConfig();
      const response = await $fetch("/auth/me", {
        baseURL: config.public.baseURL,
        headers: {
          Authorization: `Bearer ${tokenCookie.value}`,
        },
      });

      user = response.data;
      userCookie.value = user;
    } catch (error) {
      tokenCookie.value = null;
      userCookie.value = null;
      return navigateTo("/");
    }
  }

  if (!["admin", "partner"].includes(user.role)) {
    return navigateTo("/");
  }
});
