<script setup lang="ts">
import type { ITeamUnit } from '~~/interfaces/team/ITeamUnit'

defineProps<{
	teamUnit: ITeamUnit | null
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
		$gsap.from('.team-unit__item', {
			opacity: 0,
			y: 40,
			duration: 1,
			stagger: 0.12,
			ease: 'power3.out',
			scrollTrigger: { trigger: '.team-unit__grid', start: 'top 72%' },
		})
	}, sectionRef.value)
})

onUnmounted(() => {
	ctx?.revert()
	ctx = null
})
</script>

<template>
	<section v-if="teamUnit" id="team-js" ref="sectionRef" class="team-unit offset">
		<div class="container">
			<LabelDecor :label="teamUnit.label" />

			<div class="team-unit__head">
				<h2 ref="titleRef" class="team-unit__title h2 title">{{ teamUnit.title }}</h2>
				<p class="team-unit__desc text-m">{{ teamUnit.desc }}</p>
			</div>

			<div class="team-unit__grid">
				<div v-for="preview in teamUnit.previews" :key="preview.id" class="team-unit__item">
					<TeamPreview :preview="preview" />
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/general/variables';

.team-unit {
	background-color: variables.$color-background;

	&__head {
		margin-bottom: 32px;

		@media (min-width: variables.$desktop) {
			display: flex;
			gap: 60px;
			align-items: flex-end;
			justify-content: space-between;
			margin-bottom: 64px;
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
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;

		@media (min-width: variables.$tablet-big) {
			grid-template-columns: repeat(4, 1fr);
			gap: 24px;
		}
	}
}
</style>
