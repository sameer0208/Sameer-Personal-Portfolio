# Contact form → Google Sheets

The comm-link form posts to a **Google Apps Script web app** URL (`data-sheet-url` on `#comm-composer`).

## Why you see "Transmit failed"

A test of the current URL returns **HTTP 403 Access denied**. That means the deployment is **not public** (or the URL is from an old deployment). The portfolio code is fine; Google is blocking anonymous writes.

## Fix (5 minutes)

1. Open your Google Sheet → **Extensions** → **Apps Script**.
2. Paste the code from [`google-apps-script/ContactForm.gs`](../google-apps-script/ContactForm.gs) (or ensure your `doPost` uses `e.parameter.Name`, `Email`, `Mobile`, `Subject`, `Message`).
3. **Deploy** → **New deployment** → type **Web app**.
   - **Execute as:** Me
   - **Who has access:** **Anyone** (required)
4. Copy the **Web app URL** ending in `/exec` (not `/dev`).
5. In `index.html`, set it on the form:
   ```html
   data-sheet-url="https://script.google.com/macros/s/YOUR_NEW_ID/exec"
   ```
6. Redeploy the site and submit a test message. A new row should appear in the sheet.

## Sheet columns (recommended)

| Timestamp | Name | Email | Mobile | Subject | Message |
|-----------|------|-------|--------|---------|---------|

`ContactForm.gs` appends in that order.

## Verify the URL

Open the `/exec` URL in a browser (incognito is best). You should see:

```json
{"status":"comm.link relay online","sheetId":"1OWy_me9fyFqcx_vZUhEvioTCMJIryLfnnF5BtcZZbh4"}
```

If you see **"You need access"**, deployment access is still wrong.

**Current portfolio URL** (already wired in `index.html`):

`https://script.google.com/macros/s/AKfycbylpaNBLeQi3i1q9uZLLQKflrzlS20dx7jGgwc4UCq9-FXJzAduhrawudsLNUF9PqdT/exec`

### Standalone script (script.google.com)

Use `SpreadsheetApp.openById("1OWy_me9fyFqcx_vZUhEvioTCMJIryLfnnF5BtcZZbh4")` — **not** `getActiveSpreadsheet()`. After editing the script, click **Deploy → Manage deployments → Edit → New version → Deploy**.

## Field names

HTML `name` attributes must stay:

- `Name`, `Email`, `Mobile`, `Subject`, `Message`

These map to `e.parameter` in Apps Script.
