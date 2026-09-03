<script setup lang="ts">
onMounted(() => {
	if (window.scrollY > 0) {
		window.scrollTo({ top: 0 })
	}
})
</script>

<template>
	<div key="error-l" class="body-inner">
		<AppHeader />

		<main class="main">
			<slot />
		</main>

		<AppFooter />
	</div>
</template>
