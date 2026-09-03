import type { TID } from '~~/interfaces/TID'

export interface ICompareColumn {
	id: TID
	name: string
	recommendedFor: string
}

export interface ICompareRow {
	label: string
	values: string[]
}

export interface ICompareUnit {
	label: string
	title: string
	desc: string
	columns: ICompareColumn[]
	rows: ICompareRow[]
}
