<template>
	<NuxtLoadingIndicator :color="'#00b33c'" />

	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<style lang="scss">
.page-enter-active,
.page-leave-active {
	transition: all 0.5s ease-in-out;
}

.page-enter-from,
.page-leave-to {
	opacity: 0;
	filter: blur(1rem);
}

.layout-enter-active,
.layout-leave-active {
	transition: all 0.5s ease-in-out;
}

.layout-enter-from,
.layout-leave-to {
	opacity: 0;
	filter: blur(1rem);
}
</style>
