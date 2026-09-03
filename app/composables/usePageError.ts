import type { Ref } from 'vue'
import type { NuxtError } from '#app'

export const usePageError = (error: Ref<NuxtError | undefined>) => {
	if (error.value) {
		throw createError({
			status: error.value.status,
			statusText: error.value.message,
			fatal: true,
		})
	}
}
