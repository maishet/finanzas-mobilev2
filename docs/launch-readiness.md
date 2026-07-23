# Launch Readiness

## Completed

- Android preview validated for startup, email authentication, session persistence, onboarding, core finance flows, and back navigation inside sheets.
- API requests now time out after 30 seconds and return actionable network and rate-limit errors.
- Core loading-error states offer an explicit retry action.
- API responses include an `X-Request-Id`; request and unhandled-error events are logged as structured JSON.
- API applies an in-memory per-client rate limit. Configure `API_RATE_LIMIT_PER_MINUTE` in Render for the production threshold.
- Mobile unit tests cover auth routing and actionable API error mapping.
- API includes a reproducible authenticated performance script and a Render cron definition for Gmail watch renewal.

## Remaining Before Public Launch

- Configure the Supabase Vault secrets and apply `20260723041844_gmail_watch_renewal.sql`, then verify the first Gmail watch renewal run. Render only needs `INTERNAL_CRON_SECRET`; `OPS_ALERT_WEBHOOK_URL` remains optional.
- Measure the first request after Render sleeps; the warm authenticated baseline is documented in the API operations runbook.
- Verify managed backup retention and perform a restore drill in a separate Supabase project.
- Host completed privacy policy and terms on HTTPS URLs, then complete a Play closed-test release.
- Add mobile tests for account, movement, and debt mutation flows.
