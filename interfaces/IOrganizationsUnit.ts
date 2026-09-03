import type { TID } from '~~/interfaces/TID'

export interface IOrganizationBenefit {
	id: TID
	icon: string
	title: string
	text: string
}

export interface IOrganizationsUnit {
	label: string
	title: string
	desc: string
	benefits: IOrganizationBenefit[]
}
