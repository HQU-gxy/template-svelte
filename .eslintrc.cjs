module.exports = {
    // https://github.com/mightyiam/eslint-config-love
    extends: ["plugin:svelte/recommended", "love"],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        extraFileExtensions: ['.svelte'] // This is a required setting in `@typescript-eslint/parser` v4.24.0.
    },

    overrides: [
        // https://typescript-eslint.io/troubleshooting/#i-get-errors-telling-me-eslint-was-configured-to-run--however-that-tsconfig-does-not--none-of-those-tsconfigs-include-this-file
        {
            files: ['**/*.js'],
            extends: [tseslint.configs.disableTypeChecked],
        },
        {
            files: ["*.svelte"],
            parser: 'svelte-eslint-parser',
            parserOptions: {
                parser: '@typescript-eslint/parser'
            }
        },
        {
            files: ["*.ts", "*.svelte"],
            rules: {
                "@typescript-eslint/naming-convention": [
                    "warn",
                    {
                        "selector": "variable",
                        "format": ["camelCase", "UPPER_CASE", "snake_case"]
                    }
                ],
                "@typescript-eslint/quotes": ["error", "double"],
                "@typescript-eslint/comma-dangle": "off",
            }
        }
    ]
}