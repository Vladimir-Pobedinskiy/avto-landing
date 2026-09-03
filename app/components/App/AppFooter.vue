<script setup lang="ts">
import { useGeneralStore } from '@/stores/storeGeneral'

const storeGeneral = useGeneralStore()
const footer = computed(() => storeGeneral.footer)
const socials = computed(() => storeGeneral.socials)

const { handleAnchorClick } = useAnchorNav()
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
							:href="item.url"
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
							:href="item.url"
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
	padding: 48px 0 32px;
	position: relative;
	overflow: hidden;
	border-top: 1px solid variables.$glass-border;
	background-color: variables.$color-surface;
	color: variables.$color-white;

	// Тёплое свечение из-под низа — «фары в тумане», статичное, без анимации.
	&::before {
		content: '';
		position: absolute;
		left: 50%;
		bottom: -180px;
		width: 900px;
		height: 300px;
		transform: translateX(-50%);
		background: radial-gradient(ellipse at center, rgb(0 179 60 / 22%) 0%, rgb(0 179 60 / 0%) 70%);
		pointer-events: none;
	}

	@media (min-width: variables.$desktop) {
		padding: 80px 0 40px;
	}

	&__inner {
		position: relative;
		display: grid;
		grid-template-columns: 100%;
		gap: 40px;
		z-index: 1;

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
		margin: 20px 0 24px;
		max-width: 380px;
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
		margin-bottom: 16px;
		display: flex;
		flex-direction: column;
		gap: 4px;

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
		padding-top: 32px;
		margin-top: 40px;
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 8px;
		border-top: 1px solid variables.$glass-border;
		z-index: 1;

		@media (min-width: variables.$desktop) {
			flex-direction: row;
			align-items: flex-start;
			justify-content: space-between;
			gap: 40px;
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
