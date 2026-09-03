<script setup lang="ts">
withDefaults(
	defineProps<{
		size?: 'small' | 'big'
	}>(),
	{
		size: 'big',
	}
)

const route = useRoute()
const currentRouteNameComputed = computed(() => route.name)
</script>

<template>
	<div :class="['logo-box', `logo-box_${size}`]">
		<template v-if="currentRouteNameComputed !== 'index'">
			<NuxtLink class="logo" to="/" aria-label="Тайга Моторс — на главную">
				<NuxtIcon :class="['logo__icon', `logo__icon_${size}`]" name="icon-logo" filled />
			</NuxtLink>
		</template>
		<template v-else>
			<span class="logo" role="img" aria-label="Логотип «Тайга Моторс»">
				<NuxtIcon :class="['logo__icon', `logo__icon_${size}`]" name="icon-logo" filled />
			</span>
		</template>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.logo-box {
	flex-shrink: 0;

	&_small {
		width: 116px;

		@media (min-width: variables.$desktop) {
			width: 148px;
		}
	}

	&_big {
		width: 160px;

		@media (min-width: variables.$desktop) {
			width: 220px;
		}
	}
}

.logo {
	display: block;
	color: variables.$color-white;
	transition: color variables.$transition-duration variables.$transition-bezier;

	@media (min-width: variables.$desktop) {
		&:hover {
			color: variables.$color-accent;
		}
	}

	&__icon {
		display: block;

		&_small {
			width: 116px;
			height: 28px;

			@media (min-width: variables.$desktop) {
				width: 148px;
				height: 36px;
			}
		}

		&_big {
			width: 160px;
			height: 39px;

			@media (min-width: variables.$desktop) {
				width: 220px;
				height: 53px;
			}
		}
	}
}
</style>
