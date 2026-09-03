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
	height: 100%;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	border: 1px solid variables.$glass-border;
	border-radius: 16px;
	background-color: variables.$glass-bg;
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
		left: 16px;
		top: 16px;
		padding: 7px 14px;
		display: flex;
		align-items: center;
		gap: 8px;
		border: 1px solid variables.$glass-border;
		border-radius: 100px;
		background-color: rgb(10 12 16 / 78%);
		backdrop-filter: variables.$glass-blur;
		color: variables.$color-gray-7;
		text-transform: uppercase;
		letter-spacing: 0.08em;

		&.available {
			border-color: rgb(0 179 60 / 45%);
			color: variables.$color-white;
		}
	}

	&__badge-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background-color: variables.$color-green;
		animation: pulse-dot 2.4s ease-in-out infinite;
	}

	&__category {
		position: absolute;
		right: 16px;
		bottom: 16px;
		padding: 6px 12px;
		border-radius: 6px;
		background-color: rgb(0 179 60 / 88%);
		color: variables.$color-white;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	&__body {
		padding: 24px 20px;
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;

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
		padding: 20px 0;
		margin-bottom: 24px;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
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
		margin-top: auto;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 16px;
	}

	&__price {
		margin-bottom: 4px;
		color: variables.$color-accent;
		font-family: variables.$font;
		font-weight: 800;
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
