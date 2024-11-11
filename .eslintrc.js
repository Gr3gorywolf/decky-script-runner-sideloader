module.exports = {
  ignorePatterns: ['.eslintrc.js'],
  extends: ['airbnb', 'airbnb-typescript', 'airbnb/hooks', 'plugin:@stylistic/all-extends', 'plugin:@stylistic/disable-legacy'],
  plugins: ['@stylistic'],
  parserOptions: {
      project: './tsconfig.json',
  },
  "rules": {
      "array-callback-return": "warn", //refactor to error
      "block-scoped-var": "warn", // refactor to error
      "eqeqeq": "warn",
      "for-direction": "warn", // refactor to error
      "no-await-in-loop": "off",
      "no-cond-assign": "warn", // refactor to error
      "no-const-assign": "warn", // refactor to error
      "no-constant-binary-expression": "warn", // refactor to error
      "no-constant-condition": "off",
      "no-dupe-args": "warn", // refactor to error
      "no-dupe-class-members": "warn", // refactor to error
      "no-dupe-else-if": "warn", // refactor to error
      "no-dupe-keys": "warn", // refactor to error
      "no-duplicate-case": "warn", // refactor to error
      "no-func-assign": "warn", // refactor to error
      "no-import-assign": "warn", // refactor to error
      "no-prototype-builtins": "off",
      "no-template-curly-in-string": "warn", // refactor to error
      "no-this-before-super": "warn",
      "no-unreachable": "warn", // refactor to error
      "no-unreachable-loop": "warn", // refactor to error
      "no-unsafe-finally": "warn",
      "no-unsafe-negation": "warn", // refactor to error
      "no-unsafe-optional-chaining": "warn",
      "valid-typeof": "warn", // refactor to error
      "arrow-body-style": "off",
      "camelcase": "warn",
      "complexity": "off",
      "consistent-return": "off",
      "curly": "warn",
      "default-case": "warn",
      "default-case-last": "warn", // refactor to error
      "default-param-last": "warn",
      "init-declarations": "off",
      "max-classes-per-file": "off",
      "max-depth": "warn",
      "max-lines": "off",
      "max-len": "off",
      "max-nested-callbacks": "warn",
      "max-params": ["warn", 6],
      "no-alert": "off",
      "no-bitwise": "off",
      "no-case-declarations": "warn",
      "no-continue": "off",
      "no-else-return": "warn", // refactor to error
      "no-empty": "warn", // refactor to error
      "no-empty-function": "warn",
      "no-eval": "warn", // refactor to error
      "no-global-assign": "warn", // refactor to error
      "no-implicit-globals": "off",
      "no-inline-comments": "off",
      "no-inner-declarations": "warn", // refactor to error
      "no-lonely-if": "warn",
      "no-magic-numbers": "off",
      "no-multi-str": "off",
      "no-negated-condition": "off",
      "no-nested-ternary": "warn", // refactor to error
      "no-new": "off",
      "no-param-reassign": "warn", // refactor to error
      "no-plusplus": "off",
      "no-redeclare": "warn", // refactor to error
      "no-restricted-exports": "off",
      "no-restricted-globals": "off",
      "no-restricted-imports": "off",
      "no-restricted-properties": "off",
      "no-restricted-syntax": "off",
      "no-return-assign": "warn",
      "no-ternary": "off",
      "no-undefined": "warn", // refactor to error
      "no-underscore-dangle": "off",
      "no-unneeded-ternary": "warn",
      "no-unused-expressions": "warn",
      "no-unused-labels": "warn",
      "no-useless-catch": "warn",
      "no-useless-concat": "warn",
      "no-useless-escape": "warn",
      "no-useless-rename": "warn", // refactor to error
      "no-useless-return": "warn", // refactor to error
      "no-promise-executor-return": "warn", //refactor to error
      "no-script-url": "off", // refactor to error
      "no-sequences": "warn", // refactor to error
      "no-throw-literal": "off",
      "no-var": "warn", // refactor to error
      "no-void": "off",
      "no-warning-comments": "off",
      "object-shorthand": "off",
      "one-var": "warn",
      "operator-assignment": "off", // refactor to error
      "prefer-const": "warn", // refactor to error
      "prefer-destructuring": "off",
      "prefer-numerical-literals": "off",
      "prefer-template": "warn", // refactor to error
      "prefer-regex-literals": "warn",
      "radix": "warn",
      "vars-on-top": "warn", // refactor to error
      "guard-for-in": "warn",
      "require-await": "warn", // refactor to error
      "line-comment-position": "off",
      "global-require": "off",
      "no-buffer-constructor": "off",

      // @typescript-eslint
      "@typescript-eslint/no-unused-vars": "off", // checked by typescript already
      "@typescript-eslint/no-shadow": "off",
      "@typescript-eslint/no-loop-func": "warn",
      "@typescript-eslint/naming-convention": "off",
      "@typescript-eslint/no-redeclare": "off", // checked by typescript already
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/default-param-last": "warn",
      "@typescript-eslint/dot-notation": "off",
      "@typescript-eslint/return-await": "off",
      "@typescript-eslint/no-throw-literal": "off",

      // Import rules
      "import/prefer-default-export": "off", // change to error (airbnb default)
      "import/order": "off", // change to error (airbnb default)
      'import/extensions': 'off',
      "import/no-self-import": "off",
      "import/newline-after-import": "warn", // change to error
      "import/no-cycle": "warn",
      "import/no-duplicates": "warn", // change to error
      "import/no-useless-path-segments": "error",

      // Stylistic Rules
      "@stylistic/indent": ["error", 4],
      "@stylistic/indent-binary-ops": "off",
      "@stylistic/multiline-comment-style": "warn",
      "@stylistic/multiline-ternary": "off",
      "@stylistic/eol-last": "off",
      "@stylistic/space-before-function-paren": "off",
      "@stylistic/padded-blocks": "off",
      "@stylistic/arrow-parens": "off",
      "@stylistic/quote-props": "off",
      "@stylistic/function-call-argument-newline": "off",
      "@stylistic/comma-dangle": ["error", "always-multiline"],
      "@stylistic/dot-location": "off",
      "@stylistic/lines-between-class-members": "off",
      "@stylistic/member-delimiter-style": "off",
      "@stylistic/object-curly-spacing": "off",
      "@stylistic/no-confusing-arrow": "off",
      "@stylistic/implicit-arrow-linebreak": "off",
      "@stylistic/no-extra-parens": "warn",
      "@stylistic/lines-around-comment": "off",
  },
  overrides: [
      {
          // Front end specific rules
          files: ["web/src/**/*.ts", "web/src/**/*.tsx"],
          rules: {
              //jsx-a11y
              "jsx-a11y/iframe-has-title": "off", // change to error (airbnb default)
              "jsx-a11y/anchor-is-valid": "warn", // change to error
              "jsx-a11y/media-has-caption": "off", // change to error (airbnb default)
              "jsx-a11y/control-has-associated-label": "off", // change to error
              "jsx-a11y/click-events-have-key-events": "off",
              "jsx-a11y/no-static-element-interactions": "warn",
              "jsx-a11y/no-noninteractive-element-interactions": "off", // change to error (airbnb default)
              "jsx-a11y/label-has-associated-control": "off", // change to error (airbnb default)
              "jsx-a11y/img-redundant-alt": "warn", // change to error (airbnb default)

              //react
              "react/jsx-no-script-url": "off", // change to error
              "react/default-props-match-prop-types": "off",
              "react/jsx-props-no-multi-spaces": "off", // change to error (airbnb default)
              "react/prop-types": "off", // change to error
              "react/destructuring-assignment": "off",
              "react/jsx-indent": "off", // change to ["error", 4]
              "react/react-in-jsx-scope": "off",
              "react/jsx-indent-props": "off", // change to ["error", 4]
              "react/require-default-props": "off",
              "react/jsx-tag-spacing": "off", // change to error
              "react/jsx-one-expression-per-line": "off", // change to error (airbnb default)
              "react/jsx-curly-newline": "off",
              "react/jsx-wrap-multilines": "off", // change to error
              "react/no-unescaped-entities": "off", // change to error
              "react/jsx-props-no-spreading": "off",
              "react/jsx-boolean-value": "off", // change to error (airbnb default)
              "react/jsx-no-useless-fragment": "off", // change to error
              "react/jsx-closing-bracket-location": "off", // change to error (airbnb default)
              "react/jsx-first-prop-new-line": "off", // change to error (airbnb default)
              "react/jsx-no-bind": ["error", {
                  "allowFunctions": true,
                  "allowArrowFunctions": true
              }],
              "react/jsx-curly-brace-presence": "off",
              "react/button-has-type": "off", //change to error
              "react/jsx-closing-tag-location": "off", // change to error (airbnb default)
              "react/jsx-curly-spacing": "off", // change to error (airbnb default)
              "react/no-unstable-nested-components": "off", // change to error (airbnb default)
              "react/no-unused-prop-types": "off", // change to error
              "react/no-array-index-key": "off", // change to error
              "react/jsx-fragments": "off", // change to error
              "react/self-closing-comp": "off", // change to error
              "react/function-component-definition": "off",
              "react/jsx-no-constructed-context-values": "off", // change to error (airbnb default)
              "react/no-children-prop": "off",
              "react/jsx-max-props-per-line": "off", // change to error default of 1

              "react-hooks/rules-of-hooks": "off", // change to error
              "react-hooks/exhaustive-deps": "off",

              "no-console": "warn",

              "import/first": "error",

              //stylistic
              "@stylistic/array-bracket-newline": "off",
              "@stylistic/array-element-newline": "off",

              "max-lines-per-function": "off",
              "max-statements": "off",
              "no-use-before-define": "off",
              "@typescript-eslint/no-use-before-define": "off",
          }
      },
      {
          // Backend specific rules
          files: ["backend/src/**/*.js", "backend/src/**/*.ts", "backend/src/**/*.d.ts"],
          rules: {
              "no-console": "off",
              "import/first": "warn", // jest unit tests will not always follow this rule so warn
              "no-use-before-define": "warn", // refactor to error
              "@typescript-eslint/no-use-before-define": "warn", // change to error
              "max-lines-per-function": "off",
              "max-statements": "off",
              "@stylistic/array-element-newline": "off",
          },
          env: {
              node: true  // Ensures ESLint treats these files as Node.js scripts
          }
      }
  ]
};