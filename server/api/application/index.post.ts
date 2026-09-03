export default defineEventHandler(async event => {
	const config = useRuntimeConfig()
	const body = await readBody(event)

	const response: any = await $fetch(`${config.public.baseUrl}/api/application/`, {
		method: 'POST',
		body,
	})

	return { ...response }
})
