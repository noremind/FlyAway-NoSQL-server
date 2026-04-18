const devApiTarget = "http://localhost:3001"

const publicApiBase = process.env.NODE_ENV === "production"
		? process.env.SERVER_URL
		: "http://localhost:3001/api"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		"@primevue/nuxt-module",
		"nuxt-swiper",
		"@pinia/nuxt",
		"@nuxtjs/i18n",
	],

	app: {
		head: {
			meta: [{ name: "robots", content: "noindex, nofollow" }],
			script: process.env.NUXT_PUBLIC_YANDEX_MAPS_API_KEY
				? [
						{
							id: "yandex-maps-sdk",
							src: `https://api-maps.yandex.ru/2.1/?apikey=${process.env.NUXT_PUBLIC_YANDEX_MAPS_API_KEY}&lang=ru_RU`,
							type: "text/javascript",
							defer: true,
						},
					]
				: [],
		},
	},

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

	nitro: {
		devProxy: {
			"/api": {
				target: `${devApiTarget}/api`,
				changeOrigin: true,
			},
		},
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
					api: "modern-compiler",
					additionalData: `
          @use "@/assets/scss/variables.scss" as *;
        `,
				},
			},
		},
	},

	plugins: ["~/plugins/maska.ts"],

	css: [
		"@/assets/scss/normalize.scss",
		"@/assets/scss/index.scss",
		"@/assets/scss/icons.scss",
		"@/assets/scss/primevue/index.scss",
	],

	runtimeConfig: {
		apiProxyTarget:
			process.env.NUXT_API_PROXY_TARGET ||
			process.env.NUXT_DEV_API_TARGET ||
			process.env.SERVER_URL,
		public: {
			baseURL: publicApiBase,
			yandexMapsApiKey: process.env.NUXT_PUBLIC_YANDEX_MAPS_API_KEY || "",
		},
	},

	ssr: true,
	compatibilityDate: "2024-11-01",
	devtools: { enabled: true },
})
