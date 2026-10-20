# Hemolog API — agent skill

Use this skill to read a Hemolog user's treatment history or log new treatments through the Hemolog REST API. Hemolog is a personal hemophilia treatment log.

## Authentication

1. Every request needs the user's API key. The user creates keys on their Hemolog profile page (`https://hemolog.com/app/profile`) and can have several, each with a name.
2. Send the key as an HTTP header on every request:

   ```
   Authorization: Bearer YOUR_API_KEY
   ```

   API keys start with `hml_`. Treat the key like a password: anyone who has it can read the user's treatments and log new ones. Never print it, log it, or include it in URLs when a header works.
3. The key stops working immediately if the user revokes it. If a request returns "Invalid API key", ask the user to create a new key on their profile page and use that.

## Base URL

```
https://hemolog.com
```

All endpoints accept and return JSON.

## Endpoints

### GET /api/treatments

Returns every non-deleted treatment, newest `date` first.

### GET /api/recent-treatments

Returns the three most recent treatments (same slice as the user's public emergency page), sorted by `createdAt`, newest first.

This endpoint also accepts `?alertid=YOUR_ALERT_ID` — the public ID printed on the user's emergency card — instead of an API key. The other endpoints require the key.

### POST /api/log-treatment

Logs a new treatment. Send a JSON body with any subset of treatment fields:

```json
{
  "type": "PROPHY",
  "date": "2026-10-18",
  "sites": "Left arm",
  "medication": {
    "brand": "Advate",
    "units": 3000,
    "lot": "LOT5555"
  }
}
```

Missing fields are copied from the user's most recent treatment, so `{ "type": "PROPHY" }` is enough for a routine log. `createdAt`, `deletedAt`, and `uid` are set by the server. Returns `{ "message": "Success" }`.

## Treatment fields

- `type`: `PROPHY`, `BLEED`, `PREVENTATIVE`, or `ANTIBODY`
- `date`: `YYYY-MM-DD`
- `cause`: bleed cause or notes (empty string for a typical prophylaxis log)
- `sites`: infusion site, e.g. `Left arm`
- `medication.brand`: product name
- `medication.units`: dose as a number
- `medication.lot`: optional lot number

## Errors

Failed requests return HTTP 500 with a JSON body containing an `error` string:

- `"Access denied. Missing api key."` — no key was sent; add the Authorization header.
- `"Invalid API key. Reset your key on your profile page at Hemolog.com"` — the key was revoked or never existed; ask the user for a new key.
- `"Missing treatment data."` — a POST without a JSON body.

## Rules

- Never modify or delete anything except by these endpoints; the API cannot delete treatments.
- Deleted treatments are never returned by the API.
- If a request fails, show the user the error message instead of retrying repeatedly.
