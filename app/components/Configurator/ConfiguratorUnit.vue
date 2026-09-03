<script setup lang="ts">
import type { TID } from '~~/interfaces/TID'
import type {
	IConfiguratorGroup,
	IConfiguratorModel,
	IConfiguratorOption,
	IConfiguratorUnit,
} from '~~/interfaces/configurator/IConfiguratorUnit'

const props = defineProps<{
	configuratorUnit: IConfiguratorUnit | null
}>()

const sectionRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)

useGsapAnimTitle(titleRef, sectionRef)

const { handleAnchorClick } = useAnchorNav()

const activeIndex = ref<number>(0)
const selectedModelId = ref<TID | null>(null)
// Плоский список выбранных опций: id опции уникален в пределах конфигуратора.
const selectedOptionIds = ref<TID[]>([])

const steps = computed(() => props.configuratorUnit?.steps ?? [])
const activeStep = computed(() => steps.value[activeIndex.value] ?? null)

const isFirstStep = computed<boolean>(() => activeIndex.value === 0)
const isLastStep = computed<boolean>(() => activeIndex.value === steps.value.length - 1)

const activeGroups = computed<IConfiguratorGroup[]>(() => {
	if (!props.configuratorUnit || !activeStep.value) return []

	return props.configuratorUnit.groups.filter(group => group.step === activeStep.value!.id)
})

const selectedModel = computed<IConfiguratorModel | null>(() => {
	const models = props.configuratorUnit?.models ?? []

	return models.find(model => model.id === selectedModelId.value) ?? models[0] ?? null
})

const selectedOptions = computed<IConfiguratorOption[]>(() => {
	if (!props.configuratorUnit) return []

	// Порядок как в данных, а не как кликал пользователь — чтобы итог не прыгал.
	return props.configuratorUnit.groups
		.flatMap(group => group.options)
		.filter(option => selectedOptionIds.value.includes(option.id))
})

const totalPrice = computed<number>(() => {
	const base = selectedModel.value?.basePrice ?? 0

	return selectedOptions.value.reduce((sum, option) => sum + option.price, 0) + base
})

const paidOptions = computed<IConfiguratorOption[]>(() => selectedOptions.value.filter(option => option.price > 0))

const isOptionSelected = (id: TID): boolean => selectedOptionIds.value.includes(id)

const getOptionPriceLabel = (option: IConfiguratorOption): string =>
	option.price ? `+ ${priceFormatter(option.price)}` : (props.configuratorUnit?.includedLabel ?? '')

const toggleOption = (group: IConfiguratorGroup, option: IConfiguratorOption) => {
	if (group.type === 'single') {
		// Из группы-переключателя всегда выбран ровно один вариант.
		const otherIds = group.options.map(item => item.id).filter(id => id !== option.id)
		selectedOptionIds.value = [...selectedOptionIds.value.filter(id => !otherIds.includes(id)), option.id]

		return
	}

	selectedOptionIds.value = isOptionSelected(option.id)
		? selectedOptionIds.value.filter(id => id !== option.id)
		: [...selectedOptionIds.value, option.id]
}

const goToStep = (index: number) => {
	if (index < 0 || index > steps.value.length - 1 || index === activeIndex.value) return
	activeIndex.value = index
}

const goPrev = () => goToStep(activeIndex.value - 1)
const goNext = () => goToStep(activeIndex.value + 1)

// Дефолт: первая модель и по одному варианту из каждой single-группы.
watch(
	() => props.configuratorUnit,
	unit => {
		if (!unit) return

		selectedModelId.value = unit.models[0]?.id ?? null
		selectedOptionIds.value = unit.groups
			.filter(group => group.type === 'single')
			.map(group => group.options[0]?.id)
			.filter((id): id is TID => id !== undefined)
	},
	{ immediate: true }
)

let ctx: any = null

