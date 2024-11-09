import * as Sentry from "@sentry/remix";

Sentry.init({
    dsn: "https://e49067fe68f158096836c8068ebc0f6e@o4507652485087232.ingest.us.sentry.io/4508270748368896",
    tracesSampleRate: 1,
    autoInstrumentRemix: true
})