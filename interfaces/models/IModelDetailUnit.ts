import type { TID } from '~~/interfaces/TID'
import type { ILink } from '~~/interfaces/ILink'
import type { TGallery } from '~~/interfaces/TGallery'
import type { IModelSpec } from '~~/interfaces/models/IModelsPreview'

export interface IModelDetailUnit {
	id: TID
	label: string
	name: string
	tagline: string
	forWhomTitle: string
	forWhom: string[]
	specsTitle: string
	specs: IModelSpec[]
	advantagesTitle: string
	advantages: string[]
	differencesTitle: string
	differences: string[]
	gallery: TGallery
	link: ILink
}
