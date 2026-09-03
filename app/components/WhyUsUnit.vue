<script setup lang="ts">
import type { IWhyUsUnit } from '~~/interfaces/IWhyUsUnit'

defineProps<{
	whyUsUnit: IWhyUsUnit | null
}>()

const sectionRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

useGsapAnimTitle(titleRef, sectionRef)

// Фоновая «дорожная разметка» крутится вечно — глушим её вне вьюпорта.
const { el: decorEl, isInView: decorInView } = useInView()

let ctx: any = null

onMounted(async () => {
	await nextTick()
	if (!import.meta.client || !sectionRef.value) return

	const { $gsap, $ScrollTrigger } = useNuxtApp() as any
	$gsap.registerPlugin($ScrollTrigger)

	ctx = $gsap.context(() => {
		$gsap.from('.why-us__item', {
			opacity: 0,
			y: 40,
			duration: 1,
			stagger: 0.12,
			ease: 'power3.out',
			scrollTrigger: { trigger: '.why-us__grid', start: 'top 72%' },
		})
	}, sectionRef.value)
})

onUnmounted(() => {
	ctx?.revert()
	ctx = null
})
</script>

<template>
	<section v-if="whyUsUnit" id="why-js" ref="sectionRef" class="why-us offset">
		<div ref="decorEl" :class="['why-us__road', { 'fx-paused': !decorInView }]" aria-hidden="true">
			<span class="why-us__road-dashes" />
		</div>

		<div class="container">
			<LabelDecor :label="whyUsUnit.label" />

			<h2 ref="titleRef" class="why-us__title h2 title title_margin">{{ whyUsUnit.title }}</h2>

			<div class="why-us__grid">
				<article v-for="(item, i) in whyUsUnit.items" :key="item.id" class="why-us__item">
					<span class="why-us__item-index numeric-m">{{ String(i + 1).padStart(2, '0') }}</span>

					<span class="why-us__item-icon">
						<NuxtIcon :name="item.icon" filled />
					</span>

					<h3 class="why-us__item-title text-xl">{{ item.title }}</h3>
					<p class="why-us__item-text text-m">{{ item.text }}</p>
				</article>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/general/variables';

.why-us {
	position: relative;
	overflow: hidden;
	background-color: variables.$color-surface;

	// Вертикальная «разметка» на фоне: бесконечно ползёт вниз, transform-only.
	&__road {
		position: absolute;
		top: 0;
		left: 50%;
		display: none;
		width: 2px;
		height: 100%;
		overflow: hidden;
		pointer-events: none;
		opacity: 0.25;
		transform: translateX(-50%);

		@media (min-width: variables.$desktop) {
			display: block;
		}
	}

	&__road-dashes {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 200%;
		background-image: repeating-linear-gradient(180deg, variables.$color-accent 0 28px, rgb(0 179 60 / 0%) 28px 72px);
		animation: road-dash 6s linear infinite;
	}

	&__title {
		position: relative;
		will-change: transform, opacity;
	}

	&__grid {
		position: relative;
		display: grid;
		grid-template-columns: 100%;
		gap: 16px;

		@media (min-width: variables.$mobile-big) {
			grid-template-columns: repeat(2, 1fr);
			gap: 24px;
		}
	}

	&__item {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: 28px 24px;
		overflow: hidden;
		background-color: variables.$glass-bg;
		border: 1px solid variables.$glass-border;
		border-radius: 16px;
		backdrop-filter: variables.$glass-blur;

		@media (min-width: variables.$desktop) {
			padding: 40px 36px;
		}
	}

	&__item-index {
		position: absolute;
		top: 16px;
		right: 20px;
		color: rgb(255 255 255 / 7%);
	}

	&__item-icon {
		display: flex;
		flex-shrink: 0;
		align-items: center;
		justify-content: center;
		width: 56px;
		height: 56px;
		margin-bottom: 24px;
		color: variables.$color-accent;
		background-color: rgb(0 179 60 / 10%);
		border: 1px solid rgb(0 179 60 / 35%);
		border-radius: 14px;

		.nuxt-icon {
			width: 28px;
			height: 28px;
		}
	}

	&__item-title {
		margin-bottom: 12px;
		font-family: variables.$font;
		font-weight: 700;
		color: variables.$color-white;
	}

	&__item-text {
		color: variables.$color-gray-7;
	}
}

@media (prefers-reduced-motion: reduce) {
	.why-us__road-dashes {
		animation: none !important;
	}
}
</style>
