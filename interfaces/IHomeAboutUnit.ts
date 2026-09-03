import type { IImg } from '~~/interfaces/IImg'

export interface IAboutCounter {
	value: number
	suffix: string
	label: string
}

export interface IHomeAboutUnit {
	label: string
	title: string
	text: string
	textSecondary: string
	img: IImg
	counters: IAboutCounter[]
}
