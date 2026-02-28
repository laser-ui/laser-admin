/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard', 'stylelint-config-recess-order'],
  rules: {
    'at-rule-no-unknown': null,
    'at-rule-empty-line-before': null,
    'import-notation': null,
    'nesting-selector-no-missing-scoping-root': null,
    'selector-class-pattern': null,
    'selector-not-notation': 'simple',
    'declaration-block-no-redundant-longhand-properties': [
      true,
      {
        ignoreShorthands: ['inset'],
      },
    ],
  },
  overrides: [
    {
      files: ['*.scss', '**/*.scss'],
      customSyntax: 'postcss-scss',
      extends: ['stylelint-config-recommended-scss'],
      rules: {
        'declaration-property-value-allowed-list': {
          '/color/': ['/var/', '/\\$/', 'currentcolor', 'transparent', 'unset', 'inherit'],
          'font-size': ['/var/', '/\\$/', '/[0-9]+em$/', 'unset', 'inherit'],
          'border-radius': ['/var/', '/\\$/', '50%', '0', 'inherit'],
        },
        'declaration-property-value-disallowed-list': {
          transition: ['/all/', '/[0-9]ms/'],
        },
        'selector-pseudo-class-no-unknown': [
          true,
          {
            ignorePseudoClasses: ['global'],
          },
        ],
      },
    },
    {
      files: ['*.html', '**/*.html'],
      customSyntax: 'postcss-html',
    },
    {
      files: ['*.md', '**/*.md'],
      customSyntax: 'postcss-markdown',
    },
  ],
};
