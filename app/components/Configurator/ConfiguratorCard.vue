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
	padding: 20px 14px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	border: 1px solid variables.$glass-border;
	border-radius: 12px;
	background-color: rgb(255 255 255 / 3%);
	color: variables.$color-white;
	text-align: center;
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
		letter-spacing: 0.06em;
		text-transform: uppercase;

		@media (min-width: variables.$desktop) {
			font-size: 14px;
		}
	}

	&__note {
		color: variables.$color-gray-4;
	}

	&__price {
		margin-top: auto;
		padding-top: 8px;
		color: variables.$color-gray-7;
	}

	&.selected {
		border-color: variables.$color-accent;
		background-color: rgb(0 179 60 / 8%);

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
