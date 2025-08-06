import tailwindcss from "@tailwindcss/vite";

import "./lib/env";
import env from "./lib/env";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2025-05-15",
    devtools: { enabled: true },

    modules: [
        "@nuxt/eslint",
        "@nuxt/icon",
        "@nuxtjs/color-mode",
        "@pinia/nuxt",
        "@vee-validate/nuxt",
        "nuxt-csurf",
        "nuxt-maplibre",
        "nuxt-easy-lightbox",
        "@sentry/nuxt/module",
    ],

    css: ["~/assets/css/main.css"],

    runtimeConfig: {
        public: {
            s3BucketUrl: env.S3_BUCKET_URL,
        },
    },

    eslint: {
        config: {
            standalone: false,
        },
    },

    vite: {
        plugins: [
            tailwindcss(),
        ],
        optimizeDeps: {
            include: [
                "maplibre-gl",
            ],
        },
        server: {
            watch: {
                ignored: ["./docker-data/*"],
            },
        },
    },

    colorMode: {
        dataValue: "theme",
    },

    sentry: {
        sourceMapsUploadOptions: {
            org: import.meta.env.SENTRY_ORG,
            project: import.meta.env.SENTRY_PROJECT,
        },

        autoInjectServerSentry: "top-level-import",
    },

    sourcemap: {
        client: "hidden",
    },
});
