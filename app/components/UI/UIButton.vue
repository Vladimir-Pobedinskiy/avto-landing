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
	padding: 14px 24px;
	position: relative;
	width: fit-content;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 12px;
	overflow: hidden;
	flex-shrink: 0;
	border: 1px solid transparent;
	border-radius: 8px;
	background-color: transparent;
	color: variables.$color-white;
	outline: transparent;
	text-align: center;
	text-transform: uppercase;
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
		left: 0;
		top: 0;
		width: 40%;
		height: 100%;
		background: linear-gradient(90deg, rgb(255 255 255 / 0%), rgb(255 255 255 / 35%), rgb(255 255 255 / 0%));
		transform: translate3d(-160%, 0, 0) skewX(-18deg);
		pointer-events: none;
		opacity: 0;
	}

	&__label {
		display: block;
		position: relative;
		z-index: 1;
	}

	&__icon {
		position: relative;
		width: 28px;
		height: 12px;
		z-index: 1;
		color: inherit;
		transition: transform variables.$transition-duration variables.$transition-bezier;
	}

	&.primary {
		background-color: variables.$color-accent;
		color: variables.$color-white;
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
		border-color: variables.$glass-border;
		background-color: variables.$glass-bg;
		backdrop-filter: variables.$glass-blur;
		color: variables.$color-white;

		@media (min-width: variables.$desktop-small) {
			&:not(:disabled):hover {
				border-color: rgb(0 179 60 / 60%);
				color: variables.$color-accent;
				transform: translateY(-2px);

				.btn__icon {
					transform: translateX(4px);
				}
			}
		}
	}

	&:disabled,
	&.disabled {
		cursor: default;
		pointer-events: none;
		background-color: rgb(255 255 255 / 6%);
		box-shadow: none;
		color: variables.$color-gray-4;
	}

	&.small {
		padding: 12px 20px;
		gap: 8px;

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
