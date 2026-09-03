export interface ISelectOption {
	id: number | string
	name: string
	label: string
	value: string
	selected: boolean
}

export interface ISelect {
	name: string
	disabled: boolean
	options: ISelectOption[]
}
