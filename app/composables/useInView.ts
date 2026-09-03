// Reports whether an element is in (or near) the viewport, so heavy always-on
// animations (e.g. the fire layers) can be paused while off-screen instead of
// repainting every frame across the whole page.
export const useInView = (rootMargin = '200px') => {
	const el = ref<HTMLElement | null>(null)
	// Default true so SSR / no-JS renders the animation running; the observer
	// takes over on mount.
	const isInView = ref(true)

	let observer: IntersectionObserver | null = null

	onMounted(() => {
		if (!el.value || typeof IntersectionObserver === 'undefined') return
		isInView.value = false
		observer = new IntersectionObserver(
			entries => {
				isInView.value = entries[0]?.isIntersecting ?? false
			},
			{ rootMargin }
		)
		observer.observe(el.value)
	})

	onBeforeUnmount(() => {
		observer?.disconnect()
		observer = null
	})

	return { el, isInView }
}
