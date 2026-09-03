// ScrollTrigger.refresh() — полный reflow
const REFRESH_DEBOUNCE = 150

// Верхняя граница дебаунса
const REFRESH_MAX_WAIT = 600

export default defineNuxtPlugin(nuxtApp => {
	const { $gsap, $ScrollTrigger } = useNuxtApp()
	$gsap.registerPlugin($ScrollTrigger)
	$ScrollTrigger.config({ limitCallbacks: true })

	/* --------------------------------------------------------------------- *
	 * Пересчёт геометрии. ScrollTrigger читает нативный scrollY, поэтому
	 * никакого отдельного жизненного цикла скролл-библиотеки не требуется.
	 * --------------------------------------------------------------------- */

	let refreshTimer: ReturnType<typeof setTimeout> | null = null
	let refreshFrame: number | null = null
	let firstRequestAt = 0
	let lastScrollHeight = 0

	const scheduleRefresh = (force = false) => {
		if (force) lastScrollHeight = 0

		const now = Date.now()
		if (!refreshTimer) firstRequestAt = now
		// Сдвигаем таймер только пока не упёрлись в потолок ожидания.
		else if (now - firstRequestAt >= REFRESH_MAX_WAIT) return
		else clearTimeout(refreshTimer)

		refreshTimer = setTimeout(() => {
			refreshTimer = null
			// Модалка держит body в position: fixed, а триггеры — намеренно
			// замороженными (см. useScrollController). Refresh сейчас испортил бы
			// геометрию; после закрытия модалки unfreezeScrollTriggers() сделает
			// пересчёт сам.
			if (document.body.classList.contains('lock-js')) return

			// Сверяемся с фактической высотой документа, чтобы не гонять reflow
			// на событиях, которые её не изменили.
			const scrollHeight = document.documentElement.scrollHeight
			if (scrollHeight === lastScrollHeight) return
			lastScrollHeight = scrollHeight

			if (refreshFrame) cancelAnimationFrame(refreshFrame)
			refreshFrame = requestAnimationFrame(() => {
				refreshFrame = null
				$ScrollTrigger.refresh()
			})
		}, REFRESH_DEBOUNCE)
	}

	// Высота документа растёт по трём независимым причинам, и ни одну из них
	// нельзя надёжно поймать одним источником — поэтому слушаем все три.

	// 1. Догрузилась картинка/видео/iframe. Их load не всплывает, слушаем в capture.
	document.addEventListener('load', () => scheduleRefresh(), true)

	// 2. Подмена фолбэк-шрифта на реальный меняет метрики текста, а значит и высоту блоков.
	document.fonts?.ready.then(() => scheduleRefresh())

	// 3. Прочий рост контента: раскрылся аккордеон, пришли данные.
	//    Наблюдаем .body-inner — он min-height: 100vh (не height!), поэтому его box
	//    честно растягивается под контент вместе с шапкой и футером.
	const contentObserver = new ResizeObserver(() => scheduleRefresh())
	const observeContent = () => {
		contentObserver.disconnect()
		const content = document.querySelector('.body-inner')
		if (content) contentObserver.observe(content)
	}

	/* --------------------------------------------------------------------- */

	const getHeaderHeight = (): number => {
		const header = document.querySelector('.header') as HTMLElement | null
		return header ? header.offsetHeight : 100
	}

	// Scrolls the section to the top, minus the fixed header height.
	const scrollToId = (id: string): boolean => {
		const target = document.getElementById(id)
		if (!target) return false

		const offset = -getHeaderHeight()
		const top = target.getBoundingClientRect().top + window.scrollY + offset
		window.scrollTo({ top, behavior: 'smooth' })
		return true
	}

	// Waits (via rAF) until the target element exists, instead of guessing a fixed timeout.
	const scrollToAnchor = (id: string, maxFrames = 150) => {
		if (!id) return
		let frames = 0
		const tick = () => {
			if (document.getElementById(id)) {
				scrollToId(id)
			} else if (++frames < maxFrames) {
				requestAnimationFrame(tick)
			}
		}
		requestAnimationFrame(tick)
	}

	const router = useRouter()

	router.afterEach(to => {
		if (to.hash) scrollToAnchor(to.hash.slice(1))
	})

	// page:finish срабатывает после того, как новая страница смонтирована и DOM обновлён
	nuxtApp.hook('page:finish', () => {
		observeContent()
		// Новая страница — новая высота, поэтому refresh нужен безусловно,
		// даже если scrollHeight совпал с предыдущим.
		scheduleRefresh(true)
	})
	nuxtApp.hook('app:mounted', () => {
		observeContent()
		scheduleRefresh(true)
	})

	return {
		provide: {
			scrollToAnchor,
		},
	}
})
