const partnerAllowedPaths = [
  "/admin",
  "/admin/profile",
  "/admin/tours",
  "/admin/tours/create",
  "/admin/hotels",
  "/admin/hotels/create",
];

const canPartnerOpenAdminPath = (path) => {
  return partnerAllowedPaths.some((allowedPath) => {
    if (path === allowedPath) return true;

    if (allowedPath === "/admin/tours" && path.startsWith("/admin/tours/")) {
      return true;
    }

    if (allowedPath === "/admin/hotels" && path.startsWith("/admin/hotels/")) {
      return true;
    }

    return false;
  });
};

export default defineNuxtRouteMiddleware(async (to) => {
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

  if (user.role === "partner" && !canPartnerOpenAdminPath(to.path)) {
    return navigateTo("/admin");
  }
});
