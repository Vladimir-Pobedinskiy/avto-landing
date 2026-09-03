import type { IImg } from '~~/interfaces/IImg'
import type { TID } from '~~/interfaces/TID'

export interface IModelSpec {
	label: string
	value: string
}

export interface IModelsPreview {
	id: TID
	name: string
	category: string
	tagline: string
	price: string
	priceNote: string
	isAvailable: boolean
	availableLabel: string
	img: IImg
	specs: IModelSpec[]
}
