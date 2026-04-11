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
			script: [
				{
					src: "https://api-maps.yandex.ru/2.1/?apikey=YOUR_API_KEY&lang=ru_RU",
					type: "text/javascript",
					defer: true,
				},
			],
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
				target: "https://no-sql-project-server.vercel.app",
				changeOrigin: true,
				prependPath: true,
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

	pinia: {
		storesDirs: ["./store/**"],
	},

	runtimeConfig: {
		public: {
			baseURL: process.env.SERVER_URL,
			/* The line `// baseURL: process.env.SERVER_URL,` is a commented-out configuration option in the
      `runtimeConfig` section of the Nuxt.js configuration file. */
      /* The line `// baseURL: process.env.SERVER_URL,` is a commented-out configuration option in the
      `runtimeConfig` section of the Nuxt.js configuration file. */
      // baseURL: "http://localhost:3001/api/",
		},
	},

	ssr: true,
	compatibilityDate: "2024-11-01",
	devtools: { enabled: false },
})
