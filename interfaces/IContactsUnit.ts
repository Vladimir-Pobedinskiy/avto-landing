import type { IImg } from '~~/interfaces/IImg'
import type { ILinkWithTitle } from '~~/interfaces/ILinkWithTitle'

export interface IContactsUnit {
	title: string
	info: {
		phones: ILinkWithTitle[]
		email: ILinkWithTitle
		address: {
			title: string
			label: string
			description: string
		}
		operatingMode: {
			title: string
			mondayFriday: string
			saturdaySunday: string
		}
	}
	img: IImg
}
