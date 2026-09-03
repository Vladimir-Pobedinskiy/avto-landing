<script setup lang="ts">
import type { ISeo } from '~~/interfaces/seo/ISeo'
import type { ISchemaOrg } from '~~/interfaces/seo/ISchemaOrg'
import type { IHomeHero } from '~~/interfaces/IHomeHero'
import type { IConfiguratorUnit } from '~~/interfaces/configurator/IConfiguratorUnit'
import type { IHomeAboutUnit } from '~~/interfaces/IHomeAboutUnit'
import type { IOffersUnit } from '~~/interfaces/IOffersUnit'
import type { IModelsUnit } from '~~/interfaces/models/IModelsUnit'
import type { IVideoUnit } from '~~/interfaces/video/IVideoUnit'
import type { ITeamUnit } from '~~/interfaces/team/ITeamUnit'
import type { IWhyUsUnit } from '~~/interfaces/IWhyUsUnit'
import type { INewsPreviewsUnit } from '~~/interfaces/news/INewsPreviewsUnit'
import type { IFormUnit } from '~~/interfaces/IFormUnit'
import type { IContactsUnit } from '~~/interfaces/IContactsUnit'

interface IHomePageData {
	seo: ISeo
	schemaOrg: ISchemaOrg
	homeHero: IHomeHero
	configuratorUnit: IConfiguratorUnit
	aboutUnit: IHomeAboutUnit
	offersUnit: IOffersUnit
	modelsUnit: IModelsUnit
	videoUnit: IVideoUnit
	teamUnit: ITeamUnit
	whyUsUnit: IWhyUsUnit
	newsUnit: INewsPreviewsUnit
	testDriveFormUnit: IFormUnit
	contactsUnit: IContactsUnit
	selectAtvFormUnit: IFormUnit
}

const { data, pending, error } = await useAsyncData('home-page', async () => {
	return $fetch<IHomePageData>('/api/home/')
})
usePageError(error)
usePageSeo(data)
</script>

<template>
	<div v-if="data" class="home-page">
		<HomeHero v-if="data.homeHero" :home-hero="data.homeHero" :is-loading="pending" />
		<ConfiguratorUnit v-if="data.configuratorUnit" :configurator-unit="data.configuratorUnit" />
		<HomeAboutUnit v-if="data.aboutUnit" :about-unit="data.aboutUnit" :is-loading="pending" />
		<HomeOffersUnit v-if="data.offersUnit" :offers-unit="data.offersUnit" :is-loading="pending" />
		<ModelsUnit v-if="data.modelsUnit" :models-unit="data.modelsUnit" :is-loading="pending" />
		<VideoUnit v-if="data.videoUnit" :video-unit="data.videoUnit" />
		<TeamUnit v-if="data.teamUnit" :team-unit="data.teamUnit" :is-loading="pending" />
		<WhyUsUnit v-if="data.whyUsUnit" :why-us-unit="data.whyUsUnit" />
		<NewsPreviewsUnit v-if="data.newsUnit" :news-unit="data.newsUnit" :is-loading="pending" />
		<FormApplicationUnit
			v-if="data.testDriveFormUnit"
			id="test-drive-js"
			:form-unit="data.testDriveFormUnit"
			form-key="test-drive"
		/>
		<HomeContactsUnit v-if="data.contactsUnit" :contacts-unit="data.contactsUnit" />
		<FormApplicationUnit
			v-if="data.selectAtvFormUnit"
			:form-unit="data.selectAtvFormUnit"
			form-key="select-atv"
			class="home-page__select-form"
		/>
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.home-page {
	&__select-form {
		padding-bottom: 0;
	}
}
</style>
