<script setup lang="ts">
import type { IContactsUnit } from '~~/interfaces/IContactsUnit'
import { useGeneralStore } from '@/stores/storeGeneral'

defineProps<{
	contactsUnit: IContactsUnit | null
}>()

const storeGeneral = useGeneralStore()
const socials = computed(() => storeGeneral.socials)

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
		$gsap.from('.home-contacts__card', {
			opacity: 0,
			y: 40,
			duration: 1,
			stagger: 0.12,
			ease: 'power3.out',
			scrollTrigger: { trigger: '.home-contacts__grid', start: 'top 72%' },
		})
	}, sectionRef.value)
})

onUnmounted(() => {
	ctx?.revert()
	ctx = null
})
</script>

<template>
	<section v-if="contactsUnit" id="contacts-js" ref="sectionRef" class="home-contacts offset">
		<div class="container">
			<LabelDecor label="Где нас найти" />

			<h2 ref="titleRef" class="home-contacts__title h2 title title_margin">{{ contactsUnit.title }}</h2>

			<div class="home-contacts__grid">
				<div class="home-contacts__card">
					<span class="home-contacts__card-icon">
						<NuxtIcon name="icon-phone" filled />
					</span>
					<h3 class="home-contacts__card-title text-s">Телефоны</h3>
					<a
						v-for="(phone, i) in contactsUnit.info.phones"
						:key="i"
						class="home-contacts__value text-xl hover-color"
						:href="phone.url"
					>
						{{ phone.label }}
						<span class="home-contacts__value-note text-s">{{ phone.title }}</span>
					</a>
					<a class="home-contacts__value text-l hover-color" :href="contactsUnit.info.email.url">
						{{ contactsUnit.info.email.label }}
					</a>
				</div>

				<div class="home-contacts__card">
					<span class="home-contacts__card-icon">
						<NuxtIcon name="icon-map-pin" filled />
					</span>
					<h3 class="home-contacts__card-title text-s">{{ contactsUnit.info.address.title }}</h3>
					<p class="home-contacts__value text-xl">{{ contactsUnit.info.address.label }}</p>
					<p class="home-contacts__note text-m">{{ contactsUnit.info.address.description }}</p>
				</div>

				<div class="home-contacts__card">
					<span class="home-contacts__card-icon">
						<NuxtIcon name="icon-clock" filled />
					</span>
					<h3 class="home-contacts__card-title text-s">{{ contactsUnit.info.operatingMode.title }}</h3>
					<p class="home-contacts__value text-xl">{{ contactsUnit.info.operatingMode.mondayFriday }}</p>
					<p class="home-contacts__note text-m">{{ contactsUnit.info.operatingMode.saturdaySunday }}</p>

					<AppSocialsLinks v-if="socials" class="home-contacts__socials" :links="socials" />
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/general/variables';

.home-contacts {
	background-color: variables.$color-surface;

	&__title {
		will-change: transform, opacity;
	}

	&__grid {
		display: grid;
		grid-template-columns: 100%;
		gap: 16px;

		@media (min-width: variables.$tablet) {
			grid-template-columns: repeat(3, 1fr);
			gap: 24px;
		}
	}

	&__card {
		display: flex;
		flex-direction: column;
		padding: 28px 24px;
		background-color: variables.$glass-bg;
		border: 1px solid variables.$glass-border;
		border-radius: 16px;
		backdrop-filter: variables.$glass-blur;

		@media (min-width: variables.$desktop) {
			padding: 40px 32px;
		}
	}

	&__card-icon {
		display: flex;
		flex-shrink: 0;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		margin-bottom: 24px;
		color: variables.$color-accent;
		border: 1px solid rgb(0 179 60 / 35%);
		border-radius: 12px;

		.nuxt-icon {
			width: 24px;
			height: 24px;
		}
	}

	&__card-title {
		margin-bottom: 16px;
		color: variables.$color-gray-4;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	&__value {
		display: flex;
		flex-direction: column;
		gap: 4px;
		margin-bottom: 12px;
		font-family: variables.$font;
		font-weight: 700;
		color: variables.$color-white;

		&:last-of-type {
			margin-bottom: 0;
		}
	}

	&__value-note {
		font-family: variables.$font-secondary;
		font-weight: 400;
		color: variables.$color-gray-4;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	&__note {
		margin-top: 8px;
		color: variables.$color-gray-7;
	}

	&__socials {
		margin-top: 24px;
	}
}
</style>
