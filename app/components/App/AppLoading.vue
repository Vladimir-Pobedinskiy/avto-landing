<script setup lang="ts">
withDefaults(
	defineProps<{
		isLoading?: boolean
		isLoadingLocal?: boolean
		variant?: 'dark' | 'blur'
	}>(),
	{
		isLoading: false,
		isLoadingLocal: false,
		variant: 'blur',
	}
)
</script>

<template>
	<div
		v-if="isLoading || isLoadingLocal"
		:class="['loading', `loading_${variant}`, { 'loading-local': isLoadingLocal }]"
	>
		<span :class="['loading__spinner', { local: isLoadingLocal }]"></span>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.loading {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 100000;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	backdrop-filter: blur(5.95px);

	&_blur {
		background-color: rgb(90 90 90 / 15%);
	}

	&_dark {
		background-color: variables.$color-background;
	}

	&.loading-local {
		position: relative;
		width: 100%;
		height: 400px;
		background-color: variables.$color-white;
	}

	&__spinner {
		width: 50px;
		height: 50px;
		border: 4px solid variables.$color-accent;
		border-left-color: variables.$color-black;
		border-radius: 50%;
		animation: spin 1s infinite linear;
		will-change: transform;

		&.local {
			width: 40px;
			height: 40px;
		}
	}
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}

	50% {
		transform: rotate(180deg);
	}

	100% {
		transform: rotate(360deg);
	}
}
</style>
