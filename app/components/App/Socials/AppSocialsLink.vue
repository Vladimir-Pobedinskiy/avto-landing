<script setup lang="ts">
import type { ISocialLink } from '~~/interfaces/ISocialLink'

defineProps<{
	link: ISocialLink
}>()
</script>

<template>
	<a class="socials-link" :href="link.url" :title="link.label" target="_blank">
		<NuxtIcon class="socials-link__icon" :name="`icon-${link.name}`" filled />
	</a>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.socials-link {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 46px;
	height: 46px;
	margin-right: 16px;
	color: variables.$color-white;
	background-color: transparent;
	border: 1px solid variables.$color-accent-stroke;
	border-radius: 5px;
	box-shadow: 0 0 8px 0 rgb(0 179 60 / 50%);

	&:last-child {
		margin-right: 0;
	}

	@media (min-width: variables.$desktop) {
		transition: border-color 0.5s ease-in-out;

		&:hover {
			border-color: variables.$color-accent;
			transition: border-color 0.5s ease-in-out;
		}
	}

	&__icon {
		width: 24px;
		height: 24px;
		color: inherit;
	}
}
</style>
