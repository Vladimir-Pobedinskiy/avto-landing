<script setup lang="ts">
import type { ITeamPreview } from '~~/interfaces/team/ITeamPreview'

defineProps<{
	preview: ITeamPreview
}>()

// Пути к файлам из db.json: в подпапке домена им нужен базовый префикс
const { assetUrl } = useAssetUrl()
</script>

<template>
	<article class="team-preview hover-scale">
		<div class="team-preview__img-wrapper hover-scale-img-wrapper">
			<img
				class="team-preview__img hover-scale-img"
				:src="assetUrl(preview.img.url)"
				:alt="preview.img.alt"
				width="600"
				height="760"
				loading="lazy"
				decoding="async"
			/>
			<span class="team-preview__scrim" aria-hidden="true" />

			<a class="team-preview__tel text-m" :href="`tel:${preview.tel.replace(/[^+\d]/g, '')}`">
				<NuxtIcon class="team-preview__tel-icon" name="icon-phone" filled />
				{{ preview.tel }}
			</a>
		</div>

		<div class="team-preview__body">
			<p class="team-preview__position text-s">{{ preview.position }}</p>
			<h3 class="team-preview__name text-xl">{{ preview.name }}</h3>
			<p class="team-preview__experience text-m">{{ preview.experience }}</p>
		</div>
	</article>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/general/variables';

.team-preview {
	display: flex;
	flex-direction: column;

	&__img-wrapper {
		position: relative;
		aspect-ratio: 3 / 4;
		overflow: hidden;
		background-color: variables.$color-surface;
		border: 1px solid variables.$glass-border;
		border-radius: 16px;
	}

	&__img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	&__scrim {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: linear-gradient(0deg, rgb(10 12 16 / 88%) 0%, rgb(10 12 16 / 0%) 52%);
	}

	&__tel {
		position: absolute;
		right: 12px;
		bottom: 12px;
		left: 12px;
		display: flex;
		gap: 8px;
		align-items: center;
		justify-content: center;
		padding: 10px 14px;
		color: variables.$color-white;
		background-color: rgb(10 12 16 / 70%);
		border: 1px solid variables.$glass-border;
		border-radius: 10px;
		backdrop-filter: variables.$glass-blur;
		transition:
			border-color variables.$transition-duration variables.$transition-bezier,
			color variables.$transition-duration variables.$transition-bezier;

		@media (min-width: variables.$desktop) {
			&:hover {
				color: variables.$color-accent;
				border-color: rgb(0 179 60 / 60%);
			}
		}
	}

	&__tel-icon {
		flex-shrink: 0;
		width: 16px;
		height: 16px;
	}

	&__body {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding-top: 20px;
	}

	&__position {
		color: variables.$color-accent;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	&__name {
		font-family: variables.$font;
		font-weight: 700;
		color: variables.$color-white;
	}

	&__experience {
		color: variables.$color-gray-7;
	}
}
</style>
