import { ref, onMounted, onUnmounted } from 'vue'
import { useScrollController } from '@/composables/useScrollController'

export const useGLightbox = (selector: string) => {
	const gLightBox = ref<any | null>(null)

	const initGLightbox = async () => {
		if (typeof window !== 'undefined') {
			const GLightbox = (await import('glightbox')).default
			await import('glightbox/dist/css/glightbox.css')

			gLightBox.value = GLightbox({
				selector: selector,
				autoplayVideos: false,
				width: '100%',
				height: 'auto',
			})

			gLightBox.value.on('open', () => {
				document.body.classList.add('glightbox-gallery-js')
				if (document.body.classList.contains('glightbox-open')) document.body.classList.remove('glightbox-open')
				if (document.body.classList.contains('gscrollbar-fixer')) document.body.classList.remove('gscrollbar-fixer')
				if (document.documentElement.classList.contains('glightbox-open'))
					document.documentElement.classList.remove('glightbox-open')

				const nuxtRoot = document.getElementById('__nuxt')
				if (nuxtRoot) {
					nuxtRoot.removeAttribute('aria-hidden')
				}

				useScrollController.disableScroll()
			})

			gLightBox.value.on('close', () => {
				document.body.classList.remove('glightbox-gallery-js')
				useScrollController.enableScroll()
			})
		}
	}

	const destroyGLightbox = () => {
		if (typeof window !== 'undefined' && gLightBox.value) {
			gLightBox.value.destroy()
			gLightBox.value = null
		}
	}

	onMounted(() => {
		initGLightbox()
	})

	onUnmounted(() => {
		destroyGLightbox()
	})

	return {
		gLightBox,
		initGLightbox,
		destroyGLightbox,
	}
}
