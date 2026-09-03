<script setup lang="ts">
import type { IOrganizationsUnit } from '~~/interfaces/IOrganizationsUnit'

defineProps<{
	organizationsUnit: IOrganizationsUnit | null
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
		$gsap.from('.organizations-unit__item', {
			opacity: 0,
			y: 40,
			duration: 1,
			stagger: 0.12,
			ease: 'power3.out',
			scrollTrigger: { trigger: '.organizations-unit__grid', start: 'top 72%' },
		})
	}, sectionRef.value)
})

onUnmounted(() => {
	ctx?.revert()
	ctx = null
})
</script>

<template>
	<section v-if="organizationsUnit" id="organizations-js" ref="sectionRef" class="organizations-unit offset">
		<div class="container">
			<LabelDecor :label="organizationsUnit.label" />

			<div class="organizations-unit__head">
				<h2 ref="titleRef" class="organizations-unit__title h2 title">{{ organizationsUnit.title }}</h2>
				<p class="organizations-unit__desc text-m">{{ organizationsUnit.desc }}</p>
			</div>

			<div class="organizations-unit__grid">
				<article v-for="benefit in organizationsUnit.benefits" :key="benefit.id" class="organizations-unit__item">
					<span class="organizations-unit__item-icon">
						<NuxtIcon :name="benefit.icon" filled />
					</span>

					<h3 class="organizations-unit__item-title text-xl">{{ benefit.title }}</h3>
					<p class="organizations-unit__item-text text-m">{{ benefit.text }}</p>
				</article>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/general/variables';

.organizations-unit {
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

		@media (min-width: variables.$mobile-big) {
			grid-template-columns: repeat(2, 1fr);
			gap: 24px;
		}
	}

	&__item {
		display: flex;
		flex-direction: column;
		padding: 28px 24px;
		background-color: variables.$glass-bg;
		border: 1px solid variables.$glass-border;
		border-radius: 16px;
		backdrop-filter: variables.$glass-blur;

		@media (min-width: variables.$desktop) {
			padding: 36px 32px;
		}
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
</style>
