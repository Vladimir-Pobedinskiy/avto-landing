<script setup lang="ts">
import { Form, Field } from 'vee-validate'
import * as Yup from 'yup'
import type { TFormKey } from '~~/interfaces/IFormUnit'

const props = defineProps<{
	formKey: TFormKey
}>()

const formRef = ref<Ref | null>(null)
interface IForm {
	tel: string
	name: string
	email: string
	comment: string
	agree: boolean
}
const form = reactive<IForm>({
	tel: '',
	name: '',
	email: '',
	comment: '',
	agree: false,
})
const schema = Yup.object().shape({
	tel: Yup.string().required('Телефон обязателен для заполнения').min(18, 'Неверный формат номера телефона'),
	name: Yup.string()
		.required('Имя обязательно для заполнения')
		.max(50, 'Максимальное количество символов: 50')
		.matches(/^(?!\s+$).*$/, 'Не может содержать пробелы, если строка состоит только из пробелов')
		.matches(/^(?!.*["'<>;:.,{}[\]|&#%?=+^~/-]).*$/, 'Не может содержать спец. символы')
		.matches(/^(?!.*\d).*$/, 'Не может содержать цифры')
		.matches(/^(?!.*[a-zA-Z]).*$/, 'Не может содержать латинские буквы')
		.matches(/^(?!\s.*$)(?!.*\s$)/, 'Не может начинаться или заканчиваться пробелом')
		.matches(/^(?!.*\s{2,}).*$/, 'Не может содержать несколько пробелов между словами'),
	email: Yup.string().required('Email обязателен для заполнения').email('Неверный формат электронной почты'),
	comment:
		props.formKey === 'select-atv'
			? Yup.string()
					.required('Поле обязательно для заполнения')
					.max(100, `Максимальное число символов: 100`)
					.matches(/^(?!\s+$).*$/, 'Не может содержать пробелы, если строка состоит только из пробелов')
					.matches(/^(?!.*\d).*$/, 'Не может содержать цифры')
					.matches(/^(?!.*[a-zA-Z]).*$/, 'Не может содержать латинские буквы')
					.matches(/^(?!\s.*$)(?!.*\s$)/, 'Не может начинаться или заканчиваться пробелом')
					.matches(/^(?!.*\s{2,}).*$/, 'Не может содержать несколько пробелов между словами')
			: Yup.string().notRequired(),
	agree: Yup.bool().required().oneOf([true], 'Необходимо принять условия'),
})

const isOpenModalApplicationSuccess = ref<boolean>(false)
const handleApplicationSuccessModal = (flag: boolean) => {
	isOpenModalApplicationSuccess.value = flag
}

const isOpenModalError = ref<boolean>(false)
const responseError = ref<any>(null)
const handleModalError = (flag: boolean) => {
	isOpenModalError.value = flag
}

const clearForm = () => {
	form.tel = ''
	form.name = ''
	form.comment = ''
	form.email = ''
	form.agree = false
}

const isLoading = ref<boolean>(false)
const onSubmit = async (): Promise<void> => {
	try {
		isLoading.value = true
		await $fetch('/api/application/', {
			method: 'POST',
			body: {
				key: props.formKey,
				tel: form.tel,
				name: form.name,
				email: form.email,
				comment: props.formKey === 'select-atv' ? form.comment : null,
				agree: form.agree,
			},
		})
		clearForm()
		await formRef.value.resetForm()
		handleApplicationSuccessModal(true)
	} catch (error: any) {
		if (error.statusCode === 422) {
			formRef.value.setErrors(error.data.errors)
		} else {
			responseError.value = error
			handleModalError(true)
		}
	} finally {
		isLoading.value = false
	}
}
</script>

<template>
	<div class="application-box">
		<template v-if="isLoading">
			<AppLoading :is-loading="isLoading" />
		</template>
		<div class="application">
			<Form
				ref="formRef"
				v-slot="{ errors }"
				:validation-schema="schema"
				name="form-application"
				action="#"
				method="POST"
				class="form-application"
				@submit="onSubmit"
			>
				<div
					:class="[
						'form-application__inner',
						{
							'form-application__inner_error':
								Object.keys(errors) && Object.keys(errors).filter(key => key !== 'agree').length > 0,
						},
					]"
				>
					<div
						:class="[
							'form-application__inner-box',
							{
								'form-application__inner-box_error':
									Object.keys(errors) && Object.keys(errors).filter(key => key !== 'agree').length > 0,
							},
						]"
					>
						<Field v-slot="{ field }" name="tel">
							<UIInput
								v-model:value="form.tel"
								v-bind="field"
								:error-value="errors.tel"
								type="tel"
								name="tel"
								placeholder="Телефон*"
								autocomplete="off"
								:disabled="isLoading"
							/>
						</Field>

						<Field v-slot="{ field }" name="name">
							<UIInput
								v-model:value="form.name"
								v-bind="field"
								:error-value="errors.name"
								type="text"
								name="name"
								placeholder="Имя*"
								autocomplete="off"
								:disabled="isLoading"
							/>
						</Field>
					</div>

					<div
						:class="[
							'form-application__inner-box',
							{
								'form-application__inner-box_error':
									Object.keys(errors) && Object.keys(errors).filter(key => key !== 'agree').length > 0,
							},
						]"
					>
						<Field v-slot="{ field }" v-model:value="form.email" name="email">
							<UIInput
								v-model:value="form.email"
								v-bind="field"
								:error-value="errors.email"
								type="email"
								name="email"
								placeholder="Email*"
								autocomplete="off"
								:disabled="isLoading"
							/>
						</Field>

						<Field v-slot="{ field }" name="comment">
							<UIInput
								v-if="formKey === 'select-atv'"
								v-model:value="form.comment"
								v-bind="field"
								:error-value="errors.comment"
								type="text"
								name="comment"
								placeholder="Задача и регион эксплуатации*"
								autocomplete="off"
								:disabled="isLoading"
							/>
						</Field>
					</div>
				</div>

				<div class="form-application__bottom">
					<Field v-slot="{ field }" v-model:model-value="form.agree" name="agree">
						<UICheckbox
							v-model:model-value="form.agree"
							v-bind="field"
							:error-value="errors.agree"
							name="agree"
							class="form-application__agree"
							:disabled="isLoading"
						>
							<template #content>
								<span class="form-application__agree-content text-m">
									Я даю согласие на обработку персональных данных, в соответствии с
									<span class="form-application__agree-link"> Политикой конфиденциальности </span>
									и соглашаюсь с&nbsp;
									<span class="form-application__agree-link"> Договором оферты </span>
								</span>
							</template>
						</UICheckbox>
					</Field>

					<div class="form-application__btn-submit">
						<UIButton
							as="button"
							type="submit"
							variant="primary"
							size="big"
							:full="true"
							label="Отправить заявку"
							:disabled="isLoading"
						/>
					</div>
				</div>
			</Form>
		</div>

		<UIModal
			v-model:model-value="isOpenModalApplicationSuccess"
			modal-id="modal-application-success"
			name="ModalApplicationSuccess"
			class="modal-success"
			@update:model-value="handleApplicationSuccessModal"
		>
			<template #body>
				<div class="modal-success__body">
					<p class="modal-success__title text-xl">Ваша заявка успешно отправлена!</p>
					<p class="modal-success__text text-m">Мы свяжемся с вами в ближайшее время</p>
				</div>
			</template>
		</UIModal>

		<ModalError v-model:model-value="isOpenModalError" :error="responseError" @update:model-value="handleModalError" />
	</div>
