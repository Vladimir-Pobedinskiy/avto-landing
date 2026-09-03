<script setup lang="ts">
import type { IConfiguratorOption } from '~~/interfaces/configurator/IConfiguratorUnit'

defineProps<{
	option: IConfiguratorOption
	isSelected: boolean
	priceLabel: string
}>()

const emits = defineEmits<{
	(e: 'select'): void
}>()
</script>

<template>
	<button
		type="button"
		:class="['configurator-card', { selected: isSelected }]"
		:aria-pressed="isSelected"
		@click="emits('select')"
	>
		<span v-if="option.icon" class="configurator-card__icon">
			<NuxtIcon :name="option.icon" filled />
		</span>

		<span class="configurator-card__name">{{ option.name }}</span>
		<span class="configurator-card__note text-s">{{ option.note }}</span>

		<span class="configurator-card__price text-s">
			{{ priceLabel }}
		</span>
	</button>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/general/variables';

.configurator-card {
	display: flex;
	flex-direction: column;
	gap: 8px;
	align-items: center;
	padding: 20px 14px;
	color: variables.$color-white;
	text-align: center;
	background-color: rgb(255 255 255 / 3%);
	border: 1px solid variables.$glass-border;
	border-radius: 12px;
	transition:
		border-color variables.$transition-duration variables.$transition-bezier,
		background-color variables.$transition-duration variables.$transition-bezier,
		transform variables.$transition-duration variables.$transition-bezier;

	@media (min-width: variables.$desktop-small) {
		&:hover {
			cursor: pointer;
			border-color: rgb(0 179 60 / 45%);
			transform: translateY(-2px);
		}
	}

	&__icon {
		margin-bottom: 4px;
		color: variables.$color-gray-7;
		transition: color variables.$transition-duration variables.$transition-bezier;

		.nuxt-icon {
			width: 30px;
			height: 30px;
		}
	}

	&__name {
		font-family: variables.$font-secondary;
		font-size: 12px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;

		@media (min-width: variables.$desktop) {
			font-size: 14px;
		}
	}

	&__note {
		color: variables.$color-gray-4;
	}

	&__price {
		padding-top: 8px;
		margin-top: auto;
		color: variables.$color-gray-7;
	}

	&.selected {
		background-color: rgb(0 179 60 / 8%);
		border-color: variables.$color-accent;

		.configurator-card__icon {
			color: variables.$color-accent;
		}

		.configurator-card__price {
			color: variables.$color-white;
		}
	}
}

@media (prefers-reduced-motion: reduce) {
	.configurator-card,
	.configurator-card__icon {
		transition: none;
	}
}
</style>
