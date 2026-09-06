// Shared handler for in-page anchor links (href="/#section").
// Same-page clicks scroll immediately; cross-page clicks navigate home and
// let the scroll plugin's router.afterEach perform the scroll once ready.
export const useAnchorNav = () => {
	const router = useRouter()
	const route = useRoute()
	// Адрес в строке браузера пишем сами, поэтому базовый префикс подставляем тоже сами:
	// router.push его добавляет, history.replaceState — нет
	const { assetUrl } = useAssetUrl()
	const { $scrollToAnchor } = useNuxtApp() as unknown as {
		$scrollToAnchor?: (id: string) => void
	}

	const handleAnchorClick = async (url: string, event: Event) => {
		const match = url.match(/^\/#(.+)/)
		if (!match?.[1]) return

		event.preventDefault()
		const id = match[1]

		if (route.path !== '/') {
			await router.push(`/#${id}`)
		} else {
			window.history.replaceState(null, '', assetUrl(`/#${id}`))
			$scrollToAnchor?.(id)
		}
	}

	return { handleAnchorClick }
}
