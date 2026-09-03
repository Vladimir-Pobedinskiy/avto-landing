import type { ILinkWithTitle } from '~~/interfaces/ILinkWithTitle'
import type { ISocialLink } from '~~/interfaces/ISocialLink'

export interface ILinkWithFlag {
	url: string
	label: string
	isOtherPage: boolean
}

export interface IHeader {
	navigation: ILinkWithFlag[]
	tel: ILinkWithTitle
	address: {
		label: string
		description: string
	}
}

export interface IFooter {
	navigationMain: ILinkWithFlag[]
	navigationCompany: ILinkWithFlag[]
	contactsInfo: {
		phones: ILinkWithTitle[]
		email: ILinkWithTitle
	}
	copyright: string
	requisites: string
}

export type ISocials = ISocialLink[]

export interface IGeneral {
	header: IHeader
	footer: IFooter
	socials: ISocials
}
