<script setup lang="ts">
import type { ILinkWithFlag } from '~~/interfaces/IGeneral'
import type { ILinkWithTitle } from '~~/interfaces/ILinkWithTitle'
import { useGeneralStore } from '@/stores/storeGeneral'
import { useScreenHandler } from '@/composables/useScreenHandler'
import { screens } from '@/constants/index'

const storeGeneral = useGeneralStore()
const navigation = computed(() => storeGeneral.header?.navigation as ILinkWithFlag[] | undefined)
const tel = computed(() => storeGeneral.header?.tel as ILinkWithTitle | undefined)
const address = computed(() => storeGeneral.header?.address as { label: string; description: string } | undefined)
const { isMatchedScreen } = useScreenHandler(screens.desktop)

const isScrolled = ref<boolean>(false)

// Скролл шлёт события чаще кадра — читаем DOM один раз в rAF
// и трогаем ref только когда значение реально изменилось.
let ticking = false
const updateScrolled = () => {
	ticking = false
	const scrolled = window.scrollY > 20 || document.body.classList.contains('lock-js')
	if (scrolled !== isScrolled.value) isScrolled.value = scrolled
}
const handleScroll = () => {
	if (ticking) return
	ticking = true
	requestAnimationFrame(updateScrolled)
}
onMounted(() => {
	updateScrolled()
	window.addEventListener('scroll', handleScroll, { passive: true })
})
onUnmounted(() => {
	window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
	<header v-if="navigation" :class="['header', { scrolled: isScrolled }]">
		<div class="container">
			<div class="header__inner">
				<div class="header__left-side">
					<AppLogo size="small" />

					<div v-if="isMatchedScreen && address" class="header__address">
						<p class="header__address-label text-s">{{ address.label }}</p>
						<p class="header__address-description text-s">{{ address.description }}</p>
					</div>
				</div>

				<div v-if="isMatchedScreen" class="header__nav">
					<AppNav :links="navigation" variant-link="NuxtLink" direction="row" />
				</div>

				<div class="header__right-side">
					<a
						v-if="tel && !isMatchedScreen"
						class="header__tel-icon"
						:href="tel.url"
						:aria-label="`Позвонить: ${tel.label}`"
					>
						<NuxtIcon name="icon-phone" filled />
					</a>

					<UIButton
						v-if="tel && isMatchedScreen"
						as="a"
						:href="tel.url"
						variant="primary"
						size="small"
						:label="tel.label"
						:is-show-arrow="false"
					/>

					<div v-if="!isMatchedScreen" class="header__burger">
						<AppBurger />
					</div>
				</div>
			</div>
		</div>
	</header>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.header {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	min-height: 62px;
	padding: 8px 0;
	display: flex;
	align-items: center;

	// Полупрозрачное стекло: под шапкой должно просвечивать видео первого экрана.
	background-color: rgb(10 12 16 / 72%);
	backdrop-filter: variables.$glass-blur;
	border-bottom: 1px solid transparent;
	color: variables.$color-white;
	z-index: 997;
	transition:
		background-color 0.4s variables.$transition-bezier,
		border-color 0.4s variables.$transition-bezier;

	@media (min-width: variables.$desktop) {
		padding: 14px 0;
		min-height: 92px;
	}

	&.scrolled {
		background-color: rgb(10 12 16 / 92%);
		border-bottom-color: variables.$glass-border;
	}

	&__inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	&__left-side {
		display: flex;
		align-items: center;
		gap: 24px;
	}

	&__address {
		display: none;

		@media (min-width: variables.$desktop-big) {
			padding-left: 24px;
			display: flex;
			flex-direction: column;
			gap: 2px;
			border-left: 1px solid variables.$glass-border;
		}
	}

	&__address-label {
		color: variables.$color-white;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	&__address-description {
		color: variables.$color-gray-7;
	}

	&__right-side {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	&__tel-icon {
		width: 42px;
		height: 42px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid variables.$glass-border;
		border-radius: 6px;
		color: variables.$color-white;

		.nuxt-icon {
			width: 20px;
			height: 20px;
		}
	}
}
</style>
