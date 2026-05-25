# GymBuddy Log — PB Tracker PWA

A personal best tracker for gym lifts. By GymBuddy India.

Install it on your phone's home screen, log a weight for any exercise, attach a photo of the machine attachment or setup as a visual note, and watch your PBs climb. Fully offline.

## What's in this folder

```
gymbuddy-pwa/
├── index.html              # App shell
├── app.js                  # All logic
├── style.css               # Styles
├── manifest.json           # PWA manifest
├── service-worker.js       # Offline caching
├── netlify.toml            # Netlify config
├── logo.png                # GymBuddy logo (in-app branding)
├── icon-*.png              # App icons
├── apple-touch-icon.png    # iOS home screen icon
└── favicon.png             # Browser tab icon
```

## Deploy to Netlify (2 minutes)

### Option A: Drag and drop (fastest)

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the entire `gymbuddy-pwa` folder onto the page
3. Wait ~30 seconds. Netlify gives you a URL like `clever-something-1234.netlify.app`
4. Rename it to something like `gymbuddy-log` in Site Settings → Domain
5. Done. No API keys, no environment variables, no functions to deploy.

### Option B: Git deploy (if you want to update it over time)

1. Push this folder to a new GitHub repo
2. In Netlify, click "Add new site" → "Import from Git" → select the repo
3. Build settings: leave publish directory as `.`, no build command needed
4. Deploy.

## Install on phone

### Android (Chrome)
1. Open your site URL in Chrome
2. Chrome shows an "Install app" banner. Tap it.
3. Or: tap the three-dot menu → "Add to Home screen"

### iPhone (Safari, must be Safari)
1. Open your site URL in Safari
2. Tap the Share button at the bottom (the square with up-arrow)
3. Scroll down, tap "Add to Home Screen"
4. Tap Add

Once installed, it opens like a real app. No Safari chrome, no URL bar.

## How to use it

**The core flow:** Log tab → Log a Weight → pick exercise → enter weight + reps → save.

**Photo notes:** When you're using a cable attachment, machine, or grip you don't know the name of, take a photo. It saves with that entry so next time you can see exactly which setup gave you that PB. The photo is auto-compressed (800px, JPEG 75%) so storage stays manageable.

**Progress tab:**
- **PBs by Body Part grid** shows your heaviest lift in each muscle group (chest, back, shoulders, arms, legs, core).
- **Per-exercise list** shows the PB for each exercise, plus a delta badge (+5kg, -2kg, or "same") comparing your latest entry to the one before it.
- **Detail view** (tap any exercise) shows your PB, total entries, last-vs-previous change, a weight-over-time chart, and every entry with photos.

**History tab:** every entry grouped by date, with body part filter.

**Menu (top right dots):** Export backup, Import backup, Reset all data.

## Daily use tips

- **Export weekly.** Tap the menu → Export backup. Email the JSON to yourself or drop it in Google Drive. iOS may clear PWA storage if you don't open the app for ~7 weeks.
- **Works offline.** The app shell is cached after first load. You can log weights in a gym basement with no signal.
- **Data lives only on this device.** No account, no sync. If you want it on a second device, you'll need to export from one and import on the other.
- **Storage watch.** The menu shows your storage usage of the ~5MB limit. Photos take significant space (about 50-80KB each compressed). If you're approaching the limit, export and delete old entries.

## How to update the app later

After deploy:
1. Edit any file locally
2. If Option A (drag/drop): drag the folder onto Netlify again, on the same site
3. If Option B (Git): push to GitHub, Netlify auto-deploys
4. **Important:** bump the `CACHE_VERSION` in `service-worker.js` (e.g. `gymbuddy-log-v1` → `gymbuddy-log-v2`) so phones pick up the new code. Without this, the service worker keeps serving the old cached version.

## Known limits

- **iOS storage eviction.** Apple may clear PWA storage if unused for ~7 weeks. Export backups.
- **localStorage cap (~5MB).** Photos eat into this. Plan for roughly 50-80 photos before approaching the limit. The menu shows current usage.
- **No cloud sync.** Single-device tool.
- **No rep-only PB tracking.** This app considers PB = heaviest weight. If you bench 60kg for 6 reps and later 60kg for 10 reps, both are logged separately but neither is flagged as an improvement automatically.
