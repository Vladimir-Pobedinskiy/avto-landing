import type { ITeamPreview } from '~~/interfaces/team/ITeamPreview'

export interface ITeamUnit {
	label: string
	title: string
	desc: string
	previews: ITeamPreview[]
}
