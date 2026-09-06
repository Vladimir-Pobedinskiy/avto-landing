<script setup lang="ts">
import { useGeneralStore } from '@/stores/storeGeneral'

const storeGeneral = useGeneralStore()
const footer = computed(() => storeGeneral.footer)
const socials = computed(() => storeGeneral.socials)

const { handleAnchorClick } = useAnchorNav()

// Ссылки-якоря из db.json: в подпапке домена им нужен базовый префикс
const { assetUrl } = useAssetUrl()
</script>

<template>
	<footer v-if="footer" class="footer">
		<div class="container">
			<div class="footer__inner">
				<div class="footer__brand">
					<AppLogo size="big" />
					<p class="footer__slogan text-m">
						Вездеходы на шинах сверхнизкого давления. Собственное производство, гарантия и сервис по всей России.
					</p>
					<AppSocialsLinks v-if="socials" class="footer__socials" :links="socials" />
				</div>

				<nav class="footer__nav">
					<h3 class="footer__nav-title text-s">Техника</h3>
					<div v-for="(item, i) in footer.navigationMain" :key="i" class="footer__nav-item">
						<a
							v-if="item.url.startsWith('/#')"
							:href="assetUrl(item.url)"
							class="footer__nav-link text-m hover-link"
							@click="handleAnchorClick(item.url, $event)"
						>
							{{ item.label }}
						</a>
						<NuxtLink v-else :to="item.url" class="footer__nav-link text-m hover-link">
							{{ item.label }}
						</NuxtLink>
					</div>
				</nav>

				<nav class="footer__nav">
					<h3 class="footer__nav-title text-s">Компания</h3>
					<div v-for="(item, i) in footer.navigationCompany" :key="i" class="footer__nav-item">
						<a
							v-if="item.url.startsWith('/#')"
							:href="assetUrl(item.url)"
							class="footer__nav-link text-m hover-link"
							@click="handleAnchorClick(item.url, $event)"
						>
							{{ item.label }}
						</a>
						<NuxtLink v-else :to="item.url" class="footer__nav-link text-m hover-link">
							{{ item.label }}
						</NuxtLink>
					</div>
				</nav>

				<div class="footer__contacts">
					<h3 class="footer__nav-title text-s">Связаться</h3>
					<a
						v-for="(phone, i) in footer.contactsInfo.phones"
						:key="i"
						class="footer__contact"
						:href="phone.url"
						:title="phone.title"
					>
						<span class="footer__contact-title text-s">{{ phone.title }}</span>
						<span class="footer__contact-value text-l hover-color">{{ phone.label }}</span>
					</a>
					<a class="footer__contact" :href="footer.contactsInfo.email.url" :title="footer.contactsInfo.email.title">
						<span class="footer__contact-title text-s">{{ footer.contactsInfo.email.title }}</span>
						<span class="footer__contact-value text-l hover-color">{{ footer.contactsInfo.email.label }}</span>
					</a>
				</div>
			</div>

			<div class="footer__bottom">
				<p class="footer__copyright text-s">{{ footer.copyright }}</p>
				<p class="footer__requisites text-s">{{ footer.requisites }}</p>
			</div>
		</div>
	</footer>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.footer {
	position: relative;
	padding: 48px 0 32px;
	overflow: hidden;
	color: variables.$color-white;
	background-color: variables.$color-surface;
	border-top: 1px solid variables.$glass-border;

	// Тёплое свечение из-под низа — «фары в тумане», статичное, без анимации.
	&::before {
		position: absolute;
		bottom: -180px;
		left: 50%;
		width: 900px;
		height: 300px;
		pointer-events: none;
		content: '';
		background: radial-gradient(ellipse at center, rgb(0 179 60 / 22%) 0%, rgb(0 179 60 / 0%) 70%);
		transform: translateX(-50%);
	}

	@media (min-width: variables.$desktop) {
		padding: 80px 0 40px;
	}

	&__inner {
		position: relative;
		z-index: 1;
		display: grid;
		grid-template-columns: 100%;
		gap: 40px;

		@media (min-width: variables.$mobile-big) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: variables.$desktop) {
			grid-template-columns: 2fr 1fr 1fr 1.4fr;
			gap: 40px;
		}
	}

	&__brand {
		display: flex;
		flex-direction: column;
		align-items: flex-start;

		@media (min-width: variables.$mobile-big) {
			grid-column: span 2;
		}

		@media (min-width: variables.$desktop) {
			grid-column: auto;
		}
	}

	&__slogan {
		max-width: 380px;
		margin: 20px 0 24px;
		color: variables.$color-gray-7;
	}

	&__socials {
		margin-top: auto;
	}

	&__nav {
		display: flex;
		flex-direction: column;
	}

	&__nav-title {
		margin-bottom: 20px;
		color: variables.$color-accent;
		text-transform: uppercase;
		letter-spacing: 0.14em;
	}

	&__nav-item {
		margin-bottom: 14px;

		&:last-child {
			margin-bottom: 0;
		}
	}

	&__nav-link {
		color: variables.$color-gray-7;
	}

	&__contacts {
		display: flex;
		flex-direction: column;
	}

	&__contact {
		display: flex;
		flex-direction: column;
		gap: 4px;
		margin-bottom: 16px;

		&:last-child {
			margin-bottom: 0;
		}
	}

	&__contact-title {
		color: variables.$color-gray-4;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	&__contact-value {
		color: variables.$color-white;
	}

	&__bottom {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding-top: 32px;
		margin-top: 40px;
		border-top: 1px solid variables.$glass-border;

		@media (min-width: variables.$desktop) {
			flex-direction: row;
			gap: 40px;
			align-items: flex-start;
			justify-content: space-between;
		}
	}

	&__copyright {
		flex-shrink: 0;
		color: variables.$color-gray-7;
	}

	&__requisites {
		max-width: 720px;
		color: variables.$color-gray-4;
	}
}
</style>
