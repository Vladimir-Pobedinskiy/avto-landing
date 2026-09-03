<script setup lang="ts">
import { NuxtLink } from '#components'

const props = withDefaults(
	defineProps<{
		as: 'button' | 'NuxtLink' | 'a' | 'span'
		/** для <NuxtLink> */
		to?: string
		/** для <a> */
		href?: string
		target?: string
		/** для <button> */
		type?: 'button' | 'submit'
		/** вариант */
		variant?: 'primary' | 'second'
		/** размер */
		size?: 'small' | 'big'
		/** для отображения на всю ширину */
		full?: boolean
		/** aria-label */
		ariaLabel?: string
		/** строковый контент */
		label?: string
		download?: boolean | string
		isShowArrow?: boolean
		disabled?: boolean
	}>(),
	{
		type: 'button',
		to: undefined,
		href: undefined,
		target: undefined,
		variant: 'primary',
		size: 'big',
		full: false,
		ariaLabel: '',
		label: '',
		download: false,
		isShowArrow: true,
		disabled: false,
	}
)
const emits = defineEmits<{
	(e: 'click', event: MouseEvent): void
}>()

const onClick = (event: MouseEvent) => {
	if (props.disabled) {
		event.preventDefault()
	} else {
		emits('click', event)
	}
}
</script>

<template>
	<Component
		:is="as === 'NuxtLink' ? NuxtLink : as"
		:class="[`btn`, `${variant}`, `${size}`, { full: full }, { disabled: disabled }]"
		:to="as === 'NuxtLink' ? to : undefined"
		:href="as === 'a' ? href : undefined"
		:target="as === 'a' && target ? target : undefined"
		:type="as === 'button' ? type : undefined"
		:aria-label="ariaLabel ? ariaLabel : undefined"
		:download="as === 'a' && download ? download : undefined"
		:disabled="as !== 'span' ? disabled : undefined"
		@click="onClick"
	>
		<span class="btn__shine" aria-hidden="true" />
		<template v-if="$slots.content">
			<slot name="content" />
		</template>
		<span v-if="label" class="btn__label button-typo">{{ label }}</span>
		<NuxtIcon v-if="isShowArrow" class="btn__icon" name="icon-arrow-right" filled />
	</Component>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.btn {
	position: relative;
	display: inline-flex;
	flex-shrink: 0;
	gap: 12px;
	align-items: center;
	justify-content: center;
	width: fit-content;
	padding: 14px 24px;
	overflow: hidden;
	color: variables.$color-white;
	text-align: center;
	text-transform: uppercase;
	outline: transparent;
	background-color: transparent;
	border: 1px solid transparent;
	border-radius: 8px;
	transition:
		background-color variables.$transition-duration variables.$transition-bezier,
		border-color variables.$transition-duration variables.$transition-bezier,
		color variables.$transition-duration variables.$transition-bezier,
		box-shadow variables.$transition-duration variables.$transition-bezier,
		transform variables.$transition-duration variables.$transition-bezier;

	@media (min-width: variables.$tablet) {
		padding: 18px 32px;
	}

	@media (min-width: variables.$desktop-small) {
		&:not(:disabled):hover {
			cursor: pointer;
		}
	}

	// Блик пробегает по кнопке только на ховере — постоянной анимации нет.
	&__shine {
		position: absolute;
		top: 0;
		left: 0;
		width: 40%;
		height: 100%;
		pointer-events: none;
		background: linear-gradient(90deg, rgb(255 255 255 / 0%), rgb(255 255 255 / 35%), rgb(255 255 255 / 0%));
		opacity: 0;
		transform: translate3d(-160%, 0, 0) skewX(-18deg);
	}

	&__label {
		position: relative;
		z-index: 1;
		display: block;
	}

	&__icon {
		position: relative;
		z-index: 1;
		width: 28px;
		height: 12px;
		color: inherit;
		transition: transform variables.$transition-duration variables.$transition-bezier;
	}

	&.primary {
		color: variables.$color-white;
		background-color: variables.$color-accent;
		box-shadow: 0 10px 30px -12px rgb(0 179 60 / 80%);

		@media (min-width: variables.$desktop-small) {
			&:not(:disabled):hover {
				background-color: variables.$color-accent-soft;
				box-shadow: 0 16px 40px -12px rgb(0 179 60 / 90%);
				transform: translateY(-2px);

				.btn__shine {
					opacity: 1;
					transform: translate3d(320%, 0, 0) skewX(-18deg);
					transition: transform 0.8s variables.$transition-bezier;
				}

				.btn__icon {
					transform: translateX(4px);
				}
			}
		}
	}

	&.second {
		color: variables.$color-white;
		background-color: variables.$glass-bg;
		border-color: variables.$glass-border;
		backdrop-filter: variables.$glass-blur;

		@media (min-width: variables.$desktop-small) {
			&:not(:disabled):hover {
				color: variables.$color-accent;
				border-color: rgb(0 179 60 / 60%);
				transform: translateY(-2px);

				.btn__icon {
					transform: translateX(4px);
				}
			}
		}
	}

	&:disabled,
	&.disabled {
		color: variables.$color-gray-4;
		pointer-events: none;
		cursor: default;
		background-color: rgb(255 255 255 / 6%);
		box-shadow: none;
	}

	&.small {
		gap: 8px;
		padding: 12px 20px;

		.btn__label {
			font-size: 14px;
		}
	}

	&.full {
		width: 100%;
	}
}

@media (prefers-reduced-motion: reduce) {
	.btn,
	.btn__icon,
	.btn__shine {
		transition: none !important;
	}
}
</style>
