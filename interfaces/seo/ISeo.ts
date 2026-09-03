export interface ISeo {
	h1: string
	title: string
	meta: [
		{
			name: string
			content: string
		},
		{
			name: string
			content: string
		},
		{
			name: string
			content: string
		},
	]
	canonical: string
}