</template>

<style lang="scss">
@use '@/assets/scss/general/variables';

.application {
	display: grid;
	grid-template-columns: 100%;
	gap: 24px;

	&__title {
		margin-bottom: 16px;
	}

	&__socials {
		position: relative;
		padding-top: 16px;

		@media (min-width: variables.$desktop) {
			padding-top: 54px;
			margin-top: auto;
		}
	}
}

.form-application {
	&__inner {
		display: grid;
		grid-template-columns: 100%;
		gap: 32px;

		@media (min-width: variables.$desktop) {
			gap: 48px;
		}

		&_error {
			gap: 32px 48px;
		}
	}

	&__inner-box {
		display: grid;
		grid-template-columns: 100%;
		gap: 32px;

		@media (min-width: variables.$desktop) {
			grid-template-columns: repeat(2, 1fr);
			gap: 40px;
		}

		&_full {
			grid-template-columns: 100%;
		}

		&_error {
			gap: 32px 48px;
		}
	}

	&__bottom {
		display: grid;
		grid-template-columns: 100%;
		gap: 32px;
		margin-top: 24px;

		@media (min-width: variables.$desktop) {
			gap: 64px;
			margin-top: 32px;
		}
	}

	&__agree-content {
		width: 100%;
		max-width: 550px;
		color: variables.$color-white;
	}

	&__agree-link {
		position: relative;
		display: inline-block;
		color: variables.$color-gray-7;

		&::after {
			position: absolute;
			top: 96%;
			left: 0;
			width: 100%;
			height: 1px;
			content: '';
			background-color: variables.$color-gray-7;

			@media (min-width: variables.$desktop) {
				transition: background-color 0.4s ease-in-out;
			}
		}

		@media (min-width: variables.$desktop) {
			transition: color 0.4s ease-in-out;

			&:hover {
				color: variables.$color-accent;
				transition: color 0.4s ease-in-out;

				&::after {
					background-color: variables.$color-accent;
					transition: background-color 0.4s ease-in-out;
				}
			}
		}

		&:disabled,
		&.disabled {
			pointer-events: none;
			cursor: default;
			opacity: 0.4;
		}
	}

	&__btn-submit {
		width: 100%;
		max-width: 340px;
	}

	.label-checkbox {
		align-items: flex-start;
	}

	.label-checkbox__checkbox-icon-wrapper {
		top: 8%;
	}
}
</style>
