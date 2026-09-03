<script setup lang="ts">
withDefaults(
	defineProps<{
		name: string
		errorValue?: string
		disabled?: boolean
	}>(),
	{
		errorValue: '',
		disabled: false,
	}
)

const modelValue = defineModel<boolean>('modelValue')
</script>

<template>
	<div :class="['label-checkbox-wrapper', { selected: modelValue }, { error: errorValue }, { disabled: disabled }]">
		<label class="label-checkbox">
			<input
				v-model="modelValue"
				:value="modelValue"
				:name="name"
				class="label-checkbox__input visually-hidden"
				type="checkbox"
				:disabled="disabled"
			/>

			<span :class="['label-checkbox__checkbox-icon-wrapper', { selected: modelValue }]">
				<NuxtIcon class="label-checkbox__checkbox-icon" name="icon-checkbox" filled />
			</span>

			<slot name="content" />
		</label>
		<span v-if="errorValue" class="label-checkbox__checkbox-error text-s">{{ errorValue }}</span>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.label-checkbox {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	padding-left: 30px;
	width: fit-content;

	@media (min-width: variables.$desktop) {
		cursor: pointer;
	}

	&__checkbox-icon-wrapper {
		position: absolute;
		left: 0;
		width: 18px;
		min-width: 18px;
		height: 18px;
		min-height: 18px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: transparent;
		border: 1px solid variables.$color-white;
		overflow: hidden;
		transition:
			background-color 0.3s ease,
			border-color 0.3s ease;
	}

	&__checkbox-icon {
		transform: scale(0);
		width: 12px;
		height: 12px;
		color: variables.$color-white;
		transition: transform 0.3s ease;
	}

	&__checkbox-error {
		position: absolute;
		left: 0;
		top: 102%;
		margin-top: 4px;
		display: block;
		color: variables.$color-error;
	}
}

.label-checkbox-wrapper {
	position: relative;
	pointer-events: all;

	&.selected {
		.label-checkbox__checkbox-icon-wrapper {
			background-color: variables.$color-accent;
			border-color: variables.$color-accent;
			transition:
				background-color 0.3s ease,
				border-color 0.3s ease;
		}

		.label-checkbox__checkbox-icon {
			transform: scale(1);
			transition: transform 0.3s ease;
		}
	}

	&.error {
		margin-bottom: 14px;

		.label-checkbox__checkbox-icon-wrapper {
			border-color: variables.$color-error;
			transition:
				background-color 0.3s ease,
				border-color 0.3s ease;
		}
	}

	&.disabled {
		pointer-events: none;
		opacity: 0.7;
		z-index: 10;
	}
}
</style>
