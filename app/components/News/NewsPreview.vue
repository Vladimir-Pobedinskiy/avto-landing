<script setup lang="ts">
import type { INewsPreview } from '~~/interfaces/news/INewsPreview'

defineProps<{
	preview: INewsPreview
}>()
</script>

<template>
	<article class="news-preview hover-scale hover-card">
		<div class="news-preview__img-wrapper hover-scale-img-wrapper">
			<img
				class="news-preview__img hover-scale-img"
				:src="preview.img.url"
				:alt="preview.img.alt"
				width="800"
				height="520"
				loading="lazy"
				decoding="async"
			/>
			<span class="news-preview__tag text-s">{{ preview.tag }}</span>
		</div>

		<div class="news-preview__body">
			<time class="news-preview__date text-s">{{ preview.date }}</time>
			<h3 class="news-preview__title text-xl">{{ preview.title }}</h3>
			<p class="news-preview__desc text-m">{{ preview.desc }}</p>
		</div>
	</article>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/general/variables';

.news-preview {
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
		aspect-ratio: 16 / 10;
		overflow: hidden;
		background-color: variables.$color-surface;
	}

	&__img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	&__tag {
		position: absolute;
		left: 16px;
		top: 16px;
		padding: 6px 12px;
		border-radius: 6px;
		background-color: rgb(10 12 16 / 78%);
		backdrop-filter: variables.$glass-blur;
		color: variables.$color-accent;
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

	&__date {
		margin-bottom: 12px;
		color: variables.$color-gray-4;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	&__title {
		margin-bottom: 12px;
		color: variables.$color-white;
		font-family: variables.$font;
		font-weight: 700;
	}

	&__desc {
		color: variables.$color-gray-7;
	}
}
</style>
