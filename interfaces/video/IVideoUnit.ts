import type { ILink } from '~~/interfaces/ILink'

export interface IVideoUnit {
	label: string
	title: string
	text: string
	link: ILink
	video: {
		url: string
		poster: string
	}
}
