<script setup lang="ts">
const props = defineProps<{
	modelValue: boolean
	error: any
}>()

const emits = defineEmits<{
	(e: 'update:modelValue', value: boolean): void
}>()

const modelValue = computed({
	get: () => props.modelValue,
	set: value => emits('update:modelValue', value),
})
</script>

<template>
	<UIModal v-model:model-value="modelValue" modal-id="modal-error" class="modal-error" name="ModalError">
		<template #header>
			<h2 class="modal-error__title text-xl">Ошибка!</h2>
		</template>
		<template #body>
			<template v-if="error && error?.status">
				<p class="modal-error__status">
					<span class="text-l">Код ошибки:</span> <span class="text-xl">{{ error?.status }}</span>
				</p>
				<template v-if="error && error?.message">
					<p class="modal-error__text text-l">{{ error?.message }}</p>
				</template>
				<template v-else>
					<p class="modal-error__text text-l">
						Что то пошло не так! Попробуйте зайти позже. Извините за временные неудобства!
					</p>
				</template>
			</template>
			<template v-else>
				<p class="modal-error__text text-l">
					Что то пошло не так! Попробуйте зайти позже. Извините за временные неудобства!
				</p>
			</template>
		</template>
	</UIModal>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.modal-error {
	&__title {
		margin-bottom: 24px;
		text-align: center;
	}

	&__status {
		margin-bottom: 24px;
		text-align: center;
	}

	&__text {
		text-align: center;
	}
}
</style>
