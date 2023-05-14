module.exports = {
    root: true,
    env: {
        node: true,
        browser: true
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:vue/vue3-essential",
        "plugin:prettier/recommended"
    ],
    plugins: ['@typescript-eslint'],
    parserOptions: {
        parser: "@typescript-eslint/parser",
        ecmaVersion: 6,
        requireConfigFile: false
    },
    rules: {
        "vue/no-multiple-template-root": "off",
        // vue 3.3 not supported yet
        // https://github.com/vuejs/eslint-plugin-vue/issues/2127
        "vue/no-setup-props-destructure": "off",
    }
};