import * as Sentry from "@sentry/nuxt";

Sentry.init({
    // If set up, you can use your runtime config here
    // dsn: useRuntimeConfig().public.sentry.dsn,
    dsn: "https://2f97bf17bc09e2bb4ad44c7b67826042@o4509796661657600.ingest.de.sentry.io/4509796663623760",

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,

    // Enable logs to be sent to Sentry
    enableLogs: true,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
});
