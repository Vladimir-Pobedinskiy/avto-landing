<script setup lang="ts">
import type { ISocialLink } from '~~/interfaces/ISocialLink'

defineProps<{
	links: ISocialLink[]
}>()
</script>

<template>
	<div class="socials-links">
		<AppSocialsLink v-for="(link, i) in links" :key="i" :link="link" />
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.socials-links {
	display: flex;
	align-items: center;
}
</style>
