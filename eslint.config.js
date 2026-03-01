// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginImport from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig(
    {
        ignores: [
            "eslint.config.js",
            "buildFrontend.js",
            "buildServer.js",
            "build.mjs",
        ]
    },[
    // Base ESLint recommended rules
    js.configs.recommended,

    // TypeScript recommended rules
    ...tseslint.configs.recommended,

    {
        files: ["**/*.{js,mjs,cjs,ts}"],
        languageOptions: {
            ecmaVersion: 2024, // Latest ECMAScript features
            sourceType: "module", // Change to "script" if not using ESM
            globals: {
                ...globals.node, // Node.js globals like __dirname, process, etc.
            },
            parserOptions: {
                project: [
                    "./tsconfig.frontend.json", // Required for type-aware linting
                    "./tsconfig.server.json"
                ],
                tsconfigRootDir: process.cwd(),
            },
        },
        plugins: {
            import: pluginImport,
            prettier,
        },
        rules: {
            // General rules
            "no-unused-vars": "off", // Disabled in favor of TS version
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
            "no-console": "off",

            // Import plugin rules
            "import/no-unresolved": "error",
            "import/order": [
                "warn",
                {
                    groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
                    alphabetize: { order: "asc", caseInsensitive: true },
                },
            ],

            // Prettier integration
            "prettier/prettier": [
                "error",
                {
                    singleQuote: true,
                    semi: true,
                    trailingComma: "es5",
                },
            ],
        },
    },
]);
