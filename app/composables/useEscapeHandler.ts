import { onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import { useMenuStore } from '@/stores/storeMenu'

export const useEscapeHandler = (isMatchedScreen: Ref, menuName: Ref) => {
	const storeMenu = useMenuStore()
	const toggleState = (name: string) => storeMenu.toggleState(name)

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Escape' && menuName.value && isMatchedScreen) {
			toggleState(menuName.value)
		}
	}

	onMounted(() => {
		window.addEventListener('keydown', handleKeyDown)
	})
	onUnmounted(() => {
		window.removeEventListener('keydown', handleKeyDown)
	})
}
