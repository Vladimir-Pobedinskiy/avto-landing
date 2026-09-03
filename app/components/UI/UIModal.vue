<script setup lang="ts">
import { VueFinalModal, useVfm } from 'vue-final-modal'
import { useScrollController } from '@/composables/useScrollController'
import 'vue-final-modal/style.css'

const props = withDefaults(
	defineProps<{
		modelValue: boolean
		modalId: number | string
		name: string
		lockScroll?: boolean
		/** Закрытие модального окна при нажатии на наложение модального окна */
		clickToClose?: boolean
		/** Нажмите esc, чтобы закрыть модальное окно */
		escToClose?: boolean
		/** Скрытие отображения наложения */
		hideOverlay?: boolean
		swipeToClose?: 'none' | 'up' | 'right' | 'down' | 'left'
		isLoading?: boolean
	}>(),
	{
		lockScroll: false,
		clickToClose: true,
		escToClose: true,
		hideOverlay: false,
		swipeToClose: 'none',
		isLoading: false,
	}
)
const emits = defineEmits<{
	(e: 'update:modelValue', value: boolean): void
}>()

const modelValue = computed({
	get: () => props.modelValue,
	set: value => emits('update:modelValue', value),
})

const closeModal = () => {
	emits('update:modelValue', false)
}

const vfm = useVfm()
const openedModals = vfm.openedModals

const customOverlayTransition = {
	enterActiveClass: 'custom-overlay-fade-enter-active',
	leaveActiveClass: 'custom-overlay-fade-leave-active',
	enterFromClass: 'custom-overlay-fade-enter-from',
	leaveToClass: 'custom-overlay-fade-leave-to',
}
const customContentTransition = {
	enterActiveClass: 'custom-content-slide-enter-active',
	leaveActiveClass: 'custom-content-slide-leave-active',
	enterFromClass: 'custom-content-slide-enter-from',
	leaveToClass: 'custom-content-slide-leave-to',
}

const handleBeforeOpen = () => {
	if (import.meta.client && !document.body.classList.contains('lock-js')) {
		useScrollController.disableScroll()
	}
}

const handleClosed = () => {
	if (import.meta.client && document.body.classList.contains('lock-js') && !openedModals.length) {
		useScrollController.enableScroll()
	}
}

watch(openedModals, value => {
	if (value && value.length === 0) useScrollController.enableScroll()
})
</script>

<template>
	<VueFinalModal
		v-model="modelValue"
		:modal-id="modalId"
		:name="name"
		:lock-scroll="lockScroll"
		:overlay-transition="customOverlayTransition"
		:content-transition="customContentTransition"
		:click-to-close="clickToClose"
		:esc-to-close="escToClose"
		:hide-overlay="hideOverlay"
		:swipe-to-close="swipeToClose"
		class="modal-container"
		content-class="modal-content"
		overlay-class="modal-overlay"
		@before-open="handleBeforeOpen"
		@closed="handleClosed"
	>
		<button
			class="modal-close-btn"
			type="button"
			aria-label="Закрыть модальное окно"
			:disabled="isLoading"
			@click="closeModal"
		>
			<NuxtIcon class="modal-close-btn-icon" name="icon-close" filled />
		</button>

		<div class="modal-inner">
			<div v-if="$slots.header" class="modal-header">
				<slot name="header" />
			</div>
			<div v-if="$slots.body" class="modal-body">
				<slot name="body" />
			</div>
		</div>
	</VueFinalModal>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.vfm.modal-container {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 10000;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	padding: 27px 0;
}

.vfm__content.vfm--outline-none.modal-content {
	position: relative;
}

.modal-overlay.vfm__overlay {
	background-color: rgb(90 90 90 / 15%);
	backdrop-filter: blur(5.95px);
}

.modal-content {
	width: 100%;
	max-width: 600px;
	max-height: 85%;
	padding: 40px 16px;
	overflow-y: auto;
	color: variables.$color-white;
	background-color: variables.$color-background;
	box-shadow: 0 3px 4px 0 rgb(0, 0, 0, 15%);
}

.modal-close-btn {
	position: absolute;
	top: 12px;
	right: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 24px;
	height: 24px;
}

.modal-close-btn-icon {
	width: 24px;
	height: 24px;
	color: variables.$color-white;
}

.modal-title {
	margin-bottom: 16px;
	text-align: center;
}

.modal-text {
	text-align: center;
}

.modal-body {
	max-height: 85%;
}

.modal-success {
	&__body {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		max-width: 600px;
	}

	&__title {
		margin-bottom: 16px;
		text-align: center;
	}

	&__text {
		text-align: center;
	}
}

// content
.custom-content-slide-enter-active {
	transition:
		opacity 0.5s ease,
		transform 0.6s ease;
}

.custom-content-slide-leave-active {
	transition:
		opacity 0.3s ease,
		transform 0.3s ease;
}

.custom-content-slide-enter-from,
.custom-content-slide-leave-to {
	opacity: 0;
	transform: translateY(-20px);
}

// overlay
.custom-overlay-fade-enter-active {
	transition:
		opacity 0.5s ease,
		transform 0.5s ease;
}

.custom-overlay-fade-leave-active {
	transition:
		opacity 0.3s ease,
		transform 0.3s ease;
}

.custom-overlay-fade-enter-from,
.custom-overlay-fade-leave-to {
	opacity: 0;
}
</style>
