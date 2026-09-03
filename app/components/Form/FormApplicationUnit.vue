<script setup lang="ts">
import type { IFormUnit, TFormKey } from '~~/interfaces/IFormUnit'

defineProps<{
	formUnit: IFormUnit | null
	formKey: TFormKey
}>()

const sectionRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

useGsapAnimTitle(titleRef, sectionRef)

let ctx: any = null

onMounted(async () => {
	await nextTick()
	if (!import.meta.client || !sectionRef.value) return

	const { $gsap, $ScrollTrigger } = useNuxtApp() as any
	$gsap.registerPlugin($ScrollTrigger)

	ctx = $gsap.context(() => {
		$gsap.from('.form-unit__panel', {
			opacity: 0,
			y: 48,
			duration: 0.9,
			ease: 'power3.out',
			scrollTrigger: { trigger: '.form-unit__panel', start: 'top 75%' },
		})
	}, sectionRef.value)
})

onUnmounted(() => {
	ctx?.revert()
	ctx = null
})
</script>

<template>
	<section v-if="formUnit" ref="sectionRef" class="form-unit offset">
		<div class="container">
			<div class="form-unit__panel">
				<span class="form-unit__glow" aria-hidden="true" />

				<div class="form-unit__inner">
					<LabelDecor :label="formUnit.label" />

					<div class="form-unit__head">
						<h2 ref="titleRef" class="form-unit__title h2 title">{{ formUnit.title }}</h2>
						<p v-if="formUnit.desc" class="form-unit__description text-l">{{ formUnit.desc }}</p>
					</div>

					<FormApplication :form-key="formKey" />
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/general/variables';

.form-unit {
	background-color: variables.$color-background;

	&__panel {
		position: relative;
		padding: 32px 20px;
		overflow: hidden;
		background-color: variables.$color-surface;
		border: 1px solid variables.$glass-border;
		border-radius: 20px;

		@media (min-width: variables.$desktop) {
			padding: 72px 64px;
			border-radius: 28px;
		}
	}

	&__glow {
		position: absolute;
		top: -160px;
		left: -120px;
		width: 520px;
		height: 420px;
		pointer-events: none;
		background: radial-gradient(ellipse at center, rgb(0 179 60 / 20%) 0%, rgb(0 179 60 / 0%) 70%);
	}

	&__inner {
		position: relative;
		display: flex;
		flex-direction: column;
	}

	&__head {
		margin-bottom: 32px;

		@media (min-width: variables.$desktop) {
			margin-bottom: 56px;
		}
	}

	&__title {
		margin-bottom: 12px;
		will-change: transform, opacity;
	}

	&__description {
		max-width: 560px;
		color: variables.$color-gray-7;
	}
}
</style>
