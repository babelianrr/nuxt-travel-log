import antfu from "@antfu/eslint-config";

// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

// TODO: add tailwindcss plugin

export default withNuxt(
    antfu(
        {
            type: "app",
            vue: true,
            yaml: false,
            typescript: true,
            formatters: true,
            stylistic: {
                indent: 4,
                semi: true,
                quotes: "double",
            },
            ignores: ["**/lib/db/meta/*", "**/lib/db/*.sql"],
        },
        {
            rules: {
                "ts/no-redeclare": ["off"],
                "ts/consistent-type-definitions": ["error", "type"],
                "no-console": ["warn"],
                "antfu/no-top-level-await": ["off"],
                "node/prefer-global/process": ["off"],
                "node/no-process-env": ["error"],
                "perfectionist/sort-imports": [
                    "error",
                    {
                        tsconfigRootDir: ".",
                    },
                ],
                "unicorn/filename-case": [
                    "error",
                    {
                        case: "kebabCase",
                        ignore: ["README.md"],
                    },
                ],
            },
        },
    ),
);
