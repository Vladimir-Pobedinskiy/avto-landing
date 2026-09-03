<script setup lang="ts">
import type { IHomeHero } from '~~/interfaces/IHomeHero'

defineProps<{
	homeHero: IHomeHero | null
	isLoading: boolean
}>()

const sectionRef = ref<HTMLElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

const { handleAnchorClick } = useAnchorNav()

let ctx: any = null

onMounted(async () => {
	await nextTick()
	if (!import.meta.client || !sectionRef.value) return

	const { $gsap, $ScrollTrigger } = useNuxtApp() as any
	$gsap.registerPlugin($ScrollTrigger)

	// Autoplay может быть отклонён политикой браузера — тогда просто остаётся poster.
	videoRef.value?.play().catch(() => {})

	ctx = $gsap.context(() => {
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

		// Вход первого экрана: строки заголовка поднимаются со сдвигом,
		// следом — описание, кнопки и цифры.
		const lines = titleRef.value?.querySelectorAll('.home-hero__title-line') ?? []
		const tl = $gsap.timeline({ defaults: { ease: 'power3.out' } })

		if (lines.length) {
			tl.from(lines, { yPercent: 110, opacity: 0, duration: 1.1, stagger: 0.12 })
		}
		tl.from('.home-hero__label', { opacity: 0, y: 20, duration: 0.7 }, 0.1)
			.from('.home-hero__desc', { opacity: 0, y: 24, duration: 0.8 }, '-=0.6')
			.from('.home-hero__actions > *', { opacity: 0, y: 24, duration: 0.7, stagger: 0.1 }, '-=0.5')
			.from('.home-hero__stat', { opacity: 0, y: 28, duration: 0.7, stagger: 0.1 }, '-=0.5')

		if (reduced) return

		// Параллакс по скроллу: видео уходит медленнее контента, кадр слегка
		// приближается — глубина без единого layout-свойства.
		$gsap.to(videoRef.value, {
			yPercent: 18,
			scale: 1.12,
			ease: 'none',
			scrollTrigger: {
				trigger: sectionRef.value,
				start: 'top top',
				end: 'bottom top',
				scrub: true,
			},
		})

		$gsap.to(contentRef.value, {
			yPercent: -14,
			opacity: 0,
			ease: 'none',
			scrollTrigger: {
				trigger: sectionRef.value,
				start: 'top top',
				end: 'bottom 30%',
				scrub: true,
			},
		})
	}, sectionRef.value)
})

onUnmounted(() => {
	ctx?.revert()
	ctx = null
})
</script>

<template>
	<section v-if="homeHero" ref="sectionRef" class="home-hero">
		<div class="home-hero__media" aria-hidden="true">
			<video
				ref="videoRef"
				class="home-hero__video"
				:poster="homeHero.video.poster"
				muted
				loop
				playsinline
				autoplay
				preload="metadata"
			>
				<source :src="homeHero.video.url" type="video/mp4" />
			</video>
			<span class="home-hero__scrim" />
			<span class="home-hero__grain" />
		</div>

		<div class="container">
			<div ref="contentRef" class="home-hero__content">
				<p class="home-hero__label text-s">{{ homeHero.label }}</p>

				<h1 ref="titleRef" class="home-hero__title h1">
					<span class="home-hero__title-mask">
						<span class="home-hero__title-line">{{ homeHero.title }}</span>
					</span>
					<span class="home-hero__title-mask">
						<span class="home-hero__title-line accent-text">{{ homeHero.titleAccent }}</span>
					</span>
				</h1>

				<p class="home-hero__desc text-l">{{ homeHero.desc }}</p>

				<div class="home-hero__actions">
					<UIButton
						as="a"
						:href="homeHero.link.url"
						variant="primary"
						size="big"
						:label="homeHero.link.label"
						@click="handleAnchorClick(homeHero.link.url, $event)"
					/>
					<UIButton
						as="a"
						:href="homeHero.secondLink.url"
						variant="second"
						size="big"
						:label="homeHero.secondLink.label"
						@click="handleAnchorClick(homeHero.secondLink.url, $event)"
					/>
				</div>

				<dl class="home-hero__stats">
					<div v-for="(stat, i) in homeHero.stats" :key="i" class="home-hero__stat">
						<dt class="home-hero__stat-value numeric-m">{{ stat.value }}</dt>
						<dd class="home-hero__stat-label text-s">{{ stat.label }}</dd>
					</div>
				</dl>
			</div>
		</div>

		<span class="home-hero__scroll-hint" aria-hidden="true">
			<span class="home-hero__scroll-dot" />
		</span>
	</section>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/general/variables';

