# Permission Policy

`yao-positioning-skill` requires one high-permission capability: scoped local file writes by `scripts/render-report.py` and `scripts/sanitize-package.py`.

The approved scope is limited to the user-selected output directory and these declared artifacts:

- `positioning-report.html`
- `positioning-report-data.json`
- `positioning-report.md`
- the explicitly selected sanitized distribution ZIP

The renderer and sanitizer do not perform network requests, spawn subprocesses, prompt interactively, or modify source systems. The sanitizer reads only the selected ZIP, removes private authoring reports and embedded registry metadata, redacts local paths from retained report pages, and atomically replaces the selected output archive. Target adapters carry this permission as metadata; the active client and workspace policy remain the enforcement boundary.

Review the approval in `security/permission_policy.json` by its expiry date or whenever renderer or package-sanitizer behavior changes.
