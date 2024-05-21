/* eslint-env node */
// require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    extends: [
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:unicorn/recommended",
        "xo",
        "xo/browser",
        "prettier",
        "plugin:@typescript-eslint/recommended"
    ],
    rules: {
        "arrow-body-style": "off",
        "capitalized-comments": "off",
        "comma-dangle": ["error", "never"],
        "import/extensions": [
            "error",
            "ignorePackages",
            {
                js: "always"
            }
        ],
        "import/first": "error",
        "import/newline-after-import": "error",
        "import/no-absolute-path": "error",
        "import/no-amd": "error",
        "import/no-cycle": [
            "error",
            {
                ignoreExternal: true
            }
        ],
        "import/no-duplicates": "error",
        "import/no-extraneous-dependencies": "error",
        "import/no-mutable-exports": "error",
        "import/no-named-as-default": "error",
        "import/no-named-as-default-member": "error",
        "import/no-named-default": "error",
        "import/no-self-import": "error",
        "import/no-unassigned-import": [
            "error",
            { allow: ["**/*.scss", "**/*.css"] }
        ],
        "import/no-useless-path-segments": "error",
        "import/order": "error",
        indent: [
            "error",
            4,
            {
                MemberExpression: "off",
                SwitchCase: 1
            }
        ],
        "max-params": ["warn", 5],
        "multiline-ternary": ["error", "always-multiline"],
        "new-cap": [
            "error",
            {
                properties: false
            }
        ],
        "no-console": "error",
        "no-negated-condition": "off",
        "object-curly-spacing": ["error", "always"],
        "operator-linebreak": [
            "error",
            "after",
            {
                overrides: {
                    "?": "before",
                    ":": "before"
                }
            }
        ],
        "prefer-template": "error",
        quotes: ["error", "double"],
        semi: ["error", "always"],
        strict: "error",
        "unicorn/explicit-length-check": "off",
        "unicorn/filename-case": "off",
        "unicorn/no-array-callback-reference": "off",
        "unicorn/no-array-method-this-argument": "off",
        "unicorn/no-null": "off",
        "unicorn/no-typeof-undefined": "off",
        "unicorn/no-unused-properties": "error",
        "unicorn/numeric-separators-style": "off",
        "unicorn/prefer-array-flat": "off",
        "unicorn/prefer-at": "off",
        "unicorn/prefer-dom-node-dataset": "off",
        "unicorn/prefer-module": "off",
        "unicorn/prefer-query-selector": "off",
        "unicorn/prefer-spread": "off",
        "unicorn/prefer-string-replace-all": "off",
        "unicorn/prevent-abbreviations": "off",
        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_"
            }
        ]
    },
    overrides: [
        {
            files: ["src/**/*.js"],
            env: {
                browser: true
            },
            rules: {
                "unicorn/filename-case": "off"
            }
        },
        {
            files: ["webpack.*.js", "jest.config.js"],
            plugins: ["node"],
            env: {
                node: true
            },
            rules: {
                "no-console": "off",
                "@typescript-eslint/no-var-requires": "off"
            }
        },
        {
            files: ["**/TESTS/**"],
            plugins: ["jest"],
            env: {
                "jest/globals": true
            },
            extends: ["plugin:jest/recommended"],
            parserOptions: {
                sourceType: "module"
            },
            rules: {
                "no-console": "off",
                "unicorn/consistent-function-scoping": "off",
                "unicorn/no-useless-undefined": "off",
                "unicorn/prefer-add-event-listener": "off",
                "@typescript-eslint/no-var-requires": "off"
            }
        },
        {
            files: ["**/*.md"],
            plugins: ["markdown"],
            processor: "markdown/markdown"
        }
    ],
    settings: {
        "import/resolver": {
            alias: {
                map: [
                    ["@", "./src"],
                    ["@assets", "./assets"]
                ],
                extensions: [".ts", ".js", ".jsx", ".json", ".scss"]
            },
            node: {
                extensions: [".ts", ".js", ".jsx", ".json", ".scss"]
            }
        }
    }
};
