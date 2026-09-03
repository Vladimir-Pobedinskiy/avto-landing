import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IGeneral, IHeader, IFooter, ISocials } from '~~/interfaces/IGeneral'

export const useGeneralStore = defineStore('general', () => {
	const header = ref<IHeader | undefined>(undefined)
	const footer = ref<IFooter | undefined>(undefined)
	const socials = ref<ISocials | undefined>(undefined)

	const getGeneralData = async (baseUrl: string): Promise<void> => {
		const { data, error } = await useAsyncData('general-data', async () => {
			return $fetch<IGeneral>(`${baseUrl}/api/general/`)
		})

		if (error.value) {
			throw createError({
				status: error.value.status,
				message: error.value.message || 'Ошибка сервера',
			})
		}

		if (data.value) {
			header.value = data.value.header
			footer.value = data.value.footer
			socials.value = data.value.socials
		}
	}

	return { header, footer, socials, getGeneralData }
})
