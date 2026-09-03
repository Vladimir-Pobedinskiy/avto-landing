<script setup lang="ts">
import type { INewsPreviewsUnit } from '~~/interfaces/news/INewsPreviewsUnit'

defineProps<{
	newsUnit: INewsPreviewsUnit | null
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
		$gsap.from('.news-unit__item', {
			opacity: 0,
			y: 40,
			duration: 1,
			stagger: 0.12,
			ease: 'power3.out',
			scrollTrigger: { trigger: '.news-unit__grid', start: 'top 72%' },
		})
	}, sectionRef.value)
})

onUnmounted(() => {
	ctx?.revert()
	ctx = null
})
</script>

<template>
	<section v-if="newsUnit" id="news-js" ref="sectionRef" class="news-unit offset">
		<div class="container">
			<LabelDecor :label="newsUnit.label" />

			<h2 ref="titleRef" class="news-unit__title h2 title title_margin">{{ newsUnit.title }}</h2>

			<div class="news-unit__grid">
				<div v-for="preview in newsUnit.previews" :key="preview.id" class="news-unit__item">
					<NewsPreview :preview="preview" />
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/general/variables';

.news-unit {
	background-color: variables.$color-background;

	&__title {
		will-change: transform, opacity;
	}

	&__grid {
		display: grid;
		grid-template-columns: 100%;
		gap: 16px;

		@media (min-width: variables.$mobile-big) {
			grid-template-columns: repeat(2, 1fr);
			gap: 24px;
		}

		@media (min-width: variables.$tablet-big) {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	&__item {
		display: flex;
	}
}
</style>
