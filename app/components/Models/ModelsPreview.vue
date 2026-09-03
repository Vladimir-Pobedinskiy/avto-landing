<script setup lang="ts">
import type { IModelsPreview } from '~~/interfaces/models/IModelsPreview'

defineProps<{
	preview: IModelsPreview
}>()

const { handleAnchorClick } = useAnchorNav()
</script>

<template>
	<article class="models-preview hover-scale hover-card">
		<div class="models-preview__img-wrapper hover-scale-img-wrapper">
			<img
				class="models-preview__img hover-scale-img"
				:src="preview.img.url"
				:alt="preview.img.alt"
				width="960"
				height="640"
				loading="lazy"
				decoding="async"
			/>

			<span :class="['models-preview__badge', 'text-s', { available: preview.isAvailable }]">
				<span v-if="preview.isAvailable" class="models-preview__badge-dot" aria-hidden="true" />
				{{ preview.availableLabel }}
			</span>

			<span class="models-preview__category text-s">{{ preview.category }}</span>
		</div>

		<div class="models-preview__body">
			<h3 class="models-preview__name h3">{{ preview.name }}</h3>
			<p class="models-preview__tagline text-m">{{ preview.tagline }}</p>

			<dl class="models-preview__specs">
				<div v-for="(spec, i) in preview.specs" :key="i" class="models-preview__spec">
					<dt class="models-preview__spec-label text-s">{{ spec.label }}</dt>
					<dd class="models-preview__spec-value text-l">{{ spec.value }}</dd>
				</div>
			</dl>

			<div class="models-preview__footer">
				<div class="models-preview__price-box">
					<p class="models-preview__price text-xl">{{ preview.price }}</p>
					<p class="models-preview__price-note text-s">{{ preview.priceNote }}</p>
				</div>

				<UIButton
					as="a"
					href="/#test-drive-js"
					variant="second"
					size="small"
					label="Запросить"
					:aria-label="`Запросить расчёт: ${preview.name}`"
					@click="handleAnchorClick('/#test-drive-js', $event)"
				/>
			</div>
		</div>
	</article>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/general/variables';

.models-preview {
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow: hidden;
	background-color: variables.$glass-bg;
	border: 1px solid variables.$glass-border;
	border-radius: 16px;
	backdrop-filter: variables.$glass-blur;

	&__img-wrapper {
		position: relative;
		aspect-ratio: 3 / 2;
		overflow: hidden;
		background-color: variables.$color-surface;
	}

	&__img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	&__badge {
		position: absolute;
		top: 16px;
		left: 16px;
		display: flex;
		gap: 8px;
		align-items: center;
		padding: 7px 14px;
		color: variables.$color-gray-7;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		background-color: rgb(10 12 16 / 78%);
		border: 1px solid variables.$glass-border;
		border-radius: 100px;
		backdrop-filter: variables.$glass-blur;

		&.available {
			color: variables.$color-white;
			border-color: rgb(0 179 60 / 45%);
		}
	}

	&__badge-dot {
		width: 7px;
		height: 7px;
		background-color: variables.$color-green;
		border-radius: 50%;
		animation: pulse-dot 2.4s ease-in-out infinite;
	}

	&__category {
		position: absolute;
		right: 16px;
		bottom: 16px;
		padding: 6px 12px;
		color: variables.$color-white;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		background-color: rgb(0 179 60 / 88%);
		border-radius: 6px;
	}

	&__body {
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;
		padding: 24px 20px;

		@media (min-width: variables.$desktop) {
			padding: 28px 24px;
		}
	}

	&__name {
		margin-bottom: 8px;
		color: variables.$color-white;
		text-transform: uppercase;
	}

	&__tagline {
		margin-bottom: 24px;
		color: variables.$color-gray-7;
	}

	&__specs {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
		padding: 20px 0;
		margin-bottom: 24px;
		border-top: 1px solid variables.$glass-border;
		border-bottom: 1px solid variables.$glass-border;
	}

	&__spec {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	&__spec-label {
		color: variables.$color-gray-4;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	&__spec-value {
		color: variables.$color-white;
	}

	&__footer {
		display: flex;
		gap: 16px;
		align-items: flex-end;
		justify-content: space-between;
		margin-top: auto;
	}

	&__price {
		margin-bottom: 4px;
		font-family: variables.$font;
		font-weight: 800;
		color: variables.$color-accent;
	}

	&__price-note {
		color: variables.$color-gray-4;
	}
}

@media (prefers-reduced-motion: reduce) {
	.models-preview__badge-dot {
		animation: none !important;
	}
}
</style>
