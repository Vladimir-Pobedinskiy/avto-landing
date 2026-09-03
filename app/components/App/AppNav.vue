<script setup lang="ts">
import type { ILinkWithFlag } from '~~/interfaces/IGeneral'

withDefaults(
	defineProps<{
		links: ILinkWithFlag[]
		variantLink?: 'NuxtLink' | 'a'
		direction?: 'row' | 'column'
	}>(),
	{
		variantLink: 'NuxtLink',
		direction: 'row',
	}
)

const { handleAnchorClick } = useAnchorNav()
</script>

<template>
	<nav class="app-nav">
		<ul :class="['app-nav__list', `app-nav__list_${direction}`]">
			<li v-for="(link, i) in links" :key="i" :class="['app-nav__item', `app-nav__item_${direction}`]">
				<template v-if="link.isOtherPage">
					<NuxtLink class="app-nav__link text-m text-m_medium hover-link" :to="link.url">
						{{ link.label }}
					</NuxtLink>
				</template>
				<template v-else>
					<a
						class="app-nav__link text-m text-m_medium hover-link"
						:href="link.url"
						@click="handleAnchorClick(link.url, $event)"
					>
						{{ link.label }}
					</a>
				</template>
			</li>
		</ul>
	</nav>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.app-nav {
	&__list {
		&_row {
			display: flex;
			align-items: center;
		}

		&_column {
			display: flex;
			flex-direction: column;
		}
	}

	&__item {
		&_column {
			margin-bottom: 16px;

			&:last-child {
				margin-bottom: 0;
			}
		}

		&_row {
			margin-right: 20px;

			&:last-child {
				margin-right: 0;
			}
		}
	}

	&__link {
		color: variables.$color-white;
		text-transform: uppercase;
	}
}
</style>
