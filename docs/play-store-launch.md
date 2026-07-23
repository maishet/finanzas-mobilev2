# Play Store Launch Checklist

## Store Listing

- App name: Fint.
- Short description: track accounts, movements, and debts in one place.
- Prepare at least two phone screenshots showing dashboard, movement registration, and debts.
- Use the production Android application ID `com.fint.finanzasmobilev2`.
- Publish first through a closed testing track before production.

## Privacy Policy Draft

Fint stores financial records that users enter, including accounts, movements, categories, debts, and optional Gmail-derived pending movements. Gmail is read only after the user connects an account and only messages matching user-configured sender filters are considered. Fint never creates a financial movement from Gmail without user confirmation.

Authentication is handled by Supabase. Financial data is stored in Supabase and processed by the Fint API. OAuth tokens for Gmail are encrypted server-side and removed when the user disconnects Gmail.

The public policy must include the operator's legal name, support email, jurisdiction, effective date, deletion request process, and the final hosted policy URL before the Play Store submission.

## Terms Draft

Fint provides personal-finance organization tools and does not provide financial, banking, tax, or investment advice. Users are responsible for reviewing entries and decisions made from the information shown by the app. Gmail detection is a suggestion feature and requires user confirmation.

The public terms must include the operator's legal name, support email, jurisdiction, effective date, account termination process, acceptable use rules, and the final hosted terms URL before submission.

## Release Gate

- Google sign-in and Gmail multi-account flows pass on the release APK.
- Privacy policy and terms are hosted on public HTTPS URLs and added to Play Console.
- Support email is monitored.
- Closed-test feedback has no unresolved blocker.
