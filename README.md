# Automatia Bot - Demo Portal

A sales demo portal for Automatia Bot that allows sellers to present live client demos to prospects. Features access control, bilingual support (English/Spanish), and a clean interface matching the Automatia brand.

---

## Quick Start

1. Open `index.html` in a browser (or serve via a web server)
2. Enter your Seller ID to access the portal
3. Select a demo to present to your client

---

## Features

### Access Control
- Login required with Seller ID
- User IDs are **hashed with SHA-256** for security
- Each user sees only their permitted demos
- Session persists in browser (localStorage)

### Bilingual Support (EN/ES)
- Toggle language with one click
- All content translates: titles, descriptions, buttons
- Language preference saved across pages

### Dashboard Integration
Each demo page includes a "Demo Steps" section:
1. **Chat with the Bot** - Start a conversation as a test patient
2. **Check the Dashboard** - View captured data at https://dash.automatia.bot/sign-in

---

## File Structure

```
booking-demos/
├── index.html                    # Main demo portal
├── README.md                     # This file
├── manhattan-smiles/
│   └── manhattan-smiles.html     # Dental demo
├── gbc/
│   └── gbc-booking.html          # Medical tourism demo
├── dr-michael-doe/
│   └── automatia-booking.html    # Kate AI general demo
└── ray-avila/
    └── ray-avila.html            # Ray Avila custom demo
```

---

# Developer Guide

## Current User IDs

| User ID | SHA-256 Hash | Access | Name Displayed |
|---------|--------------|--------|----------------|
| `admin-automatia` | `834f98eef8e411c3c8639447617f06be08b05b163feb190aefeec9e63722e8c6` | All demos | Admin |
| `gbc-demos` | `1303a7ac100381762de7765e8b28dd0535387f59803fe9392a335d33d365e591` | Kate AI, GBC | GBC Team |
| `ray-avila` | `1f9dcbc177af9f94768b94f5c021b39442eafc858e79c2e2068b90418654f94b` | Kate AI, Ray Avila | Ray Avila |

### ID Format Rules
- All **lowercase**
- Words separated by **hyphens** (`-`)
- No spaces or special characters
- Examples: `john-smith`, `sales-team-nyc`, `client-name`

---

## Adding a New User

### Step 1: Choose the User ID

Pick an ID following the format rules:
```
new-seller-name
```

### Step 2: Generate the SHA-256 Hash

**On Mac/Linux terminal:**
```bash
echo -n "new-seller-name" | shasum -a 256
```

**Output example:**
```
a1b2c3d4e5f6...  -
```

Copy the hash (everything before the spaces and dash).

### Step 3: Add to ACCESS_CONFIG

Open `index.html` and find the `ACCESS_CONFIG` object (around line 929). Add your new user:

```javascript
const ACCESS_CONFIG = {
  // Existing users...
  
  // New user - paste your hash as the key
  'a1b2c3d4e5f6...your-full-hash-here...': {
    name: 'Display Name',           // Shown in header after login
    access: ['dr-michael-doe', 'manhattan-smiles'],  // Demo IDs they can access
    quickAccess: true               // Show Quick Access section (voice demos, etc.)
  }
};
```

### Step 4: Test the Login

1. Open `http://localhost:8080` (or your server)
2. Enter the new user ID (e.g., `new-seller-name`)
3. Verify they only see their permitted demos

---

## Adding a New Demo Page

### Step 1: Create the Folder and File

```bash
mkdir new-client
touch new-client/new-client.html
```

### Step 2: Copy a Template

Copy an existing demo page as a starting point:
```bash
cp ray-avila/ray-avila.html new-client/new-client.html
```

### Step 3: Customize the Demo Page

Edit `new-client/new-client.html`:
- Update branding (colors, logo, name)
- Change Chatwoot widget token (get from inbox.automatia.bot)
- Update translations for EN/ES
- Modify content to match the client

### Step 4: Add Demo Card to Portal

Open `index.html` and find the `<div class="demo-grid">` section. Add a new card:

```html
<a href="new-client/new-client.html" class="demo-card" data-demo-id="new-client" data-keywords="keyword1 keyword2 industry">
  <div class="card-header">
    <div class="card-icon">🏢</div>
    <span class="card-industry" data-i18n="industry_type">Industry</span>
  </div>
  <h3 data-i18n="demo_newclient_title">New Client Name</h3>
  <p data-i18n="demo_newclient_desc">Description of the demo and what it showcases.</p>
  <div class="card-features">
    <span class="feature-tag" data-i18n="tag_chatbot">Chatbot</span>
    <span class="feature-tag" data-i18n="tag_booking">Appointment Booking</span>
  </div>
  <div class="card-action">
    <span data-i18n="launch_demo">Launch Demo</span>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  </div>
</a>
```

