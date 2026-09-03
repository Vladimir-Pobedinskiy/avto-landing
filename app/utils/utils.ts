// priceFormatter
export const priceFormatter = (value: number) => {
	if (value === null || value === undefined) return ''
	if (value === 0) return '0 ₽'
	const parts = value.toString().split('.')
	if (parts[0]) parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0')
	return `${parts.join(',')} ₽`
}

/* getCurrentDate */
export const getCurrentDate = () => {
	const currentDate = new Date()
	const day = String(currentDate.getDate()).padStart(2, '0')
	const month = String(currentDate.getMonth() + 1).padStart(2, '0') // Месяцы начинаются с 0
	const year = currentDate.getFullYear()
	const hours = String(currentDate.getHours()).padStart(2, '0')
	const minutes = String(currentDate.getMinutes()).padStart(2, '0')
	const seconds = String(currentDate.getSeconds()).padStart(2, '0')

	return `${day}.${month}.${year}, ${hours}:${minutes}:${seconds}`
}

/* Склонение числительных */
export const declOfNum = (number: number, titles: string[]): string => {
	const cases = [2, 0, 1, 1, 1, 2]
	const index = (number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]) as number

	return `${titles[index]}`
}
