<script setup lang="ts">
import type { IVideoUnit } from '~~/interfaces/video/IVideoUnit'

defineProps<{
	videoUnit: IVideoUnit | null
}>()

const sectionRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const frameRef = ref<HTMLElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)

const isPlaying = ref<boolean>(false)
const isMuted = ref<boolean>(true)

useGsapAnimTitle(titleRef, sectionRef)

const togglePlay = () => {
	const video = videoRef.value
	if (!video) return

	if (video.paused) {
		video.play().catch(() => {})
	} else {
		video.pause()
	}
}

const toggleSound = () => {
	const video = videoRef.value
	if (!video) return

	video.muted = !video.muted
	isMuted.value = video.muted
}

const handlePlay = () => {
	isPlaying.value = true
}
const handlePause = () => {
	isPlaying.value = false
}

let ctx: any = null

onMounted(async () => {
	await nextTick()
	if (!import.meta.client || !sectionRef.value) return

	const video = videoRef.value
	video?.addEventListener('play', handlePlay)
	video?.addEventListener('pause', handlePause)

	const { $gsap, $ScrollTrigger } = useNuxtApp() as any
	$gsap.registerPlugin($ScrollTrigger)

	ctx = $gsap.context(() => {
		$gsap.from('.video-unit__content > *', {
			opacity: 0,
			y: 40,
			duration: 1,
			stagger: 0.12,
			ease: 'power3.out',
			scrollTrigger: { trigger: '.video-unit__content', start: 'top 72%' },
		})

		// Кадр «раскрывается» по мере входа в экран: только scale, без layout-свойств.
		if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			$gsap.fromTo(
				frameRef.value,
				{ scale: 0.88, yPercent: 4 },
				{
					scale: 1,
					yPercent: 0,
					ease: 'none',
					scrollTrigger: { trigger: frameRef.value, start: 'top 78%', end: 'top 30%', scrub: 1.4 },
				}
			)
		}

		// Ролик стартует сам, когда секция реально попала в кадр, и глушится при уходе —
		// звук из-за спины пользователя это худшее, что может сделать лендинг.
		$ScrollTrigger.create({
			trigger: sectionRef.value,
			start: 'top 60%',
			end: 'bottom 30%',
			onEnter: () => videoRef.value?.play().catch(() => {}),
			onEnterBack: () => videoRef.value?.play().catch(() => {}),
			onLeave: () => videoRef.value?.pause(),
			onLeaveBack: () => videoRef.value?.pause(),
		})
	}, sectionRef.value)
})

onBeforeUnmount(() => {
	const video = videoRef.value
	video?.removeEventListener('play', handlePlay)
	video?.removeEventListener('pause', handlePause)
	ctx?.revert()
	ctx = null
})
</script>

<template>
	<section v-if="videoUnit" id="video-js" ref="sectionRef" class="video-unit offset">
		<div class="container">
			<LabelDecor :label="videoUnit.label" />

			<div class="video-unit__content">
				<h2 ref="titleRef" class="video-unit__title h2 title">{{ videoUnit.title }}</h2>
				<p class="video-unit__text text-l">{{ videoUnit.text }}</p>
			</div>

			<div ref="frameRef" class="video-unit__frame">
				<video
					ref="videoRef"
					class="video-unit__video"
					:poster="videoUnit.video.poster"
					muted
					loop
					playsinline
					preload="metadata"
				>
					<source :src="videoUnit.video.url" type="video/mp4" />
				</video>

				<span class="video-unit__scrim" aria-hidden="true" />

				<div class="video-unit__controls">
					<button class="video-unit__control" type="button" @click="togglePlay">
						<span class="visually-hidden">{{ isPlaying ? 'Поставить на паузу' : 'Воспроизвести' }}</span>
						<NuxtIcon v-if="!isPlaying" class="video-unit__control-icon" name="icon-play" filled />
						<span v-else class="video-unit__pause" aria-hidden="true" />
					</button>

					<button class="video-unit__control video-unit__control_text" type="button" @click="toggleSound">
						<span class="button-typo">{{ isMuted ? 'Включить звук' : 'Выключить звук' }}</span>
					</button>
				</div>

				<div class="video-unit__cta">
					<UIButton as="a" :href="videoUnit.link.url" variant="primary" size="big" :label="videoUnit.link.label" />
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/general/variables';

.video-unit {
	position: relative;
	background-color: variables.$color-background;

	&__content {
		margin-bottom: 32px;
		max-width: 900px;

		@media (min-width: variables.$desktop) {
			margin-bottom: 56px;
		}
	}

	&__title {
		margin-bottom: 16px;
		will-change: transform, opacity;
	}

	&__text {
		max-width: 660px;
		color: variables.$color-gray-7;
	}

	&__frame {
		position: relative;
		aspect-ratio: 16 / 10;
		overflow: hidden;
		border: 1px solid variables.$glass-border;
		border-radius: 16px;
		background-color: variables.$color-surface;
		will-change: transform;

		@media (min-width: variables.$tablet) {
			aspect-ratio: 16 / 9;
			border-radius: 24px;
		}
	}

	&__video {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	&__scrim {
		position: absolute;
		inset: 0;
		background: linear-gradient(0deg, rgb(10 12 16 / 82%) 0%, rgb(10 12 16 / 0%) 55%);
		pointer-events: none;
	}

	&__controls {
		position: absolute;
		left: 16px;
		top: 16px;
		display: flex;
		align-items: center;
		gap: 8px;

		@media (min-width: variables.$desktop) {
			left: 24px;
			top: 24px;
			gap: 12px;
		}
	}

	&__control {
		height: 44px;
		min-width: 44px;
		padding: 0 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid variables.$glass-border;
		border-radius: 100px;
		background-color: rgb(10 12 16 / 62%);
		backdrop-filter: variables.$glass-blur;
		color: variables.$color-white;
		cursor: pointer;
		transition:
			border-color variables.$transition-duration variables.$transition-bezier,
			color variables.$transition-duration variables.$transition-bezier;

		&:hover {
			border-color: rgb(0 179 60 / 60%);
			color: variables.$color-accent;
		}

		&_text {
			text-transform: uppercase;
		}
	}

	&__control-icon {
		width: 16px;
		height: 16px;
	}

	&__pause {
		width: 14px;
		height: 16px;
		border-left: 4px solid currentcolor;
		border-right: 4px solid currentcolor;
	}

	&__cta {
		position: absolute;
		left: 16px;
		right: 16px;
		bottom: 16px;
		display: flex;
		justify-content: flex-start;

		@media (min-width: variables.$desktop) {
			left: 24px;
			right: 24px;
			bottom: 24px;
		}
	}
}
</style>
