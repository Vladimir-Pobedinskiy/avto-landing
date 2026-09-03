<script setup lang="ts">
import type { IModelsUnit } from '~~/interfaces/models/IModelsUnit'
import { Swiper } from 'swiper'
import { Navigation, Keyboard, A11y } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

defineProps<{
	modelsUnit: IModelsUnit | null
	isLoading: boolean
}>()

const sectionRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const swiperRef = ref<HTMLElement | null>(null)
const buttonPrevRef = ref<HTMLElement | null>(null)
const buttonNextRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)

useGsapAnimTitle(titleRef, sectionRef)

const swiper = ref<Swiper | null>(null)
let ctx: any = null

const initSlider = () => {
	if (!swiperRef.value) return

	swiper.value = new Swiper(swiperRef.value, {
		modules: [Navigation, Keyboard, A11y],
		slidesPerView: 1.08,
		spaceBetween: 16,
		speed: 700,
		keyboard: true,
		watchOverflow: true,
		navigation: {
			prevEl: buttonPrevRef.value,
			nextEl: buttonNextRef.value,
		},
		a11y: {
			prevSlideMessage: 'Предыдущая модель',
			nextSlideMessage: 'Следующая модель',
		},
		on: {
			// Полоса прогресса вместо буллетов: слайдов много, точки читаются плохо.
			progress(instance, progress) {
				if (!progressRef.value) return
				const value = Number.isFinite(progress) ? Math.min(Math.max(progress, 0), 1) : 0
				progressRef.value.style.transform = `scaleX(${0.14 + value * 0.86})`
			},
		},
		breakpoints: {
			576: { slidesPerView: 1.6, spaceBetween: 20 },
			992: { slidesPerView: 2.4, spaceBetween: 24 },
			1400: { slidesPerView: 3, spaceBetween: 24 },
		},
	})
}

onMounted(async () => {
	await nextTick()
	initSlider()

	if (!import.meta.client || !sectionRef.value) return

	const { $gsap, $ScrollTrigger } = useNuxtApp() as any
	$gsap.registerPlugin($ScrollTrigger)

	ctx = $gsap.context(() => {
		// Карточки выезжают волной; ScrollTrigger один на трек, а не на каждый слайд.
		$gsap.from('.models-unit__slide', {
			opacity: 0,
			y: 60,
			duration: 0.9,
			stagger: 0.12,
			ease: 'power3.out',
			scrollTrigger: { trigger: '.models-unit__slider', start: 'top 72%' },
		})
	}, sectionRef.value)
})

onUnmounted(() => {
	swiper.value?.destroy()
	swiper.value = null
	ctx?.revert()
	ctx = null
})
</script>

<template>
	<section v-if="modelsUnit" id="models-js" ref="sectionRef" class="models-unit offset">
		<div class="container">
			<LabelDecor :label="modelsUnit.label" />

			<div class="models-unit__head">
				<div class="models-unit__head-text">
					<h2 ref="titleRef" class="models-unit__title h2 title">{{ modelsUnit.title }}</h2>
					<p class="models-unit__desc text-m">{{ modelsUnit.desc }}</p>
				</div>

				<div class="models-unit__controls">
					<button ref="buttonPrevRef" class="models-unit__button" type="button">
						<span class="visually-hidden">Предыдущая модель</span>
						<NuxtIcon class="models-unit__button-icon models-unit__button-icon_prev" name="icon-arrow-right" filled />
					</button>
					<button ref="buttonNextRef" class="models-unit__button" type="button">
						<span class="visually-hidden">Следующая модель</span>
						<NuxtIcon class="models-unit__button-icon" name="icon-arrow-right" filled />
					</button>
				</div>
			</div>
		</div>

		<div class="models-unit__slider-wrapper">
			<div class="container">
				<div ref="swiperRef" class="models-unit__slider swiper">
					<div class="swiper-wrapper">
						<div v-for="preview in modelsUnit.previews" :key="preview.id" class="models-unit__slide swiper-slide">
							<ModelsPreview :preview="preview" />
						</div>
					</div>
				</div>

				<div class="models-unit__progress" aria-hidden="true">
					<span ref="progressRef" class="models-unit__progress-bar" />
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/general/variables';

.models-unit {
	position: relative;
	overflow: hidden;
	background-color: variables.$color-background;

	&__head {
		margin-bottom: 32px;

		@media (min-width: variables.$desktop) {
			display: flex;
			gap: 60px;
			align-items: flex-end;
			justify-content: space-between;
			margin-bottom: 56px;
		}
	}

	&__title {
		margin-bottom: 16px;
		will-change: transform, opacity;
	}

	&__desc {
		max-width: 620px;
		color: variables.$color-gray-7;
	}

	&__controls {
		display: none;
		flex-shrink: 0;
		gap: 12px;

		@media (min-width: variables.$desktop) {
			display: flex;
		}
	}

	&__button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 56px;
		height: 56px;
		color: variables.$color-white;
		cursor: pointer;
		background-color: variables.$glass-bg;
		border: 1px solid variables.$glass-border;
		border-radius: 50%;
		transition:
			border-color variables.$transition-duration variables.$transition-bezier,
			color variables.$transition-duration variables.$transition-bezier,
			background-color variables.$transition-duration variables.$transition-bezier;

		&:hover {
			color: variables.$color-accent;
			background-color: rgb(0 179 60 / 12%);
			border-color: rgb(0 179 60 / 60%);
		}

		&.swiper-button-disabled {
			pointer-events: none;
			cursor: default;
			opacity: 0.35;
		}
	}

	&__button-icon {
		width: 24px;
		height: 12px;

		&_prev {
			transform: rotate(180deg);
		}
	}

	// Слайдер выходит за контейнер вправо — карточка «подрезается» краем экрана.
	&__slider-wrapper {
		position: relative;
	}

	&__slider {
		overflow: visible;

		.swiper-slide {
			height: auto;
		}
	}

	&__slide {
		display: flex;
	}

	&__progress {
		width: 100%;
		height: 2px;
		margin-top: 32px;
		overflow: hidden;
		background-color: rgb(255 255 255 / 8%);

		@media (min-width: variables.$desktop) {
			margin-top: 48px;
		}
	}

	&__progress-bar {
		display: block;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, variables.$color-accent, variables.$color-accent-soft);
		transform: scaleX(0.14);
		transform-origin: left;
		transition: transform 0.3s variables.$transition-bezier;
	}
}
</style>
