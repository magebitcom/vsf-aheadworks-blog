module.exports = {
  extends: [
    'plugin:vue/recommended'
  ],
  rules: {
    semi: 'off',
    indent: [2, 2, { SwitchCase: 1 }],
    "no-console": ["error", {
      "allow": ["warn", "error"]
    }],
    "object-curly-spacing": [1, "always"],
    "space-before-function-paren": [1, "always"],
    "vue/no-use-v-if-with-v-for": 0,
    "vue/no-v-html": 0,
    "vue/component-name-in-template-casing": ["error", "kebab-case", {
      "registeredComponentsOnly": true
    }]
  }
};
