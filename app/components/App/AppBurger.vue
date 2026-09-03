<script setup lang="ts">
import type { ILinkWithFlag } from '~~/interfaces/IGeneral'
import type { ILinkWithTitle } from '~~/interfaces/ILinkWithTitle'
import { useGeneralStore } from '@/stores/storeGeneral'
import { useScreenHandler } from '@/composables/useScreenHandler'
import { useMenuStore } from '@/stores/storeMenu'
import { useSwipeHandler } from '@/composables/useSwipeHandler'
import { screens } from '@/constants/index'

const route = useRoute()

const { isMatchedScreen } = useScreenHandler(screens.desktop)
const storeGeneral = useGeneralStore()
const navigation = computed(() => storeGeneral.header?.navigation as ILinkWithFlag[] | undefined)
const address = computed(() => storeGeneral.header?.address as { label: string; description: string } | undefined)
const tel = computed(() => storeGeneral.header?.tel as ILinkWithTitle | undefined)

const { handleAnchorClick } = useAnchorNav()

const storeMenu = useMenuStore()
const menuName = computed(() => storeMenu.menuName)
const toggleState = (name: string) => storeMenu.toggleState(name)

const navigationRef = ref<HTMLElement | null>(null)
const handleBurgerClick = () => {
	toggleState('navigation')
}

if (!isMatchedScreen.value) useSwipeHandler(navigationRef, 'navigation', 'left', screens.desktop)

watch(
	() => [route, route.name],
	() => {
		if (menuName.value === 'navigation') {
			toggleState(menuName.value)
		}
	},
	{
		deep: true,
		immediate: true,
	}
)
</script>

<template>
	<div v-if="navigation" class="burger">
		<button
			:class="['burger-btn', { active: menuName === 'navigation' }]"
			type="button"
			aria-label="Открыть меню"
			@click="handleBurgerClick"
		>
			<span :class="['burger-btn__label', { active: menuName === 'navigation' }]">
				<span class="visually-hidden">открыть меню</span>
			</span>
		</button>

		<div ref="navigationRef" :class="['burger-nav', { active: menuName === 'navigation' }]">
			<div class="burger-nav__inner">
				<div v-if="!isMatchedScreen && address" class="burger-nav__address">
					<p class="burger-nav__address-label text-m">{{ address.label }}</p>
					<p class="burger-nav__address-description text-s">{{ address.description }}</p>
				</div>
				<nav class="burger-nav__navigation">
					<ul class="burger-nav__navigation-list">
						<li v-for="(link, i) in navigation" :key="i" class="burger-nav__navigation-item">
							<a
								class="burger-nav__navigation-link text-m text-m_medium"
								:href="link.url"
								@click="handleAnchorClick(link.url, $event)"
							>
								{{ link.label }}
							</a>
						</li>
					</ul>
				</nav>

				<div v-if="!isMatchedScreen && tel" class="burger-nav__contacts">
					<UIButton as="a" :href="tel.url" variant="primary" size="small" :label="tel.label" :is-show-arrow="false" />
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

$burger-height: 2px;

.burger {
	display: flex;
	align-items: center;
	justify-content: center;
}

.burger-btn {
	position: relative;
	width: 24px;
	min-width: 24px;
	height: 18px;
	border: none;
	background-color: transparent;
	color: variables.$color-white;

	&::before,
	&::after {
		content: '';
	}

	&::before {
		top: 0;
	}

	&::after {
		bottom: 0;
	}

	&::before,
	&::after,
	&__label {
		position: absolute;
		left: 0;
		width: 100%;
		height: 2px;
		min-height: 2px;
		background-color: variables.$color-white;
		transition: 0.2s;
	}

	&__label {
		top: calc(50% - ($burger-height / 2));
		width: 100%;
		max-height: 2px !important;
		background-color: variables.$color-white;

		&.active {
			width: 100%;
			transform: rotate(45deg);
		}
	}

	&.active {
		color: variables.$color-white;

		&::after,
		&::before {
			top: calc(50% - ($burger-height / 2));
		}

		&::after {
			transform: rotate(-45deg);
		}

		&::before {
			transform: rotate(45deg);
		}
	}
}

.burger-nav {
	position: fixed;
	left: 0;
	top: 97px;
	bottom: 0;
	width: 100%;
	height: calc(100vh - 98px);
	padding-bottom: 145px;
	opacity: 0;
	visibility: hidden;
	overflow-y: auto;
	background-color: variables.$color-background;
	color: variables.$color-white;
	z-index: 998;
	transition:
		opacity 0.4s ease-in-out,
		visibility 0.4s ease-in-out;

	&.active {
		opacity: 1;
		visibility: visible;
		z-index: 998;
		color: variables.$color-white;
		transition:
			opacity 0.4s ease-in-out,
			visibility 0.4s ease-in-out;
	}

	&__inner {
		height: 100%;
		padding: 24px 16px;
		display: flex;
		flex-direction: column;
	}

	&__address {
		margin-bottom: 48px;
		display: flex;
		flex-direction: column;
	}

	&__address-label {
		margin-bottom: 4px;
		color: variables.$color-white;
		text-transform: uppercase;
	}

	&__address-description {
		color: variables.$color-gray-7;
	}

	&__navigation-item {
		margin-bottom: 32px;

		&:last-child {
			margin-bottom: 0;
		}
	}

	&__navigation-link-btn {
		display: flex;
		align-items: center;
		text-transform: uppercase;
		color: variables.$color-white;
	}

	&__navigation-link-btn-icon {
		margin-left: 8px;
		width: 18px;
		height: 18px;
		color: variables.$color-white;
		transform: translateY(-1px);
		transition: transform 0.3s ease;
	}

	&__navigation-list {
		margin-bottom: auto;
	}

	&__navigation-link {
		text-transform: uppercase;
		color: variables.$color-white;
	}

	&__contacts {
		margin-top: auto;
		width: fit-content;
		height: auto;
	}
}
</style>
