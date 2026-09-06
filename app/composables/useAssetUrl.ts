/* Адрес файла или изображения из db.json.

   Пути в данных абсолютны от корня сайта («/img/models/model-1.svg»). Когда лендинг
   собирается в подпапку домена (GitHub Pages), к ним нужен базовый префикс:
   NuxtLink подставляет его сам, обычные src, href и data-атрибуты — нет.
   В обычной сборке базовый путь равен «/», и адрес не меняется. */
export const useAssetUrl = () => {
	const config = useRuntimeConfig()
	const baseURL = config.app.baseURL || '/'

	const assetUrl = (url: string): string => {
		if (!url || baseURL === '/') return url
		// Внешние ссылки, якоря, tel/mailto и data: остаются как есть
		if (!url.startsWith('/')) return url

		return `${baseURL.replace(/\/$/, '')}${url}`
	}

	return { assetUrl }
}
