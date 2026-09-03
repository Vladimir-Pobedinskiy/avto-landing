<script setup lang="ts">
import type { TSlider } from '~~/interfaces/TSlider'
import { Swiper } from 'swiper'
import { Navigation, Pagination, Autoplay, Keyboard, EffectCreative } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-creative'

defineProps<{
	slider: TSlider | null
	isLoading: boolean
}>()

const swiper = ref<Swiper | null>(null)
const swiperRef = ref<HTMLElement | null>(null)
const buttonPrevRef = ref<HTMLElement | null>(null)
const buttonNextRef = ref<HTMLElement | null>(null)
const paginationRef = ref<HTMLElement | null>(null)

const currentSlide = ref<number>(1)
const formatNum = (n: number) => String(n).padStart(2, '0')

const initSlider = () => {
	if (!swiperRef.value) return

	swiper.value = new Swiper(swiperRef.value, {
		modules: [Navigation, Pagination, Autoplay, Keyboard, EffectCreative],
		slidesPerView: 1,
		speed: 1000,
		spaceBetween: 4,
		keyboard: true,
		effect: 'creative',
		creativeEffect: {
			prev: {
				shadow: true,
				translate: [0, 0, -400],
			},
			next: {
				translate: ['100%', 0, 0],
			},
		},
		navigation: {
			prevEl: buttonPrevRef.value,
			nextEl: buttonNextRef.value,
		},
		pagination: {
			el: paginationRef.value,
			bulletClass: 'slider__pagination-bullet swiper-pagination-bullet',
			clickable: true,
		},
		autoplay: {
			delay: 8000,
		},
		on: {
			slideChange(s) {
				currentSlide.value = s.realIndex + 1
			},
		},
		breakpoints: {
			320: {
				slidesPerView: 1,
				spaceBetween: 8,
			},
		},
	})
}

onMounted(async () => {
	await nextTick()
	initSlider()
})
onUnmounted(() => {
	swiper.value?.destroy()
	swiper.value = null
})
</script>