// Смена шага — короткий фейд панели, чтобы переход читался, но не тормозил клик.
watch(activeIndex, async () => {
	if (!import.meta.client || !panelRef.value) return

	const { $gsap } = useNuxtApp() as any
	await nextTick()

	$gsap.fromTo(
		panelRef.value,
		{ opacity: 0, y: 16 },
		{ opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', overwrite: true }
	)
})

onMounted(async () => {
	await nextTick()
	if (!import.meta.client || !sectionRef.value) return

	const { $gsap, $ScrollTrigger } = useNuxtApp() as any
	$gsap.registerPlugin($ScrollTrigger)

	ctx = $gsap.context(() => {
		$gsap.from('.configurator__stage > *', {
			opacity: 0,
			y: 48,
			duration: 1,
			stagger: 0.12,
			ease: 'power3.out',
			scrollTrigger: { trigger: '.configurator__stage', start: 'top 72%' },
		})
	}, sectionRef.value)
})

onUnmounted(() => {
	ctx?.revert()
	ctx = null
})
</script>

<template>
	<section v-if="configuratorUnit" id="configurator-js" ref="sectionRef" class="configurator offset">
		<div class="container">
			<LabelDecor :label="configuratorUnit.label" />

			<div class="configurator__head">
				<h2 ref="titleRef" class="configurator__title h2 title">
					{{ configuratorUnit.title }} <span class="accent-text">{{ configuratorUnit.titleAccent }}</span>
				</h2>
				<p class="configurator__desc text-m">{{ configuratorUnit.desc }}</p>
			</div>

			<div class="configurator__stage">
				<ConfiguratorSteps :steps="configuratorUnit.steps" :active-index="activeIndex" @select="goToStep" />

				<h3 v-if="activeStep" class="configurator__step-title h3">{{ activeStep.title }}</h3>

				<div class="configurator__layout">
					<div class="configurator__visual">
						<img
							v-if="selectedModel"
							class="configurator__img"
							:src="selectedModel.img.url"
							:alt="selectedModel.img.alt"
							width="960"
							height="640"
							loading="lazy"
							decoding="async"
						/>
						<span v-if="selectedModel" class="configurator__visual-badge text-s">
							{{ selectedModel.category }}
						</span>
					</div>

					<div ref="panelRef" class="configurator__panel">
						<template v-if="activeStep?.id === 'model'">
							<div class="configurator__group">
								<h4 class="configurator__group-title">{{ configuratorUnit.summary.baseLabel }}</h4>

								<div class="configurator__rows">
									<ConfiguratorOption
										v-for="model in configuratorUnit.models"
										:key="model.id"
										:option="{ id: model.id, name: model.name, note: model.desc, price: model.basePrice }"
										:is-selected="selectedModel?.id === model.id"
										:price-label="priceFormatter(model.basePrice)"
										@toggle="selectedModelId = model.id"
									/>
								</div>
							</div>
						</template>

						<template v-else-if="activeStep?.id === 'summary'">
							<div class="configurator__group">
								<h4 class="configurator__group-title">{{ configuratorUnit.summary.baseLabel }}</h4>
								<p v-if="selectedModel" class="configurator__summary-base text-l">
									{{ selectedModel.name }}
									<span class="configurator__summary-price">{{ priceFormatter(selectedModel.basePrice) }}</span>
								</p>
							</div>

							<div class="configurator__group">
								<h4 class="configurator__group-title">{{ configuratorUnit.summary.optionsLabel }}</h4>

								<ul v-if="paidOptions.length" class="configurator__summary-list">
									<li v-for="option in paidOptions" :key="option.id" class="configurator__summary-item text-m">
										<span>{{ option.name }}</span>
										<span class="configurator__summary-price">+ {{ priceFormatter(option.price) }}</span>
									</li>
								</ul>
								<p v-else class="configurator__summary-empty text-m">{{ configuratorUnit.summary.emptyLabel }}</p>
							</div>

							<p class="configurator__summary-note text-s">{{ configuratorUnit.summary.note }}</p>
						</template>

						<template v-else>
							<div v-for="group in activeGroups" :key="group.id" class="configurator__group">
								<h4 class="configurator__group-title">{{ group.title }}</h4>

								<div v-if="group.type === 'single'" class="configurator__cards">
									<ConfiguratorCard
										v-for="option in group.options"
										:key="option.id"
										:option="option"
										:is-selected="isOptionSelected(option.id)"
										:price-label="getOptionPriceLabel(option)"
										@select="toggleOption(group, option)"
									/>
								</div>

								<div v-else class="configurator__rows">
									<ConfiguratorOption
										v-for="option in group.options"
										:key="option.id"
										:option="option"
										:is-selected="isOptionSelected(option.id)"
										:price-label="getOptionPriceLabel(option)"
										@toggle="toggleOption(group, option)"
									/>
								</div>
							</div>
						</template>
					</div>
				</div>

				<div class="configurator__footer">
					<div class="configurator__total">
						<span class="configurator__total-label text-s">{{ configuratorUnit.priceLabel }}</span>
						<p class="configurator__total-value numeric-m">
							<span class="configurator__total-prefix">{{ configuratorUnit.pricePrefix }}</span>
							{{ priceFormatter(totalPrice) }}
						</p>
					</div>

					<div class="configurator__actions">
						<UIButton
							as="button"
							variant="second"
							:label="configuratorUnit.prevLabel"
							:is-show-arrow="false"
							:disabled="isFirstStep"
							@click="goPrev"
						/>

						<UIButton
							v-if="!isLastStep"
							as="button"
							variant="primary"
							:label="configuratorUnit.nextLabel"
							@click="goNext"
						/>
						<UIButton
							v-else
							as="NuxtLink"
							variant="primary"
							:to="configuratorUnit.summary.link.url"
							:label="configuratorUnit.summary.link.label"
							@click="handleAnchorClick(configuratorUnit.summary.link.url, $event)"
						/>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/general/variables';

.configurator {
	background-color: variables.$color-background;

	&__head {
		margin-bottom: 32px;

		@media (min-width: variables.$desktop) {
			margin-bottom: 64px;
			display: flex;
			align-items: flex-end;
			justify-content: space-between;
			gap: 60px;
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

	&__stage {
		padding: 24px 16px;
		border: 1px solid variables.$glass-border;
		border-radius: 16px;
		background-color: variables.$glass-bg;
		backdrop-filter: variables.$glass-blur;

		@media (min-width: variables.$desktop) {
			padding: 40px;
		}
	}

	&__step-title {
		margin-bottom: 24px;
		color: variables.$color-white;
		text-transform: uppercase;

		@media (min-width: variables.$desktop) {
			margin-bottom: 32px;
		}
	}

	&__layout {
		display: grid;
		grid-template-columns: 100%;
		gap: 16px;

		@media (min-width: variables.$desktop-small) {
			grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
			gap: 24px;
		}
	}

	&__visual {
		position: relative;
		overflow: hidden;
		border-radius: 12px;
		background-color: variables.$color-surface;
		aspect-ratio: 3 / 2;
	}

	&__img {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
	}

	&__visual-badge {
		position: absolute;
		left: 16px;
		top: 16px;
		padding: 6px 12px;
		border-radius: 100px;
		background-color: rgb(10 12 16 / 70%);
		backdrop-filter: blur(6px);
		color: variables.$color-white;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	&__panel {
		padding: 20px 16px;
		display: flex;
		flex-direction: column;
		gap: 28px;
		border: 1px solid variables.$glass-border;
		border-radius: 12px;
		background-color: rgb(255 255 255 / 3%);

		@media (min-width: variables.$desktop) {
			padding: 32px 28px;
			gap: 36px;
		}
	}

	&__group-title {
		margin-bottom: 8px;
		padding-bottom: 12px;
		border-bottom: 1px solid variables.$glass-border;
		font-family: variables.$font-secondary;
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: variables.$color-gray-7;

		@media (min-width: variables.$desktop) {
			font-size: 15px;
		}
	}

	&__rows {
		display: flex;
		flex-direction: column;
	}

	&__cards {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 10px;

		@media (min-width: variables.$desktop) {
			gap: 16px;
		}
	}

	&__summary-base {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
		color: variables.$color-white;
	}

	&__summary-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
		list-style: none;
	}

	&__summary-item {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
		color: variables.$color-white;
	}

	&__summary-price {
		flex-shrink: 0;
		color: variables.$color-accent;
		white-space: nowrap;
	}

	&__summary-empty {
		color: variables.$color-gray-4;
	}

	&__summary-note {
		margin-top: auto;
		color: variables.$color-gray-4;
	}

	&__footer {
		margin-top: 24px;
		padding-top: 24px;
		display: flex;
		flex-direction: column;
		gap: 20px;
		border-top: 1px solid variables.$glass-border;

		@media (min-width: variables.$tablet) {
			flex-direction: row;
			align-items: flex-end;
			justify-content: space-between;
			gap: 32px;
		}

		@media (min-width: variables.$desktop) {
			margin-top: 40px;
			padding-top: 32px;
		}
	}

	&__total-label {
		display: block;
		margin-bottom: 8px;
		color: variables.$color-gray-7;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	&__total-value {
		color: variables.$color-accent;
	}

	&__total-prefix {
		margin-right: 6px;
		font-size: 18px;
		font-weight: 600;
		text-transform: uppercase;
		color: variables.$color-gray-7;

		@media (min-width: variables.$desktop) {
			font-size: 22px;
		}
	}

	&__actions {
		display: flex;
		gap: 12px;

		@media (min-width: variables.$tablet) {
			gap: 16px;
		}
	}
}
</style>
