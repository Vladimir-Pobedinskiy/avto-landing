import type { TID } from '~~/interfaces/TID'

export interface IWhyUsItem {
	id: TID
	icon: string
	title: string
	text: string
}

export interface IWhyUsUnit {
	label: string
	title: string
	items: IWhyUsItem[]
}
