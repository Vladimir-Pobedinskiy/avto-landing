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
	/* Канонический адрес считается от SITE_URL, а не от адреса json-server:
	   в canonical должен идти адрес сайта, а не источника данных */
	const siteUrl = String(config.public.siteUrl || '').replace(/\/$/, '')
	const absoluteUrl = (path: string) => (path.startsWith('http') ? path : `${siteUrl}${path}`)

	if (data.value && data.value.seo) {
		const canonicalComputed = computed(() => ({
			rel: 'canonical',
			href: absoluteUrl(data.value?.seo?.canonical || route.path),
		}))
		useHead({
			title: `${data.value.seo?.title}`,
			link: [canonicalComputed.value],
		})
	}
	if (data.value && data.value.seo && data.value.seo.meta) useHead({ meta: [...data.value.seo.meta] })
	if (data.value) useSchemaOrg([...(data.value?.schemaOrg || [])])
}
