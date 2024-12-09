// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [ 
		"@primevue/nuxt-module",
		"nuxt-swiper",
		"@pinia/nuxt",
		"@nuxtjs/i18n"
	],

	components: {
    global: true,
    dirs: ["@/components"],
  },


	i18n: {
    strategy: "prefix_except_default",
    locales: [
      {
        code: "kz",
        language: "kz",
        file: { path: "kz.js", cache: false },
      },
      {
        code: "ru",
        language: "ru",
        file: { path: "ru.js", cache: false },
      },
    ],
    lazy: true,
    langDir: "../locale",
    defaultLocale: "kz",
  },

	pinia: {
    storesDirs: ["./store/**"],
  },

	// vue: {
  //   compilerOptions: {
  //     isCustomElement: (tag) => tag === 'SwiperSlide',
  //   },
  // },

	vite: {
    css: {
      preprocessorOptions: {
        scss: {
					api: 'modern-compiler',
          additionalData: `
          @use "@/assets/scss/variables.scss" as *;
        `,
        },
      },
    },
  },

	css: [
    "@/assets/scss/normalize.scss",
    "@/assets/scss/index.scss",
    "@/assets/scss/icons.scss",
    "@/assets/scss/primevue/index.scss",
  ],

	runtimeConfig: {
    public: {
      baseURL: process.env.VUE_APP_SERVER_URL,
    },
  },

	ssr: true,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false }
})
