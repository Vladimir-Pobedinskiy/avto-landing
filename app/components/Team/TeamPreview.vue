<script setup lang="ts">
import type { ITeamPreview } from '~~/interfaces/team/ITeamPreview'

defineProps<{
	preview: ITeamPreview
}>()
</script>

<template>
	<article class="team-preview hover-scale">
		<div class="team-preview__img-wrapper hover-scale-img-wrapper">
			<img
				class="team-preview__img hover-scale-img"
				:src="preview.img.url"
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
		border: 1px solid variables.$glass-border;
		border-radius: 16px;
		background-color: variables.$color-surface;
	}

	&__img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	&__scrim {
		position: absolute;
		inset: 0;
		background: linear-gradient(0deg, rgb(10 12 16 / 88%) 0%, rgb(10 12 16 / 0%) 52%);
		pointer-events: none;
	}

	&__tel {
		position: absolute;
		left: 12px;
		right: 12px;
		bottom: 12px;
		padding: 10px 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border: 1px solid variables.$glass-border;
		border-radius: 10px;
		background-color: rgb(10 12 16 / 70%);
		backdrop-filter: variables.$glass-blur;
		color: variables.$color-white;
		transition:
			border-color variables.$transition-duration variables.$transition-bezier,
			color variables.$transition-duration variables.$transition-bezier;

		@media (min-width: variables.$desktop) {
			&:hover {
				border-color: rgb(0 179 60 / 60%);
				color: variables.$color-accent;
			}
		}
	}

	&__tel-icon {
		width: 16px;
		height: 16px;
		flex-shrink: 0;
	}

	&__body {
		padding-top: 20px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	&__position {
		color: variables.$color-accent;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	&__name {
		color: variables.$color-white;
		font-family: variables.$font;
		font-weight: 700;
	}

	&__experience {
		color: variables.$color-gray-7;
	}
}
</style>
