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
	display: flex;
	gap: 12px;
	align-items: center;
	width: 100%;
	padding: 16px 0;
	color: variables.$color-white;
	text-align: left;
	background-color: transparent;
	border: 0;
	border-bottom: 1px solid variables.$glass-border;
	transition: color variables.$transition-duration variables.$transition-bezier;

	&:last-child {
		border-bottom: 0;
	}

	@media (min-width: variables.$desktop-small) {
		&:hover {
			cursor: pointer;

			.configurator-option__toggle {
				color: variables.$color-accent;
				border-color: rgb(0 179 60 / 60%);
			}
		}
	}

	&__body {
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
	}

	&__name {
		font-family: variables.$font-secondary;
		font-size: 14px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;

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
		display: flex;
		flex-shrink: 0;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		color: variables.$color-white;
		background-color: rgb(255 255 255 / 4%);
		border: 1px solid variables.$glass-border;
		border-radius: 8px;
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
			background-color: variables.$color-accent;
			border-color: transparent;
			box-shadow: 0 8px 24px -10px rgb(0 179 60 / 90%);

			.nuxt-icon {
				transform: rotate(45deg);
			}
		}

		@media (min-width: variables.$desktop-small) {
			&:hover .configurator-option__toggle {
				color: variables.$color-white;
				background-color: variables.$color-accent-soft;
				border-color: transparent;
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
