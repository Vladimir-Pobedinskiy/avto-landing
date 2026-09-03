import type { ILink } from '~~/interfaces/ILink'

export interface IHeroStat {
	value: string
	label: string
}

export interface IHomeHero {
	label: string
	title: string
	titleAccent: string
	desc: string
	link: ILink
	secondLink: ILink
	/** Фоновое видео первого экрана; poster показывается, пока ролик не загрузился */
	video: {
		url: string
		poster: string
	}
	stats: IHeroStat[]
}
