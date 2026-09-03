import type { IModelsPreview } from '~~/interfaces/models/IModelsPreview'

export interface IModelsUnit {
	label: string
	title: string
	desc: string
	previews: IModelsPreview[]
}
