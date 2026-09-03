<script setup lang="ts">
defineProps<{
	label: string
}>()
</script>

<template>
	<div class="label-decor">
		<span class="label-decor__dash" aria-hidden="true" />
		<span class="label-decor__text">{{ label }}</span>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/general/variables';

.label-decor {
	margin-bottom: 16px;
	display: flex;
	align-items: center;

	@media (min-width: variables.$desktop) {
		margin-bottom: 28px;
	}

	&__dash {
		width: 32px;
		height: 2px;
		flex-shrink: 0;
		background: linear-gradient(90deg, variables.$color-accent, rgb(0 179 60 / 0%));
		box-shadow: 0 0 10px rgb(0 179 60 / 70%);

		@media (min-width: variables.$desktop) {
			width: 52px;
		}
	}

	&__text {
		margin-left: 12px;
		display: block;
		font-family: variables.$font-secondary;
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: variables.$color-accent;

		@media (min-width: variables.$desktop) {
			font-size: 14px;
		}
	}
}
</style>
