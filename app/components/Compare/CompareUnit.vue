<script setup lang="ts">
import type { ICompareUnit } from '~~/interfaces/compare/ICompareUnit'

defineProps<{
	compareUnit: ICompareUnit | null
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
		$gsap.from('.compare-unit__row', {
			opacity: 0,
			y: 24,
			duration: 0.9,
			stagger: 0.08,
			ease: 'power3.out',
			scrollTrigger: { trigger: '.compare-unit__table', start: 'top 75%' },
		})
	}, sectionRef.value)
})

onUnmounted(() => {
	ctx?.revert()
	ctx = null
})
</script>

<template>
	<section v-if="compareUnit" id="compare-js" ref="sectionRef" class="compare-unit offset">
		<div class="container">
			<LabelDecor :label="compareUnit.label" />

			<div class="compare-unit__head">
				<h2 ref="titleRef" class="compare-unit__title h2 title">{{ compareUnit.title }}</h2>
				<p class="compare-unit__desc text-m">{{ compareUnit.desc }}</p>
			</div>

			<div class="compare-unit__scroller">
				<table class="compare-unit__table">
					<thead>
						<tr>
							<th class="compare-unit__cell compare-unit__cell_head compare-unit__cell_label" scope="col" />
							<th
								v-for="column in compareUnit.columns"
								:key="column.id"
								class="compare-unit__cell compare-unit__cell_head"
								scope="col"
							>
								<span class="compare-unit__column-name text-xl">{{ column.name }}</span>
								<span class="compare-unit__column-note text-s">{{ column.recommendedFor }}</span>
							</th>
						</tr>
					</thead>

					<tbody>
						<tr v-for="row in compareUnit.rows" :key="row.label" class="compare-unit__row">
							<th class="compare-unit__cell compare-unit__cell_label text-m" scope="row">{{ row.label }}</th>
							<td v-for="(value, i) in row.values" :key="i" class="compare-unit__cell text-m">{{ value }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/general/variables';

.compare-unit {
	background-color: variables.$color-surface;

	&__head {
		margin-bottom: 32px;

		@media (min-width: variables.$desktop) {
			display: flex;
			gap: 60px;
			align-items: flex-end;
			justify-content: space-between;
			margin-bottom: 56px;
		}
	}

	&__title {
		margin-bottom: 16px;
		will-change: transform, opacity;

		@media (min-width: variables.$desktop) {
			margin-bottom: 0;
		}
	}

	&__desc {
		max-width: 460px;
		color: variables.$color-gray-7;
	}

	&__scroller {
		overflow-x: auto;
		border: 1px solid variables.$glass-border;
		border-radius: 16px;
	}

	&__table {
		width: 100%;
		min-width: 520px;
		border-collapse: collapse;
		background-color: variables.$glass-bg;
		backdrop-filter: variables.$glass-blur;
	}

	&__cell {
		padding: 16px 20px;
		vertical-align: top;
		text-align: left;
		border-bottom: 1px solid variables.$glass-border;

		&:not(:last-child) {
			border-right: 1px solid variables.$glass-border;
		}

		&_head {
			padding-top: 24px;
			padding-bottom: 24px;
		}

		&_label {
			color: variables.$color-gray-7;
			white-space: nowrap;
		}
	}

	&__row:last-child &__cell {
		border-bottom: none;
	}

	&__row:nth-child(even) &__cell {
		background-color: rgb(255 255 255 / 3%);
	}

	&__column-name {
		display: block;
		margin-bottom: 6px;
		color: variables.$color-accent;
		text-transform: uppercase;
	}

	&__column-note {
		display: block;
		color: variables.$color-gray-4;
	}

	td.compare-unit__cell {
		color: variables.$color-white;
	}
}
</style>