**Important attributes:**
- `data-demo-id` - Unique ID used for access control (must match ACCESS_CONFIG)
- `data-keywords` - Search terms (name, industry, features)
- `data-i18n` - Translation key for bilingual support

### Step 5: Add Translations

Find the `translations` object in `index.html` and add entries for both languages:

```javascript
const translations = {
  en: {
    // ... existing translations ...
    demo_newclient_title: 'New Client Name',
    demo_newclient_desc: 'Description of what this demo showcases.',
  },
  es: {
    // ... existing translations ...
    demo_newclient_title: 'Nombre del Cliente',
    demo_newclient_desc: 'Descripción de lo que muestra este demo.',
  }
};
```

### Step 6: Grant Access to Users

Update `ACCESS_CONFIG` to include the new demo ID:

```javascript
const ACCESS_CONFIG = {
  '834f98eef8e411c3c8639447617f06be08b05b163feb190aefeec9e63722e8c6': {
    name: 'Admin',
    access: ['manhattan-smiles', 'gbc', 'dr-michael-doe', 'ray-avila', 'new-client'], // Added!
    quickAccess: true
  },
  // Add to other users who need access...
};
```

---

## Demo Page Checklist

When creating a new demo page, ensure it has:

- [ ] **Header** with logo and language toggle
- [ ] **Back to Portal** link (`../index.html`)
- [ ] **Chat widget** with correct Chatwoot token
- [ ] **Dashboard section** with link to `https://dash.automatia.bot/sign-in`
- [ ] **Translations** object for EN/ES
- [ ] **Language toggle** function
- [ ] **Responsive design** for mobile

---

## Modifying Access Permissions

### Give a User Access to More Demos

Find their entry in `ACCESS_CONFIG` and add demo IDs to the `access` array:

```javascript
'1f9dcbc177af9f94768b94f5c021b39442eafc858e79c2e2068b90418654f94b': {
  name: 'Ray Avila',
  access: ['dr-michael-doe', 'ray-avila', 'new-client'],  // Added new-client
  quickAccess: true
}
```

### Remove Access

Simply remove the demo ID from the `access` array.

### Delete a User

Remove their entire entry from `ACCESS_CONFIG`.

---

## Technical Reference

### Local Storage Keys

| Key | Purpose | Example Value |
|-----|---------|---------------|
| `automatia_user` | Hashed user ID for session | `834f98eef8e4...` |
| `automatia_lang` | Language preference | `en` or `es` |

### Demo Card Attributes

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `data-demo-id` | Access control identifier | `manhattan-smiles` |
| `data-keywords` | Search terms | `dental nyc booking` |
| `data-i18n` | Translation key | `demo_ms_title` |

### CSS Variables (index.html)

```css
--automatia-blue: #4A5DFF;     /* Primary accent */
--automatia-navy: #1E2E6D;     /* Dark blue for buttons */
--bg-main: #F6F7F4;            /* Background */
--text: #1a1a2e;               /* Main text */
--text-muted: #6B7280;         /* Secondary text */
```

---

## Running Locally

### Option 1: Simple HTTP Server (Python)
```bash
cd booking-demos
python3 -m http.server 8080
# Open http://localhost:8080
```

### Option 2: VS Code Live Server
1. Install "Live Server" extension
2. Right-click `index.html` → "Open with Live Server"

### Option 3: Direct File
Open `index.html` directly in browser (some features may not work due to CORS).

---

## Troubleshooting

### "Invalid ID" error when logging in
- Check the ID is **lowercase** with **hyphens**
- Verify the hash in `ACCESS_CONFIG` matches exactly
- Try regenerating the hash

### Demo card not showing
- Check `data-demo-id` matches an entry in the user's `access` array
- Verify the user has access to that demo
- Check browser console for JavaScript errors

### Translations not working
- Ensure the `data-i18n` attribute matches a key in `translations`
- Check both `en` and `es` sections have the key
- Call `updateLanguage()` after adding dynamic content

### Dashboard section not appearing
- Clear browser cache or add `?t=123` to URL
- Verify the HTML structure matches other demo pages
- Check CSS for `.dashboard-section` class

---

## Future Plans

- **DynamoDB Integration**: Replace `ACCESS_CONFIG` with API calls
- **Dynamic Demo Loading**: Load demo cards from config file or API
- **Analytics**: Track demo views and user activity
- **Admin Panel**: Web UI for managing users and permissions

---

## Support

For questions or issues, contact the Automatia team:
- Website: [automatia.bot](https://www.automatia.bot/)
- Dashboard: [dash.automatia.bot](https://dash.automatia.bot/)
