# Launch Readiness

## Completed

- Android preview validated for startup, email authentication, session persistence, onboarding, core finance flows, and back navigation inside sheets.
- API requests now time out after 30 seconds and return actionable network and rate-limit errors.
- Core loading-error states offer an explicit retry action.
- API responses include an `X-Request-Id`; request and unhandled-error events are logged as structured JSON.
- API applies an in-memory per-client rate limit. Configure `API_RATE_LIMIT_PER_MINUTE` in Render for the production threshold.

## Remaining Before Public Launch

- Validate Google sign-in after preserving both the Supabase and Gmail callbacks in Google Cloud.
- Validate Gmail with multiple accounts, exact senders, sync, pending confirmation, discard, and deduplication.
- Configure an external error-monitoring service for mobile and API production errors.
- Restrict `CORS_ORIGINS` to known web origins if a web client is released.
- Run a performance test with a realistic transaction history and measure the first request after Render sleeps.
- Add mobile tests for API error handling, auth redirects, and critical mutation flows.
