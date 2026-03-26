# HomeFlow Board

HomeFlow Board is a static, tablet-first household task board built for GitHub Pages. It runs without a build step, stores data in the browser, and is optimized for a shared family tablet with large controls and drag-first interaction.

## Features

- Weekly board focused on the current week
- Recurring tasks with daily, weekday, weekly, biweekly, monthly, and custom interval rules
- Separate `owner` and `responsible` fields
- English, Finnish, and German localization
- Drag to reschedule by day
- Drag to reassign to another family member
- Done zone for fast completion
- Overdue visibility
- Clean start with no preplanned tasks
- Local persistence through `localStorage`
- Static deployment ready for GitHub Pages
- Installable offline PWA
- Minimal Android wrapper project

## Publish on GitHub Pages

1. Create a new GitHub repository.
2. Upload the files from this folder.
3. In GitHub, open `Settings` -> `Pages`.
4. Choose `Deploy from a branch`.
5. Select the `main` branch and `/root`.
6. Save.

## Local use

Open `index.html` in a browser. For a wall tablet, run the browser in fullscreen and use your Android always-on or kiosk settings to keep the board visible.

## Install On The Tablet

### Option 1: PWA install

This is the easiest path.

1. Publish the site on GitHub Pages.
2. Open the site on the tablet in Chrome or Edge.
3. Use `Add to Home screen` or `Install app`.
4. Open it from the new home-screen icon.

Notes:

- The app now includes a `manifest.webmanifest` and `sw.js`.
- After the first successful load, the app shell is cached for offline use.
- Your task data stays on the tablet in browser storage.

### Option 2: Android app wrapper

A minimal Android project is included in [android-wrapper](./android-wrapper).

What it does:

- bundles the current web app into the APK at build time
- loads the app from local Android assets
- works without a server

How to build:

1. Open `android-wrapper` in Android Studio.
2. Let Gradle sync.
3. Build or run the `app` module on the tablet.

Notes:

- The build copies `index.html`, `styles.css`, `app.js`, `manifest.webmanifest`, `sw.js`, and `icons/` into the app automatically.
- The Android wrapper loads `file:///android_asset/www/index.html`.
- Service workers are skipped automatically in the wrapper because they are not needed for bundled local assets.

## Storage note

All data is stored in the current browser only. If you later want sync between multiple devices, the clean next step is a small backend or a GitHub-hosted JSON sync layer.