.home-hero {
	position: relative;
	min-height: 640px;

	// Вычитаем шапку, чтобы первый экран занимал ровно видимую область.
	height: calc(100svh - 62px);
	display: flex;
	align-items: center;
	overflow: hidden;
	isolation: isolate;

	@media (min-width: variables.$desktop) {
		height: calc(100svh - 92px);
		min-height: 720px;
	}

	&__media {
		position: absolute;
		inset: 0;
		z-index: -1;
		overflow: hidden;
	}

	&__video {
		width: 100%;
		height: 100%;
		object-fit: cover;

		// GSAP двигает элемент, поэтому запас по высоте — чтобы не оголить край.
		transform-origin: center 40%;
	}

	// Затемнение: слева темнее, чтобы текст читался на любом кадре.
	&__scrim {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(90deg, rgb(10 12 16 / 92%) 0%, rgb(10 12 16 / 70%) 42%, rgb(10 12 16 / 25%) 100%),
			linear-gradient(0deg, variables.$color-background 2%, rgb(10 12 16 / 0%) 45%);
	}

	&__grain {
		position: absolute;
		inset: 0;
		opacity: 0.5;
		background-image: repeating-linear-gradient(0deg, rgb(255 255 255 / 2%) 0 1px, rgb(0 0 0 / 0%) 1px 3px);
		mix-blend-mode: overlay;
		pointer-events: none;
	}

	&__content {
		padding: 80px 0 100px;
		max-width: 860px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;

		@media (min-width: variables.$desktop) {
			padding: 60px 0;
		}
	}

	&__label {
		margin-bottom: 20px;
		padding: 8px 16px;
		border: 1px solid variables.$glass-border;
		border-radius: 100px;
		background-color: variables.$glass-bg;
		backdrop-filter: variables.$glass-blur;
		color: variables.$color-gray-7;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	&__title {
		margin-bottom: 24px;
		color: variables.$color-white;
		text-transform: uppercase;
	}

	// Маска обрезает строку, пока GSAP поднимает её снизу.
	&__title-mask {
		display: block;
		overflow: hidden;
	}

	&__title-line {
		display: block;
		will-change: transform;
	}

	&__desc {
		margin-bottom: 36px;
		max-width: 560px;
		color: variables.$color-gray-7;
	}

	&__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;

		@media (min-width: variables.$tablet) {
			gap: 16px;
		}
	}

	&__stats {
		margin-top: 48px;
		display: grid;
		grid-template-columns: repeat(3, auto);
		gap: 20px;

		@media (min-width: variables.$tablet) {
			gap: 56px;
		}
	}

	&__stat {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	&__stat-value {
		color: variables.$color-white;
	}

	&__stat-label {
		color: variables.$color-gray-7;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	&__scroll-hint {
		position: absolute;
		left: 50%;
		bottom: 24px;
		width: 26px;
		height: 42px;
		display: none;
		justify-content: center;
		transform: translateX(-50%);
		border: 1px solid variables.$glass-border;
		border-radius: 100px;

		@media (min-width: variables.$desktop) {
			display: flex;
		}
	}

	&__scroll-dot {
		margin-top: 8px;
		width: 4px;
		height: 8px;
		border-radius: 4px;
		background-color: variables.$color-accent;
		animation: scroll-hint 2s ease-in-out infinite;
	}
}

@media (prefers-reduced-motion: reduce) {
	.home-hero__scroll-dot {
		animation: none !important;
	}
}
</style>
