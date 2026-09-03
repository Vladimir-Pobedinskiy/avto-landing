import type { IImg } from '~~/interfaces/IImg'
import type { TID } from '~~/interfaces/TID'

export interface ITeamPreview {
	id: TID
	name: string
	position: string
	experience: string
	tel: string
	img: IImg
}
