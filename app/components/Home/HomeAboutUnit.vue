<script setup lang="ts">
import type { IHomeAboutUnit } from '~~/interfaces/IHomeAboutUnit'

defineProps<{
	aboutUnit: IHomeAboutUnit | null
	isLoading: boolean
}>()

const sectionRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const imgRef = ref<HTMLElement | null>(null)

useGsapAnimTitle(titleRef, sectionRef)

let ctx: any = null

onMounted(async () => {
	await nextTick()
	if (!import.meta.client || !sectionRef.value) return

	const { $gsap, $ScrollTrigger } = useNuxtApp() as any
	$gsap.registerPlugin($ScrollTrigger)

	ctx = $gsap.context(() => {
		$gsap.from('.home-about__text-block', {
			opacity: 0,
			y: 40,
			duration: 1,
			stagger: 0.12,
			ease: 'power3.out',
			scrollTrigger: { trigger: '.home-about__content', start: 'top 72%' },
		})

		// Счётчики: числа набегают, пока блок входит в кадр.
		const counters = sectionRef.value!.querySelectorAll<HTMLElement>('.home-about__counter-value')
		counters.forEach(counter => {
			const target = Number(counter.dataset.value ?? 0)
			const state = { value: 0 }

			$gsap.to(state, {
				value: target,
				duration: 1.6,
				ease: 'power2.out',
				scrollTrigger: { trigger: counter, start: 'top 78%', once: true },
				onUpdate: () => {
					counter.firstChild!.textContent = String(Math.round(state.value))
				},
			})
		})

		$gsap.from('.home-about__counter', {
			opacity: 0,
			y: 40,
			duration: 1,
			stagger: 0.12,
			ease: 'power3.out',
			scrollTrigger: { trigger: '.home-about__counters', start: 'top 75%' },
		})

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

		$gsap.to(imgRef.value, {
			yPercent: -12,
			ease: 'none',
			scrollTrigger: { trigger: '.home-about__visual', start: 'top bottom', end: 'bottom top', scrub: true },
		})
	}, sectionRef.value)
})

onUnmounted(() => {
	ctx?.revert()
	ctx = null
})
</script>

<template>
	<section v-if="aboutUnit" id="about-js" ref="sectionRef" class="home-about offset">
		<div class="container">
			<LabelDecor :label="aboutUnit.label" />

			<div class="home-about__inner">
				<div class="home-about__content">
					<h2 ref="titleRef" class="home-about__title h2 title">{{ aboutUnit.title }}</h2>
					<p class="home-about__text-block text-l">{{ aboutUnit.text }}</p>
					<p class="home-about__text-block text-m">{{ aboutUnit.textSecondary }}</p>
				</div>

				<div class="home-about__visual">
					<div class="home-about__img-wrapper">
						<img
							ref="imgRef"
							class="home-about__img"
							:src="aboutUnit.img.url"
							:alt="aboutUnit.img.alt"
							width="960"
							height="640"
							loading="lazy"
							decoding="async"
						/>
					</div>
				</div>
			</div>

			<dl class="home-about__counters">
				<div v-for="(counter, i) in aboutUnit.counters" :key="i" class="home-about__counter">
					<dt class="home-about__counter-value numeric-l" :data-value="counter.value">
						<span>0</span>{{ counter.suffix }}
					</dt>
					<dd class="home-about__counter-label text-m">{{ counter.label }}</dd>
				</div>
			</dl>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/general/variables';

.home-about {
	position: relative;
	background-color: variables.$color-background;

	&__inner {
		display: grid;
		grid-template-columns: 100%;
		gap: 32px;

		@media (min-width: variables.$desktop) {
			grid-template-columns: 1.1fr 1fr;
			align-items: center;
			gap: 80px;
		}
	}

	&__title {
		margin-bottom: 24px;
		will-change: transform, opacity;

		@media (min-width: variables.$desktop) {
			margin-bottom: 40px;
		}
	}

	&__text-block {
		margin-bottom: 20px;
		max-width: 640px;
		color: variables.$color-gray-7;

		&:last-child {
			margin-bottom: 0;
		}
	}

	&__img-wrapper {
		position: relative;
		overflow: hidden;
		border: 1px solid variables.$glass-border;
		border-radius: 16px;

		// Обрезаем запас, который параллакс уводит за границу.
		aspect-ratio: 4 / 3;
	}

	&__img {
		width: 100%;
		height: 118%;
		object-fit: cover;
	}

	&__counters {
		margin-top: 48px;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 24px;

		@media (min-width: variables.$desktop) {
			margin-top: 96px;
			grid-template-columns: repeat(4, 1fr);
			gap: 40px;
		}
	}

	&__counter {
		padding-top: 24px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		border-top: 1px solid variables.$glass-border;
	}

	&__counter-value {
		color: variables.$color-accent;
	}

	&__counter-label {
		color: variables.$color-gray-7;
	}
}
</style>
