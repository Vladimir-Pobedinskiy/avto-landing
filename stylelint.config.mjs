export default {
	extends: [
		'stylelint-config-standard',
		'stylelint-config-standard-scss',
		'stylelint-config-recommended-vue',
		'stylelint-config-recess-order',
		'stylelint-prettier/recommended',
	],
	overrides: [
		{
			files: ['*.vue', '**/*.vue'],
			customSyntax: 'postcss-html',
		},
		{
			files: ['*.scss', '**/*.scss'],
			customSyntax: 'postcss-scss',
		},
	],
	rules: {
		'at-rule-no-unknown': null,
		'media-query-no-invalid': null,
		'scss/at-rule-no-unknown': null,
		'declaration-property-value-no-unknown': null,
		'selector-pseudo-element-no-unknown': null,
		'selector-pseudo-class-no-unknown': null,
		'property-no-vendor-prefix': null,
		'block-no-empty': null, // пустые стили
		'color-named': 'never', // Запретить именованные цвета
		'color-no-invalid-hex': true, // Проверка на валидность hex-цветов (оставляем включенной)
		'color-function-notation': null, // Отключаем проверку нотации цветовых функций (rgba, hsla)
		'selector-class-pattern': null, //отключение необходимости использования kebab-case для имен классов
		'selector-id-pattern': null,
		'no-descending-specificity': null, // ложные срабатывания на вложенных BEM-модификаторах (&_row / &_column)
	},
}
