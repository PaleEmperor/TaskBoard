# HomeFlow Board

HomeFlow Board is a browser-based household board built for a shared wall tablet. It is designed around a real weekly routine: one focused day at a time, large touch targets, fast drag actions, recurring chores, claimable tasks, and a board that can stay open in the kitchen or hallway all day.

It runs as a static site on GitHub Pages, stores data locally in the browser, and can be installed on Android as a PWA.

I built this for my family. We are pretty autistic, so the board leans hard into clarity, low-friction interaction, visible structure, and routines that are easy to understand at a glance. Feel free to change things around and make it work for your family. We have fun with it.

## Current scope

- Current-week household board with one expanded day and compact side days
- Touch-first drag and drop for moving, deleting, reassigning, and sending tasks to the claim inbox
- Recurring tasks, including interval rules and special Linnea-week logic
- Separate `owner` and `responsible` handling
- Optional task time or same-day time range
- Claim inbox for tasks that should be picked up by whoever wants to do them
- Completion tracking with a simple leaderboard
- English, Finnish, and German UI
- Offline-friendly PWA install for tablet use

## What it is not

- not a multi-user synced cloud app
- not a backend-driven task manager
- not dependent on a build step or framework runtime

Everything is plain HTML, CSS, and JavaScript so it is easy to host, inspect, and adjust.

## Publish on GitHub Pages

1. Create a new GitHub repository.
2. Upload the files from this folder.
3. In GitHub, open `Settings` -> `Pages`.
4. Choose `Deploy from a branch`.
5. Select the `main` branch and `/root`.
6. Save.

## Local use

Open `index.html` in a browser. For tablet use, run it fullscreen and keep the device on a charger. The app is meant to work with as little typing as possible once the main routines are in place.

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

All data is stored in the current browser only. Backups can be exported and imported from the tools menu. If this ever needs real sync between devices, that would require adding a backend.
