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
	display: flex;
	align-items: center;
	margin-bottom: 16px;

	@media (min-width: variables.$desktop) {
		margin-bottom: 28px;
	}

	&__dash {
		flex-shrink: 0;
		width: 32px;
		height: 2px;
		background: linear-gradient(90deg, variables.$color-accent, rgb(0 179 60 / 0%));
		box-shadow: 0 0 10px rgb(0 179 60 / 70%);

		@media (min-width: variables.$desktop) {
			width: 52px;
		}
	}

	&__text {
		display: block;
		margin-left: 12px;
		font-family: variables.$font-secondary;
		font-size: 12px;
		font-weight: 600;
		color: variables.$color-accent;
		text-transform: uppercase;
		letter-spacing: 0.14em;

		@media (min-width: variables.$desktop) {
			font-size: 14px;
		}
	}
}
</style>
