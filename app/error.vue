<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
	error: NuxtError
}>()
</script>

<template>
	<NuxtLayout name="error-layout">
		<div class="error-page">
			<div class="container">
				<div class="error-page__inner">
					<span class="error-page__code display-typo">{{ error.status || 500 }}</span>

					<template v-if="error.status === 404">
						<h1 class="error-page__title h2 title">Съехали с колеи</h1>
						<p class="error-page__text text-l">
							Такой страницы нет — похоже, маршрут проложен по несуществующей дороге. Вернитесь на главную, там вся
							техника на месте.
						</p>
					</template>
					<template v-else>
						<h1 class="error-page__title h2 title">{{ error.message || 'Что-то пошло не так' }}</h1>
						<p class="error-page__text text-l">
							Мы уже разбираемся. Попробуйте обновить страницу или вернуться на главную.
						</p>
					</template>

					<UIButton as="NuxtLink" to="/" variant="primary" size="big" label="Вернуться на главную" />
				</div>
			</div>
		</div>
	</NuxtLayout>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.error-page {
	display: flex;
	flex: 1 1 auto;
	align-items: center;
	padding: 64px 0;
	background-color: variables.$color-background;

	@media (min-width: variables.$desktop) {
		padding: 120px 0;
	}

	&__inner {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	&__code {
		margin-bottom: 16px;
		text-align: left;
	}

	&__title {
		margin-bottom: 16px;
	}

	&__text {
		max-width: 560px;
		margin-bottom: 32px;
		color: variables.$color-gray-7;
	}
}
</style>
