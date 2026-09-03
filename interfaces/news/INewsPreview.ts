import type { IImg } from '~~/interfaces/IImg'
import type { TID } from '~~/interfaces/TID'

export interface INewsPreview {
	id: TID
	title: string
	desc: string
	date: string
	tag: string
	img: IImg
}