<template>
	<section v-if="slider" class="slider">
		<div class="slider__inner">
			<div class="slider__content">
				<div ref="swiperRef" class="slider__swiper swiper">
					<div class="slider__inner swiper-wrapper">
						<div v-for="(item, index) in slider" :key="index" class="slider__slide swiper-slide">
							<div class="slider__slide-img-wrapper">
								<img :src="item.url" :alt="item.alt" class="slider__slide-img" />
							</div>
						</div>
					</div>

					<div class="container">
						<button
							v-if="slider && slider.length >= 2"
							ref="buttonPrevRef"
							class="slider__button-prev swiper-button-prev"
							type="button"
						>
							<span class="visually-hidden">К предыдущему слайду</span>
							<NuxtIcon class="slider__button-icon slider__button--prev-icon" name="icon-swiper-arrow" />
						</button>
						<button
							v-if="slider && slider.length >= 2"
							ref="buttonNextRef"
							class="slider__button-next swiper-button-next"
							type="button"
						>
							<span class="visually-hidden">К следующему слайду</span>
							<NuxtIcon class="slider__button-icon slider__button--next-icon" name="icon-swiper-arrow" />
						</button>

						<div v-if="slider.length > 1" class="slider__counter numeric-image-m">
							<div class="slider__counter-inner">
								<span class="slider__counter-active">{{ formatNum(currentSlide) }}</span
								>&nbsp;/&nbsp;
								<span class="slider__counter-total">{{ formatNum(slider.length) }}</span>
							</div>
						</div>
					</div>

					<div v-if="slider.length > 1" ref="paginationRef" class="slider__pagination swiper-pagination">
						<span class="visually-hidden">Пагинация</span>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.slider {
	overflow: hidden;

	&__swiper {
		position: relative;
		padding-bottom: 24px;

		@media (min-width: variables.$desktop) {
			padding-bottom: 0;
			margin-bottom: 40px;
		}
	}

	&__slide-img-wrapper {
		height: 200px;

		@media (min-width: variables.$mobile-big) {
			height: 350px;
		}

		@media (min-width: variables.$tablet) {
			height: 500px;
		}

		@media (min-width: variables.$desktop) {
			height: 804px;
		}

		@media (min-width: variables.$two-k-display) {
			height: 1072px;
		}

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			transform: translateY(1px);

			@media (min-width: variables.$two-k-display) {
				transform: translateY(2px);
			}
		}
	}

	&__navigation-wrapper {
		position: absolute;
	}

	&__button-prev.swiper-button-prev {
		position: absolute;
		top: 50%;
		left: 1%;
		z-index: 100;
		transform: translateY(-50%);

		@media (min-width: variables.$desktop) {
			left: 76px;
		}
	}

	&__button-next.swiper-button-next {
		position: absolute;
		top: 50%;
		right: 1%;
		z-index: 100;
		transform: translateY(-50%);

		@media (min-width: variables.$desktop) {
			right: 76px;
		}
	}

	&__button-prev.swiper-button-prev,
	&__button-next.swiper-button-next {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 14px;
		color: variables.$color-white;
		background-color: transparent;
		transition:
			background-color 0.5s ease-in-out,
			color 0.5s ease-in-out;

		&:not(:disabled):active {
			color: variables.$color-accent;
			transition: color 0.5s ease-in-out;
		}

		@media (min-width: variables.$tablet) {
			width: 54px;
			height: 24px;

			&:not(:disabled):hover {
				color: variables.$color-accent;
				transition: color 0.5s ease-in-out;
			}
		}
	}

	&__button-prev.swiper-button-prev.swiper-button-disabled,
	&__button-next.swiper-button-next.swiper-button-disabled {
		color: variables.$color-gray-4;
		cursor: default;
		background-color: transparent;
		border: none;
		opacity: 0.7;
		transition:
			background-color 0.5s ease-in-out,
			color 0.5s ease-in-out,
			opacity 0.5s ease-in-out;
	}

	&__button-icon {
		width: 32px;
		height: 14px;
		color: inherit;
		transition: color 0.5s ease-in-out;

		@media (min-width: variables.$tablet) {
			width: 54px;
			height: 24px;
		}
	}

	&__button--prev-icon {
		transform: rotate(-180deg);
	}

	&__pagination {
		position: absolute;
		bottom: 0;
		left: 50%;
		z-index: 100;
		display: flex;
		align-items: center;
		transform: translateX(-50%);

		@media (min-width: variables.$tablet) {
			bottom: 40px;
		}
	}

	&__pagination-bullet {
		display: block;
		width: 6px;
		height: 6px;
		margin-right: 8px;
		background-color: transparent;
		border: 1px solid variables.$color-white;
		border-radius: 50%;
		transition:
			background-color 0.5s ease-in-out,
			border-color 0.5s ease-in-out;

		@media (min-width: variables.$desktop) {
			width: 12px;
			height: 12px;
			margin-right: 16px;
		}

		&:last-child {
			margin-right: 0;
		}

		&.swiper-pagination-bullet-active {
			background-color: variables.$color-accent;
			border-color: variables.$color-accent;
			transition:
				background-color 0.5s ease-in-out,
				border-color 0.5s ease-in-out;
		}
	}

	.swiper-navigation-icon {
		display: none;
	}

	&__counter {
		position: absolute;
		bottom: 32px;
		left: 24px;
		z-index: 10;
		display: flex;
		gap: 4px;
		align-items: center;
		justify-content: flex-start;
		color: variables.$color-accent;

		@media (min-width: variables.$desktop) {
			bottom: 40px;
			left: 76px;
		}
	}

	&__counter-inner {
		display: flex;
		align-items: center;
		width: fit-content;
	}

	&__counter-active {
		display: flex;
		flex-shrink: 0;
		justify-content: flex-end;
		color: variables.$color-white;
	}

	&__counter-total {
		color: variables.$color-white;
		opacity: 0.58;
	}
}
</style>
