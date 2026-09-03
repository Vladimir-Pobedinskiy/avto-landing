<script setup lang="ts">
import type { IConfiguratorStep } from '~~/interfaces/configurator/IConfiguratorUnit'

const props = defineProps<{
	steps: IConfiguratorStep[]
	activeIndex: number
}>()

const emits = defineEmits<{
	(e: 'select', index: number): void
}>()

// Полоса прогресса: доля пройденных шагов, а не позиция активной метки —
// на первом шаге линия уже подсвечена до конца первого сегмента.
const progress = computed<string>(() => {
	const total = props.steps.length - 1
	if (total <= 0) return '100%'

	return `${((props.activeIndex + 1) / (total + 1)) * 100}%`
})
</script>

<template>
	<div class="configurator-steps">
		<ol class="configurator-steps__list">
			<li
				v-for="(step, index) in steps"
				:key="step.id"
				:class="['configurator-steps__item', { active: index === activeIndex, passed: index < activeIndex }]"
			>
				<button
					type="button"
					class="configurator-steps__btn"
					:aria-current="index === activeIndex ? 'step' : undefined"
					@click="emits('select', index)"
				>
					<span class="configurator-steps__num">{{ step.num }}</span>
					<span class="configurator-steps__label">{{ step.label }}</span>
				</button>
			</li>
		</ol>

		<div class="configurator-steps__track" aria-hidden="true">
			<span class="configurator-steps__bar" :style="{ width: progress }" />
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/general/variables';

.configurator-steps {
	margin-bottom: 32px;

	@media (min-width: variables.$desktop) {
		margin-bottom: 56px;
	}

	&__list {
		display: flex;
		gap: 4px;
		overflow-x: auto;
		list-style: none;
		scrollbar-width: none;

		&::-webkit-scrollbar {
			display: none;
		}

		@media (min-width: variables.$tablet) {
			gap: 16px;
			overflow-x: visible;
		}
	}

	&__item {
		flex: 1 0 auto;

		@media (min-width: variables.$tablet) {
			flex: 1 1 0;
		}
	}

	&__btn {
		display: flex;
		gap: 10px;
		align-items: baseline;
		width: 100%;
		padding: 0 0 14px;
		color: variables.$color-gray-4;
		text-align: left;
		text-transform: uppercase;
		background-color: transparent;
		border: 0;
		transition: color variables.$transition-duration variables.$transition-bezier;

		@media (min-width: variables.$desktop-small) {
			&:hover {
				color: variables.$color-gray-7;
				cursor: pointer;
			}
		}
	}

	&__num {
		flex-shrink: 0;
		font-family: variables.$font-secondary;
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.08em;

		@media (min-width: variables.$desktop) {
			font-size: 15px;
		}
	}

	&__label {
		font-family: variables.$font-secondary;
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.08em;
		white-space: nowrap;

		@media (min-width: variables.$desktop) {
			font-size: 15px;
			white-space: normal;
		}
	}

	&__item.passed &__btn {
		color: variables.$color-gray-7;
	}

	&__item.active &__btn {
		color: variables.$color-white;

		.configurator-steps__num {
			color: variables.$color-accent;
		}
	}

	&__track {
		position: relative;
		height: 2px;
		background-color: rgb(255 255 255 / 10%);
	}

	&__bar {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		background: linear-gradient(90deg, variables.$color-accent, variables.$color-accent-soft);
		box-shadow: 0 0 12px rgb(0 179 60 / 70%);
		transition: width 600ms variables.$transition-bezier;
	}
}

@media (prefers-reduced-motion: reduce) {
	.configurator-steps__bar {
		transition: none;
	}
}
</style>
