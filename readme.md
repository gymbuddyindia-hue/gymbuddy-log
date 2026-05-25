# GymBuddy Log v3 — Progressive Overload Tracker

By GymBuddy India.

GymBuddy Log is a progressive overload tracker by GymBuddy India. Install it on your phone's home screen, set a rep range for each exercise, log your weight + reps, and the app tells you exactly what to do next session.

## What's new in v3

- **New-user intro guide.** Fresh installs now see a short onboarding slideshow explaining what the app is, its features, and how to use it.
- **Always-available guide card.** A "What is GymBuddy Log?" button sits above the Log tab so users can reopen the guide anytime.
- **Renamed rep range card.** The rep range explainer is now titled "Rep Range and How it works."
- **Collapsed explainer.** "How GymBuddy Log works" now opens only when tapped, keeping the Log tab clean on launch.
- **Weight unit toggle.** The log form supports KG and LBS input, with LBS converted to kg for existing PB logic.
- **Top-aligned pickers.** Modal cards open near the top of the screen instead of sitting at the bottom.

## What's new in v2

- **Rep range per exercise.** Pick from goal-based presets (Strength, Hypertrophy, Machines, etc.) or set a custom range. Stored on the exercise so all entries share it. Editable anytime.
- **Smart suggestions on every entry.** Based on where your reps land in your range, the app suggests one of: drop the weight, push for another rep, hit the ceiling and bump the weight, or you're past the range and need to go heavier.
- **Educational explainer** on the Log tab that explains the rep-range cycle in plain language. Dismissable. Reachable again from the Menu.
- **Range pill** shows on every entry card and progress row at a glance.
- **Edit Rep Range** button on every exercise in the Exercises tab and on each Progress detail view.
- **Logo updated** to the new cleaner version (no white stroke).
- **Mobile keyboard fix.** Pickers and forms now scroll correctly when the keyboard opens.
- **Auto-migration** from v1 data on first launch.

## Suggestion logic (so you know what to expect)

For a range of 8 to 12 reps:

| Reps logged | What the suggestion says |
|---|---|
| Below 8 | "Below your range. Drop the weight, or update your rep range." + Edit Range button |
| Exactly 8 | "You hit the low end of your range. Push for one more rep next session." |
| 9 to 11 | "Solid. You're inside your range. Push for one more rep next session." |
| Exactly 12 | "Ceiling hit. Bump the weight by ~2.5kg next session and drop back to 8 reps." |
| Above 12 | "Past your range. Time to increase the weight next session." |

The suggestion is saved with each entry forever (so when you scroll History a year later, you see the context that was given at the time).

## Rep range presets

- **Strength** (1-5) — heavy compound lifts
- **Power** (3-6) — explosive movements
- **Compound** (6-10) — squats, deadlifts, presses
- **Hypertrophy** (8-12) — muscle growth, general use
- **Machines** (10-15) — machine exercises
- **Isolation** (12-20) — curls, raises, extensions
- **Endurance** (15-25) — light weight, high reps
- **Custom** — set your own lower and upper limits

## Files in this folder

```
gymbuddy-pwa-v2/
├── index.html              # App shell
├── app.js                  # All logic
├── style.css               # Styles
├── manifest.json           # PWA manifest
├── service-worker.js       # Offline caching (v3 cache key)
├── netlify.toml            # Netlify config
├── logo.png                # GymBuddy logo (in-app branding)
├── icon-*.png              # App icons
├── apple-touch-icon.png    # iOS home screen icon
└── favicon.png             # Browser tab icon
```

## Deploy to Netlify (2 minutes)

### Option A: Drag and drop (fastest)

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the entire `gymbuddy-pwa-v2` folder onto the page
3. Wait ~30 seconds. Netlify gives you a URL like `clever-something-1234.netlify.app`
4. Rename it to something memorable in Site Settings → Domain
5. Done. No API keys, no env variables, no functions.

### Option B: Git deploy (if you want to update over time)

1. Push this folder to a GitHub repo
2. In Netlify, click "Add new site" → "Import from Git" → select the repo
3. Build settings: publish directory `.`, no build command
4. Deploy.

## Install on phone

### Android (Chrome)
1. Open your site URL in Chrome
2. Chrome shows an "Install app" banner. Tap it.
3. Or: three-dot menu → "Add to Home screen"

### iPhone (Safari only)
1. Open your site URL in Safari
2. Tap the Share button at the bottom
3. Scroll down, tap "Add to Home Screen"
4. Tap Add

Once installed, it opens like a real app — no browser chrome, no URL bar.

## Migrating from v1

If you already deployed v1 and logged data, this version auto-migrates on first launch:
- Old exercises become new exercises with `repRange: null` — you'll need to set the range the first time you log each one.
- Old entries are preserved as-is and continue to display with deltas.
- A toast confirms migration ("Data migrated. Set rep ranges to start tracking.")

**Important:** if you're deploying over the same Netlify site, the `CACHE_VERSION` was bumped to `v3`, so phones will auto-pull the new code on next visit. No action needed.

## Daily use tips

- **Export weekly.** Menu → Export backup. Save the JSON to email or Google Drive. iOS may clear PWA storage if unused for ~7 weeks.
- **Works offline.** App shell is cached after first load. Log weights anywhere, no signal needed.
- **Data stays on this device.** No account, no sync. Use export/import to move between devices.
- **Edit rep ranges freely.** Hit the edit button on any exercise in the Exercises tab or Progress detail. Old entries keep their original suggestion (snapshot); new entries use the new range.

## How to update the app later

1. Edit any file locally
2. Drag the folder onto Netlify again (Option A) or push to GitHub (Option B)
3. **Important:** if you change `app.js`/`style.css`/`index.html`, bump `CACHE_VERSION` in `service-worker.js` (e.g. `gymbuddy-log-v2` → `gymbuddy-log-v3`) so phones pick up the new code instead of serving from cache

## Known limits

- **iOS storage eviction.** ~7 weeks of non-use can clear PWA storage. Export backups.
- **localStorage cap (~5MB).** Photos take ~50-80KB each. Plan for 50-80 photos before approaching the limit. Menu shows live usage.
- **No cloud sync.** Single-device tool.
- **Rep range is per exercise, not per workout.** Changing the range changes future entries; past entries keep the snapshot of the range they were logged under.
