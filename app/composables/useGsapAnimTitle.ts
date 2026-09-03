import SplitType from 'split-type'
import type { Ref } from 'vue'

export function useGsapAnimTitle(titleRef: Ref<HTMLElement | null>, triggerRef: Ref<HTMLElement | null>) {
	if (!titleRef || !triggerRef) return

	const nuxtApp = useNuxtApp()

	let ctx: any = null

	const wrapWordsInDivs = (element: HTMLElement) => {
		const text = element.textContent || ''
		element.innerHTML = ''

		const words = text.split(/\s+/).filter(word => word.length > 0)

		words.forEach((word, index) => {
			const wordDiv = document.createElement('div')
			wordDiv.style.display = 'inline-block'
			wordDiv.style.whiteSpace = 'nowrap'
			wordDiv.textContent = word

			element.appendChild(wordDiv)

			// Add space after word (except last one)
			if (index < words.length - 1) {
				element.appendChild(document.createTextNode(' '))
			}
		})
	}

	const animate = () => {
		const { $gsap, $ScrollTrigger } = nuxtApp as any
		$gsap.registerPlugin($ScrollTrigger)

		// Split each word div into characters
		const wordDivs = titleRef.value!.querySelectorAll('div')
		const allChars: HTMLElement[] = []

		wordDivs.forEach(wordDiv => {
			const splitWord = new SplitType(wordDiv, { types: 'chars' })
			allChars.push(...(splitWord.chars || []))
		})

		if (allChars.length > 0) {
			$gsap.from(allChars, {
				opacity: 0,
				y: 5,
				duration: 1,
				stagger: { amount: 1.2 },
				scrollTrigger: {
					trigger: triggerRef.value,
					start: 'top 72%',
					end: '+=55%',
					scrub: 1.6,
					fastScrollEnd: true,
				},
			})
		}
	}

	onMounted(async () => {
		await nextTick()
		if (import.meta.client && titleRef.value) {
			const { $gsap } = nuxtApp as any

			// Wrap words in divs first
			wrapWordsInDivs(titleRef.value)

			ctx = $gsap.context(animate)
		}
	})

	onUnmounted(() => {
		ctx?.revert()
		ctx = null
	})
}
