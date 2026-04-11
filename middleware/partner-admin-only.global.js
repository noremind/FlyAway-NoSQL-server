export default defineNuxtRouteMiddleware((to) => {
  const userCookie = useCookie("user");
  const user = userCookie.value;

  if (user?.role === "partner" && !to.path.startsWith("/admin")) {
    return navigateTo("/admin");
  }
});
