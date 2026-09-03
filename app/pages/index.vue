<script setup lang="ts">
import type { ISeo } from '~~/interfaces/seo/ISeo'
import type { ISchemaOrg } from '~~/interfaces/seo/ISchemaOrg'
import type { IHomeHero } from '~~/interfaces/IHomeHero'
import type { IModelDetailUnit } from '~~/interfaces/models/IModelDetailUnit'
import type { IConfiguratorUnit } from '~~/interfaces/configurator/IConfiguratorUnit'
import type { IWhyUsUnit } from '~~/interfaces/IWhyUsUnit'
import type { ICompareUnit } from '~~/interfaces/compare/ICompareUnit'
import type { IOrganizationsUnit } from '~~/interfaces/IOrganizationsUnit'
import type { IFormUnit } from '~~/interfaces/IFormUnit'
import type { IContactsUnit } from '~~/interfaces/IContactsUnit'

interface IHomePageData {
	seo: ISeo
	schemaOrg: ISchemaOrg
	homeHero: IHomeHero
	modelBv206Unit: IModelDetailUnit
	modelMc25Unit: IModelDetailUnit
	configuratorUnit: IConfiguratorUnit
	whyUsUnit: IWhyUsUnit
	compareUnit: ICompareUnit
	organizationsUnit: IOrganizationsUnit
	organizationsFormUnit: IFormUnit
	contactsUnit: IContactsUnit
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
		<ModelsDetailUnit v-if="data.modelBv206Unit" :model-detail="data.modelBv206Unit" section-id="model-bv206-js" />
		<ModelsDetailUnit v-if="data.modelMc25Unit" :model-detail="data.modelMc25Unit" section-id="model-mc25-js" />
		<ConfiguratorUnit v-if="data.configuratorUnit" :configurator-unit="data.configuratorUnit" />
		<WhyUsUnit v-if="data.whyUsUnit" :why-us-unit="data.whyUsUnit" />
		<CompareUnit v-if="data.compareUnit" :compare-unit="data.compareUnit" />
		<OrganizationsUnit v-if="data.organizationsUnit" :organizations-unit="data.organizationsUnit" />
		<FormApplicationUnit
			v-if="data.organizationsFormUnit"
			id="organizations-form-js"
			:form-unit="data.organizationsFormUnit"
			form-key="organizations"
		/>
		<HomeContactsUnit v-if="data.contactsUnit" :contacts-unit="data.contactsUnit" />
	</div>
</template>
