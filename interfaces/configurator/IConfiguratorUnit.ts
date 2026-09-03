import type { TID } from '~~/interfaces/TID'
import type { IImg } from '~~/interfaces/IImg'

export type TConfiguratorStepId = 'model' | 'exterior' | 'interior' | 'summary'

export type TConfiguratorGroupType = 'single' | 'multiple'

export interface IConfiguratorStep {
	id: TConfiguratorStepId
	num: string
	label: string
	title: string
}

export interface IConfiguratorModel {
	id: TID
	name: string
	category: string
	desc: string
	basePrice: number
	img: IImg
}

export interface IConfiguratorOption {
	id: TID
	name: string
	note: string
	price: number
	/** только для групп с type: 'single' — рисуется в карточке */
	icon?: string
}

export interface IConfiguratorGroup {
	id: TID
	step: TConfiguratorStepId
	title: string
	type: TConfiguratorGroupType
	options: IConfiguratorOption[]
}

export interface IConfiguratorSummary {
	title: string
	baseLabel: string
	optionsLabel: string
	emptyLabel: string
	note: string
}

export interface IConfiguratorUnit {
	label: string
	title: string
	titleAccent: string
	desc: string
	priceLabel: string
	pricePrefix: string
	prevLabel: string
	nextLabel: string
	includedLabel: string
	steps: IConfiguratorStep[]
	models: IConfiguratorModel[]
	groups: IConfiguratorGroup[]
	summary: IConfiguratorSummary
}
