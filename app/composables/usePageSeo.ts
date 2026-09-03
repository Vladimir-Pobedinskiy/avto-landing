import type { Ref } from 'vue'
import type { ISeo } from '~~/interfaces/seo/ISeo'
import type { ISchemaOrg } from '~~/interfaces/seo/ISchemaOrg'

interface SeoData {
	seo: ISeo
	schemaOrg: ISchemaOrg
}

export const usePageSeo = (data: Ref<SeoData | null | undefined>) => {
	const route = useRoute()
	const config = useRuntimeConfig()

	if (data.value && data.value.seo) {
		const canonicalComputed = computed(() => {
			return data.value?.seo?.canonical
				? { rel: 'canonical', href: data.value.seo.canonical }
				: { rel: 'canonical', href: `${config.public.baseUrl}${route.path}` }
		})
		useHead({
			title: `${data.value.seo?.title}`,
			link: [canonicalComputed.value],
		})
	}
	if (data.value && data.value.seo && data.value.seo.meta) useHead({ meta: [...data.value.seo.meta] })
	if (data.value) useSchemaOrg([...(data.value?.schemaOrg || [])])
}
