<script setup lang="ts">
import type { IModelDetailUnit } from '~~/interfaces/models/IModelDetailUnit'

const props = defineProps<{
	modelDetail: IModelDetailUnit | null
	sectionId: string
}>()

const { handleAnchorClick } = useAnchorNav()

const sectionRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

useGsapAnimTitle(titleRef, sectionRef)

const gallerySelector = computed(() => `#${props.sectionId} .model-detail__gallery-item`)
useGLightbox(gallerySelector.value)

let ctx: any = null

onMounted(async () => {
	await nextTick()
	if (!import.meta.client || !sectionRef.value) return

	const { $gsap, $ScrollTrigger } = useNuxtApp() as any
	$gsap.registerPlugin($ScrollTrigger)

	ctx = $gsap.context(() => {
		$gsap.from('.model-detail__block', {
			opacity: 0,
			y: 40,
			duration: 1,
			stagger: 0.12,
			ease: 'power3.out',
			scrollTrigger: { trigger: '.model-detail__content', start: 'top 72%' },
		})
	}, sectionRef.value)
})

onUnmounted(() => {
	ctx?.revert()
	ctx = null
})

// Пути к файлам из db.json: в подпапке домена им нужен базовый префикс
const { assetUrl } = useAssetUrl()
</script>

<template>
	<section v-if="modelDetail" :id="sectionId" ref="sectionRef" class="model-detail offset">
		<div class="container">
			<LabelDecor :label="modelDetail.label" />

			<div class="model-detail__head">
				<h2 ref="titleRef" class="model-detail__title h2 title">{{ modelDetail.name }}</h2>
				<p class="model-detail__tagline text-l">{{ modelDetail.tagline }}</p>
			</div>

			<div class="model-detail__content">
				<div class="model-detail__block">
					<h3 class="model-detail__block-title h3">{{ modelDetail.forWhomTitle }}</h3>
					<ul class="model-detail__list">
						<li v-for="(item, i) in modelDetail.forWhom" :key="i" class="model-detail__list-item text-m">
							{{ item }}
						</li>
					</ul>
				</div>

				<div class="model-detail__block">
					<h3 class="model-detail__block-title h3">{{ modelDetail.specsTitle }}</h3>
					<dl class="model-detail__specs">
						<div v-for="(spec, i) in modelDetail.specs" :key="i" class="model-detail__spec">
							<dt class="model-detail__spec-label text-s">{{ spec.label }}</dt>
							<dd class="model-detail__spec-value text-l">{{ spec.value }}</dd>
						</div>
					</dl>
				</div>

				<div class="model-detail__block">
					<h3 class="model-detail__block-title h3">{{ modelDetail.advantagesTitle }}</h3>
					<ul class="model-detail__list">
						<li v-for="(item, i) in modelDetail.advantages" :key="i" class="model-detail__list-item text-m">
							{{ item }}
						</li>
					</ul>
				</div>

				<div class="model-detail__block">
					<h3 class="model-detail__block-title h3">{{ modelDetail.differencesTitle }}</h3>
					<ul class="model-detail__list">
						<li v-for="(item, i) in modelDetail.differences" :key="i" class="model-detail__list-item text-m">
							{{ item }}
						</li>
					</ul>
				</div>
			</div>

			<div v-if="modelDetail.gallery.length" class="model-detail__gallery">
				<a
					v-for="(photo, i) in modelDetail.gallery"
					:key="i"
					:href="assetUrl(photo.url)"
					class="model-detail__gallery-item glightbox"
					:data-title="photo.alt"
				>
					<img
						class="model-detail__gallery-img"
						:src="assetUrl(photo.url)"
						:alt="photo.alt"
						width="480"
						height="320"
						loading="lazy"
						decoding="async"
					/>
				</a>
			</div>

			<UIButton
				as="a"
				:href="assetUrl(modelDetail.link.url)"
				variant="primary"
				size="big"
				:label="modelDetail.link.label"
				@click="handleAnchorClick(modelDetail.link.url, $event)"
			/>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/general/variables';

.model-detail {
	background-color: variables.$color-background;

	&__head {
		margin-bottom: 32px;

		@media (min-width: variables.$desktop) {
			margin-bottom: 56px;
		}
	}

	&__title {
		margin-bottom: 12px;
		will-change: transform, opacity;
	}

	&__tagline {
		max-width: 640px;
		color: variables.$color-gray-7;
	}

	&__content {
		display: grid;
		grid-template-columns: 100%;
		gap: 24px;
		margin-bottom: 32px;

		@media (min-width: variables.$mobile-big) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: variables.$desktop) {
			gap: 32px;
			margin-bottom: 56px;
		}
	}

	&__block {
		padding: 24px;
		background-color: variables.$glass-bg;
		border: 1px solid variables.$glass-border;
		border-radius: 16px;
		backdrop-filter: variables.$glass-blur;

		@media (min-width: variables.$desktop) {
			padding: 32px;
		}
	}

	&__block-title {
		margin-bottom: 20px;
		color: variables.$color-white;
	}

	&__list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	&__list-item {
		position: relative;
		padding-left: 22px;
		color: variables.$color-gray-7;

		&::before {
			position: absolute;
			top: 8px;
			left: 0;
			width: 8px;
			height: 8px;
			content: '';
			background-color: variables.$color-accent;
			border-radius: 50%;
			box-shadow: 0 0 10px rgb(0 179 60 / 70%);
		}
	}

	&__specs {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
	}

	&__spec {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding-top: 12px;
		border-top: 1px solid variables.$glass-border;
	}

	&__spec-label {
		color: variables.$color-gray-4;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	&__spec-value {
		color: variables.$color-white;
	}

	&__gallery {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;
		margin-bottom: 32px;

		@media (min-width: variables.$tablet) {
			grid-template-columns: repeat(4, 1fr);
			gap: 16px;
		}

		@media (min-width: variables.$desktop) {
			margin-bottom: 48px;
		}
	}

	&__gallery-item {
		position: relative;
		display: block;
		aspect-ratio: 3 / 2;
		overflow: hidden;
		border: 1px solid variables.$glass-border;
		border-radius: 12px;
	}

	&__gallery-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform variables.$transition-duration variables.$transition-bezier;

		@media (min-width: variables.$desktop-small) {
			.model-detail__gallery-item:hover & {
				transform: scale(1.06);
			}
		}
	}
}
</style>
