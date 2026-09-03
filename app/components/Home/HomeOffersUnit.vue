<script setup lang="ts">
import type { IOffersUnit } from '~~/interfaces/IOffersUnit'

defineProps<{
	offersUnit: IOffersUnit | null
	isLoading: boolean
}>()

const sectionRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

useGsapAnimTitle(titleRef, sectionRef)

let ctx: any = null

onMounted(async () => {
	await nextTick()
	if (!import.meta.client || !sectionRef.value) return

	const { $gsap, $ScrollTrigger } = useNuxtApp() as any
	$gsap.registerPlugin($ScrollTrigger)

	ctx = $gsap.context(() => {
		$gsap.from('.home-offers__card', {
			opacity: 0,
			y: 40,
			duration: 1,
			stagger: 0.12,
			ease: 'power3.out',
			scrollTrigger: { trigger: '.home-offers__grid', start: 'top 72%' },
		})
	}, sectionRef.value)
})

onUnmounted(() => {
	ctx?.revert()
	ctx = null
})
</script>

<template>
	<section v-if="offersUnit" id="offers-js" ref="sectionRef" class="home-offers offset">
		<div class="container">
			<LabelDecor :label="offersUnit.label" />

			<div class="home-offers__head">
				<h2 ref="titleRef" class="home-offers__title h2 title">{{ offersUnit.title }}</h2>
				<p class="home-offers__desc text-m">{{ offersUnit.desc }}</p>
			</div>

			<div class="home-offers__grid">
				<article
					v-for="offer in offersUnit.offers"
					:key="offer.id"
					:class="['home-offers__card', 'hover-card', { featured: offer.isFeatured }]"
				>
					<span class="home-offers__card-glow" aria-hidden="true" />

					<div class="home-offers__card-head">
						<span class="home-offers__card-icon">
							<NuxtIcon :name="offer.icon" filled />
						</span>
						<span class="home-offers__card-note text-s">{{ offer.note }}</span>
					</div>

					<h3 class="home-offers__card-name h3">{{ offer.name }}</h3>
					<p class="home-offers__card-desc text-m">{{ offer.desc }}</p>

					<ul class="home-offers__card-options">
						<li v-for="(option, i) in offer.options" :key="i" class="home-offers__card-option text-m">
							{{ option }}
						</li>
					</ul>
				</article>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/general/variables';

.home-offers {
	background-color: variables.$color-background;

	&__head {
		margin-bottom: 32px;

		@media (min-width: variables.$desktop) {
			margin-bottom: 64px;
			display: flex;
			align-items: flex-end;
			justify-content: space-between;
			gap: 60px;
		}
	}

	&__title {
		margin-bottom: 16px;
		will-change: transform, opacity;

		@media (min-width: variables.$desktop) {
			margin-bottom: 0;
		}
	}

	&__desc {
		max-width: 460px;
		color: variables.$color-gray-7;
	}

	&__grid {
		display: grid;
		grid-template-columns: 100%;
		gap: 16px;

		@media (min-width: variables.$tablet) {
			grid-template-columns: repeat(3, 1fr);
			gap: 24px;
		}
	}

	&__card {
		padding: 28px 24px;
		position: relative;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border: 1px solid variables.$glass-border;
		border-radius: 16px;
		background-color: variables.$glass-bg;
		backdrop-filter: variables.$glass-blur;

		@media (min-width: variables.$desktop) {
			padding: 40px 32px;
		}

		&.featured {
			border-color: rgb(0 179 60 / 45%);
			background-color: rgb(0 179 60 / 7%);
		}
	}

	// Мягкое пятно в углу карточки — статичное, чтобы не жечь GPU в списке.
	&__card-glow {
		position: absolute;
		right: -80px;
		top: -80px;
		width: 220px;
		height: 220px;
		background: radial-gradient(circle, rgb(0 179 60 / 24%) 0%, rgb(0 179 60 / 0%) 70%);
		pointer-events: none;
	}

	&__card-head {
		margin-bottom: 24px;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	&__card-icon {
		width: 52px;
		height: 52px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		border: 1px solid variables.$glass-border;
		border-radius: 12px;
		color: variables.$color-accent;

		.nuxt-icon {
			width: 26px;
			height: 26px;
		}
	}

	&__card-note {
		padding: 6px 12px;
		border-radius: 100px;
		background-color: rgb(255 255 255 / 6%);
		color: variables.$color-gray-7;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	&__card-name {
		margin-bottom: 12px;
		position: relative;
		color: variables.$color-white;
		text-transform: uppercase;
	}

	&__card-desc {
		margin-bottom: 24px;
		position: relative;
		color: variables.$color-gray-7;
	}

	&__card-options {
		margin-top: auto;
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	&__card-option {
		padding-left: 22px;
		position: relative;
		color: variables.$color-white;

		&::before {
			content: '';
			position: absolute;
			left: 0;
			top: 8px;
			width: 8px;
			height: 8px;
			border-radius: 50%;
			background-color: variables.$color-accent;
			box-shadow: 0 0 10px rgb(0 179 60 / 70%);
		}
	}
}
</style>
