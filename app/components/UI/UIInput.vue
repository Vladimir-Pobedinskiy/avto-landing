<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		type?: 'text' | 'password' | 'number' | 'email' | 'tel'
		name: string
		placeholder: string
		min?: number
		max?: number
		errorValue?: string
		disabled?: boolean
		autocomplete?: string
	}>(),
	{
		type: 'text',
		min: 0,
		max: 1000000000000,
		errorValue: '',
		disabled: false,
		autocomplete: 'on',
	}
)
defineEmits<{
	(e: 'change', event: Event): void
}>()

const value = defineModel<string | number>('value')

const isShowPassword = ref<boolean>(false)
const togglePasswordVisibility = () => {
	if (props.type !== 'password') return
	isShowPassword.value = !isShowPassword.value
}

const preventInvalidKeys = (event: KeyboardEvent) => {
	if (props.type !== 'number') return

	const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', ',']
	if (allowedKeys.includes(event.key)) return

	if (!/^\d$/.test(event.key) && event.key !== ',') event.preventDefault()

	if (props.type === 'number' && event.target instanceof HTMLInputElement && Number(event.target.value) >= props.max) {
		event.target.value = props.max.toString()
	}
}

const isFocused = ref<boolean>(false)
const isHiddenInputTitle = computed(() => {
	return (value.value !== null && value.value !== undefined && String(value.value).length > 0) || isFocused.value
})
</script>

<template>
	<div :class="['label-input-wrapper', { error: errorValue }, { disabled: disabled }]">
		<div class="label-input-box">
			<label class="label-input">
				<div class="label-input__input-box">
					<input
						v-model="value"
						v-imask="type === 'tel' ? { mask: '+7 (000) 000-00-00' } : undefined"
						:type="type !== 'password' ? type : isShowPassword ? 'text' : 'password'"
						:name="name"
						:max="type === 'number' ? max : undefined"
						:min="type === 'number' ? min : undefined"
						:autocomplete="autocomplete"
						:class="['label-input__input input-typo', { error: errorValue }]"
						:disabled="disabled"
						@keydown="preventInvalidKeys"
						@focus="isFocused = true"
						@blur="isFocused = false"
						@change="$emit('change', $event)"
					/>

					<span class="label-input__title input-typo" :class="{ hidden: isHiddenInputTitle }">
						{{ placeholder }}
					</span>
					<button
						v-if="type === 'password'"
						class="toggle-password-visibility-btn"
						type="button"
						:aria-label="isShowPassword ? 'Скрыть пароль' : 'Показать пароль'"
						:disabled="disabled"
						@click="togglePasswordVisibility"
					>
						<template v-if="isShowPassword">
							<NuxtIcon class="icon-eye-password" name="icon-eye-input-password" filled />
						</template>
						<template v-else>
							<NuxtIcon class="icon-eye-password-hidden" name="icon-eye-input-password-hidden" filled />
						</template>
					</button>
				</div>
			</label>
		</div>

		<span v-if="errorValue" class="label-input__error-message text-s">{{ errorValue }}</span>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.label-input {
	&__label {
		display: inline-block;
		height: 40px;
		margin-bottom: 8px;
		text-transform: uppercase;
		background-color: variables.$color-background;
	}

	&__input-box {
		position: relative;
		width: 100%;
	}

	&__input {
		width: 100%;
		padding: 16px 0;
		color: variables.$color-gray-7;
		pointer-events: all;
		background-color: variables.$color-background;
		border-bottom: 1px solid variables.$color-accent-stroke;
		transition:
			border-color 0.4s ease-in-out,
			color 0.4s ease-in-out;

		@media (min-width: variables.$desktop) {
			&:hover {
				border-color: variables.$color-accent;
				transition:
					border-color 0.4s ease-in-out,
					color 0.4s ease-in-out;
			}
		}

		&:active,
		&:focus {
			color: variables.$color-white;
			outline: transparent;
			border-color: variables.$color-accent;
			transition:
				border-color 0.4s ease-in-out,
				color 0.4s ease-in-out;
		}

		&:disabled,
		&.disabled {
			color: variables.$color-gray-4;
			pointer-events: none;
			cursor: default;
			border-color: variables.$color-gray-4;
			transition:
				border-color 0.4s ease-in-out,
				color 0.4s ease-in-out;
		}

		&.error {
			border-color: variables.$color-error;
			transition:
				border-color 0.3s ease,
				background-color 0.3s ease;
		}

		&::placeholder {
			color: variables.$color-gray-7;
		}
	}

	&__title {
		position: absolute;
		top: 50%;
		left: 0;
		font-size: 16px;
		color: variables.$color-gray-4;
		pointer-events: none;
		cursor: text;
		transform: translateY(-50%);

		&.hidden {
			height: 0;
			font-size: 0;
		}
	}

	&__error-message {
		display: block;
		margin-top: 10px;
		color: variables.$color-error;
	}
}

.label-input-wrapper {
	pointer-events: all;
	background-color: transparent;

	&.disabled {
		pointer-events: none;
		opacity: 0.5;
	}
}

.label-input-box {
	position: relative;
}

// скрываем у input[type="tel"] placeholder в обычном состоянии
[type='tel']::placeholder {
	height: 0;
	font-size: 0;
	transition: font-size 0.3s ease;
}

// убираем стрелки у input[type="number"]
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
	margin: 0;
	-webkit-appearance: none;
}

input[type='number'] {
	-moz-appearance: textfield;
}

input[type='number']:hover,
input[type='number']:focus {
	-moz-appearance: number-input;
}

input[type='number']::-webkit-outer-spin-button {
	margin: 0;
	-webkit-appearance: none;
}

// password

input[name='password'],
input[name='repeatPassword'] {
	padding-right: 62px;
	letter-spacing: 1px;
}

.toggle-password-visibility-btn {
	position: absolute;
	top: 50%;
	right: 16px;
	z-index: 10;
	width: 24px;
	height: 24px;
	background-color: transparent;
	transform: translateY(-50%);

	svg {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
}

.icon-eye-password-hidden {
	width: 24px;
	height: 24px;
	color: inherit;
}

.icon-eye-password {
	width: 24px;
	height: 24px;
	color: inherit;
}
</style>
