<script setup lang="ts">
import type { IConfiguratorOption } from '~~/interfaces/configurator/IConfiguratorUnit'

defineProps<{
	option: IConfiguratorOption
	isSelected: boolean
	priceLabel: string
}>()

const emits = defineEmits<{
	(e: 'toggle'): void
}>()
</script>

<template>
	<button
		type="button"
		:class="['configurator-option', { selected: isSelected }]"
		:aria-pressed="isSelected"
		@click="emits('toggle')"
	>
		<span class="configurator-option__body">
			<span class="configurator-option__name">{{ option.name }}</span>
			<span class="configurator-option__note text-s">{{ option.note }}</span>
		</span>

		<span class="configurator-option__price text-s">
			{{ priceLabel }}
		</span>

		<span class="configurator-option__toggle" aria-hidden="true">
			<NuxtIcon name="icon-plus" filled />
		</span>
	</button>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/general/variables';

.configurator-option {
	padding: 16px 0;
	width: 100%;
	display: flex;
	align-items: center;
	gap: 12px;
	border: 0;
	border-bottom: 1px solid variables.$glass-border;
	background-color: transparent;
	color: variables.$color-white;
	text-align: left;
	transition: color variables.$transition-duration variables.$transition-bezier;

	&:last-child {
		border-bottom: 0;
	}

	@media (min-width: variables.$desktop-small) {
		&:hover {
			cursor: pointer;

			.configurator-option__toggle {
				border-color: rgb(0 179 60 / 60%);
				color: variables.$color-accent;
			}
		}
	}

	&__body {
		display: flex;
		min-width: 0;
		flex: 1 1 auto;
		flex-direction: column;
		gap: 4px;
	}

	&__name {
		font-family: variables.$font-secondary;
		font-size: 14px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;

		@media (min-width: variables.$desktop) {
			font-size: 16px;
		}
	}

	&__note {
		color: variables.$color-gray-4;
	}

	&__price {
		flex-shrink: 0;
		color: variables.$color-gray-7;
		white-space: nowrap;
	}

	&__toggle {
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		border: 1px solid variables.$glass-border;
		border-radius: 8px;
		background-color: rgb(255 255 255 / 4%);
		color: variables.$color-white;
		transition:
			background-color variables.$transition-duration variables.$transition-bezier,
			border-color variables.$transition-duration variables.$transition-bezier,
			color variables.$transition-duration variables.$transition-bezier;

		@media (min-width: variables.$desktop) {
			width: 42px;
			height: 42px;
		}

		.nuxt-icon {
			width: 18px;
			height: 18px;
			transition: transform variables.$transition-duration variables.$transition-bezier;
		}
	}

	&.selected {
		.configurator-option__price {
			color: variables.$color-white;
		}

		.configurator-option__toggle {
			border-color: transparent;
			background-color: variables.$color-accent;
			box-shadow: 0 8px 24px -10px rgb(0 179 60 / 90%);

			.nuxt-icon {
				transform: rotate(45deg);
			}
		}

		@media (min-width: variables.$desktop-small) {
			&:hover .configurator-option__toggle {
				border-color: transparent;
				background-color: variables.$color-accent-soft;
				color: variables.$color-white;
			}
		}
	}
}

@media (prefers-reduced-motion: reduce) {
	.configurator-option,
	.configurator-option__toggle,
	.configurator-option__toggle .nuxt-icon {
		transition: none;
	}
}
</style>
