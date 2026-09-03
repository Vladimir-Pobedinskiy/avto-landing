export const useScrollController = {
	scrollPosition: 0,
	paddingOffset: 0,
	frozenPortrait: false,
	getScrollTrigger(): any {
		try {
			return useNuxtApp().$ScrollTrigger
		} catch {
			return null
		}
	},
	isPortrait(): boolean {
		return window.innerHeight >= window.innerWidth
	},
	freezeScrollTriggers() {
		this.frozenPortrait = this.isPortrait()
		this.getScrollTrigger()
			?.getAll()
			.forEach((trigger: any) => trigger.disable(false))
	},
	unfreezeScrollTriggers() {
		const scrollTrigger = this.getScrollTrigger()
		if (!scrollTrigger) return
		scrollTrigger.getAll().forEach((trigger: any) => trigger.enable())
		if (this.isPortrait() !== this.frozenPortrait) {
			// Ориентация сменилась, пока скролл был заблокирован, поэтому геометрия
			// триггеров устарела — нужен полный refresh() для пересчёта start/end.
			scrollTrigger.refresh()
		} else {
			// Разметка не изменилась, поэтому пропускаем reflow от refresh() и просто
			// пересинхронизируем прогресс от восстановленной позиции скролла.
			scrollTrigger.update()
		}
	},
	disableScroll() {
		this.scrollPosition = window.scrollY
		this.paddingOffset = window.innerWidth - document.documentElement.clientWidth
		this.freezeScrollTriggers()
		document.body.classList.add('lock-js')
		const header = document.querySelector('header') as HTMLElement
		const nav = document.querySelector('.nav') as HTMLElement
		if (header) header.style.paddingRight = `${this.paddingOffset}px`
		if (nav) nav.style.zIndex = '-1'
		document.body.style.cssText = `
			position: fixed;
      left: 0;
      top: -${this.scrollPosition}px;
      padding-right: ${this.paddingOffset}px;
      width: 100%;
    `
	},
	enableScroll() {
		document.body.classList.remove('lock-js')
		document.body.style.cssText = ''
		const header = document.querySelector('header') as HTMLElement
		const nav = document.querySelector('.nav') as HTMLElement
		if (header) header.style.paddingRight = '0px'
		if (nav) nav.style.zIndex = '1000'
		window.scrollTo({
			top: this.scrollPosition,
			behavior: 'auto',
		})
		this.unfreezeScrollTriggers()
	},
}
