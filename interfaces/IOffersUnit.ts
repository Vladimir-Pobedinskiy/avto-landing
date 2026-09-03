import type { TID } from '~~/interfaces/TID'

export interface IOffer {
	id: TID
	icon: string
	name: string
	desc: string
	note: string
	options: string[]
	isFeatured: boolean
}

export interface IOffersUnit {
	label: string
	title: string
	desc: string
	offers: IOffer[]
}
