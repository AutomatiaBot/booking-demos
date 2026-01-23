# RestoreMotion Physical Therapy — Static Website

This is a fully static, minimal, modern website (HTML/CSS/JS). No build tools required.

## Files
- index.html
- assets/css/styles.css
- assets/js/main.js
- assets/img/*.svg
- assets/privacy.html

## How to run locally
Open `index.html` in your browser, or run a local server:

- Python:
  python -m http.server 8080

Then visit:
  http://localhost:8080

## Notes
- The "Request a callback" form generates a pre-filled email draft via `mailto:` to avoid backend requirements.
- Replace the placeholder domain `restoremotionpt.example` with your real domain when deploying.
