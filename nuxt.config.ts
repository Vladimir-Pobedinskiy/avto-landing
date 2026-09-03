import { checker } from 'vite-plugin-checker'

export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	typescript: {
		tsConfig: {
			compilerOptions: {
				module: 'ESNext',
				target: 'ESNext',
			},
		},
	},
	devServer: {
		port: 3000,
		host: '0.0.0.0',
	},
	devtools: { enabled: false },
	router: {
		// https://router.vuejs.org/api/interfaces/routeroptions.html
		options: {
			linkActiveClass: 'active',
			linkExactActiveClass: 'active-exact',
		},
	},
	app: {
		layoutTransition: { name: 'layout', mode: 'out-in' },
		pageTransition: { name: 'page', mode: 'out-in' },
		head: {
			htmlAttrs: { lang: 'ru' },
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{ name: 'format-detection', content: 'telephone=no' },
				{ name: 'msapplication-TileColor', content: '#0a0c10' },
				{ name: 'theme-color', content: '#0a0c10' },
				{ name: 'apple-mobile-web-app-title', content: 'DRIVE RENT' },
			],
			link: [
				// Локальных woff2 нет — гротески тянем с Google Fonts (font-display: swap внутри).
				{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
				{ rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
				{
					rel: 'stylesheet',
					href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&family=Inter:wght@400;500;600&display=swap',
				},
				{ rel: 'icon', type: 'image/svg+xml', href: '/favicon/favicon.svg' },
			],
		},
	},
	modules: [
		'nuxt-icons',
		'@hypernym/nuxt-gsap',
		'@nuxt/eslint',
		'nuxt-schema-org',
		'@pinia/nuxt',
		'pinia-plugin-persistedstate/nuxt',
		'@formkit/auto-animate/nuxt',
		'floating-vue/nuxt',
	],
	piniaPluginPersistedstate: {
		storage: 'localStorage',
		cookieOptions: {
			sameSite: 'lax',
		},
		debug: true,
	},
	gsap: {
		extraPlugins: {
			scrollTrigger: true,
		},
	},
	css: ['~/assets/css/main.css', '~/assets/scss/main.scss', 'vue-final-modal/style.css'],
	vite: {
		plugins: [
			checker({
				eslint: {
					useFlatConfig: true,
					lintCommand: 'eslint "./**/*.{ts,js,vue}"',
				},
				stylelint: {
					lintCommand: 'stylelint "**/*.{vue,css,scss}"',
				},
			}) as any, // TODO: убрать после обновления vite-plugin-checker (типы hotUpdate несовместимы)
		],
		optimizeDeps: {
			include: [
				'glightbox',
				'gsap',
				'gsap/ScrollTrigger',
				'vue-imask',
				'vue-final-modal',
				'typograf',
				'split-type',
				'@vueuse/core',
				'vee-validate',
				'yup',
				'lodash.clonedeep',
				'swiper',
				'swiper/modules',
			],
		},
	},
	runtimeConfig: {
		public: {
			baseUrl: process.env.BASE_URL,
		},
	},
})
