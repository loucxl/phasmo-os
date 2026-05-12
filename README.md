# PHASMO.OS // Complete Investigation Suite

A comprehensive web-based toolkit for Phasmophobia investigators — built for ghost hunters of all experience levels. Whether you're learning the basics or mastering zero-evidence runs, this site has everything you need to identify ghosts, survive hunts, and track game update notes.

## Current Version

Visible site/tracker version: **v2.4**

PHASMO.OS is currently being updated for the latest Phasmophobia game data. **All ghost data is being reviewed**, and information for the two newest ghosts, **Aswang** and **Kormos**, is subject to change as more testing is confirmed.

## ✨ Features

### 🔍 Smart Evidence Filtering
Select evidence as you find it and watch the suspect list automatically narrow down. Real-time filtering shows you exactly which ghosts are still possible based on your findings.

### 👻 Comprehensive Ghost Database
Click any ghost card for complete information including:
- Detailed ability explanations for beginners
- Hunt thresholds and movement speeds
- Step-by-step identification tests
- Zero-evidence identification tips for Nightmare/Insanity modes
- Strengths, weaknesses, and survival strategies

### ⚡ Different Speed Filter
The old **Fast Speed** filter is now labelled **Different Speed**.

This filter is for ghosts with non-standard hunt speed behaviour, including ghosts that are faster, slower, variable, or can change speed under certain conditions. Examples include Revenant, Hantu, The Twins, Moroi, Deogen, Thaye, Dayan, Gallu, Obambo, Aswang, Kormos, Raiju, Jinn, and The Mimic.

### 🗺️ Complete Game Information
- **Maps Database:** Map information, difficulty context, and investigation planning.
- **Equipment Guide:** Current equipment items with costs, mechanics, ranges, unlock levels, and tips.
- **Game Mechanics:** Hunt systems, sanity mechanics, difficulty modifiers, cursed possessions, and survival rules.
- **Strategy Guide:** Phase-by-phase tactics from setup to escape.
- **Game Updates Page:** Collapsible Phasmophobia game update notes with the newest update open by default.

### 🔎 Name-Only Search
- Ghost search checks ghost names only.
- Equipment search checks equipment names only.
- Searching `Spirit` shows **Spirit**, not every ghost with Spirit Box.
- Searching `Read` shows **EMF Reader**, not every equipment card that mentions the word “reader”.

### 👥 Multiplayer / Account Features
- Google login support.
- Nickname system for group sessions.
- Group Journal sharing via Firebase.
- Friends and player stats systems.

## New Ghosts / Under Review

### Aswang
- **Evidence:** D.O.T.S Projector, Freezing Temperatures, Ghost Writing
- **Hunt Threshold:** 50%
- **Base Speed:** 1.53 m/s
- **Maximum Line-of-Sight Speed:** ~2.53 m/s
- **Danger Level:** High

**Current Known Behaviour:**
- The Aswang keeps the expected maximum line-of-sight speed for its base speed.
- The key difference is acceleration: it reaches max LoS speed in approximately **17.33 seconds** instead of the standard **26 seconds**.
- This makes long straight chases especially dangerous.

**How to Identify:**
- During hunts, listen for a ghost that starts around 1.53 m/s but ramps to max LoS speed unusually quickly.
- Break line-of-sight quickly to stop it building speed.
- Current info is still being reviewed and may change with further testing.

### Kormos
- **Evidence:** Ghost Orbs, Spirit Box, Ultraviolet
- **Hunt Threshold:** 50%
- **Speed:** 1.7 m/s normally, 2.21 m/s after detecting a player
- **Danger Level:** High

**Current Known Behaviour:**
- The Kormos is nearly blind and does not use normal line-of-sight tracking like most ghosts.
- It detects players through sound, voice, movement, and active electronics.
- Once it detects a player, it moves at **2.21 m/s** until it reaches the player’s last known location.
- If the player stands completely still, makes no sound through their microphone, and has no active electronics, the Kormos should struggle to detect them directly, although it can still kill if it happens to walk into them.

**Movement Detection Ranges:**
- **10m:** Player is moving while crouched
- **15m:** Player is walking normally
- **30m:** Player is sprinting

**Mimic Warning:**
Kormos is one of the ghosts where collecting its full evidence set does **not** automatically rule out The Mimic.

- Kormos evidence is **Orbs + Spirit Box + UV**.
- The Mimic has **Spirit Box + Freezing + UV** and always produces fake Ghost Orbs.
- If you find Orbs + Spirit Box + UV, check carefully for Freezing before locking in Kormos.

## Game Updates Page

The site includes a dedicated **Game Updates** page for Phasmophobia update notes.

Update cards use collapsible sections:
- The newest game update is open by default.
- Older updates are collapsed.
- Each update can include a log added date and a game release date.
- Large patch notes can be grouped into New, Changes, Fixes, and Developer Notes.

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, and vanilla JavaScript
- **Auth / Sync:** Firebase Authentication and Firebase Realtime Database
- **Hosting:** Static-site friendly; works on GitHub Pages or similar hosting
- **No build process required:** Open `index.html` directly or deploy the files as-is

## 🚀 Getting Started

### Option 1: Use the Live Site
Visit the hosted version at: `[Your URL Here]`

### Option 2: Run Locally
1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/phasmo-os.git
   ```
2. Open `index.html` in your browser.
3. No build process or installation required.

## 📁 Project Structure

```text
phasmo-os/
├── index.html          # Main application file
├── script.js           # Ghost data and application logic
├── style.css           # Styling and responsive design
└── README.md           # This file
```

## 📝 Data Accuracy

Ghost mechanics and behaviours are checked against:
- Official Phasmophobia sources and patch notes
- Phasmophobia Wiki data
- Community testing and research
- Ty Bayn / Zero-Network style cheat sheet references where useful

Because Phasmophobia changes frequently, some details may become outdated after updates. New ghost data should be treated as under review until it has been tested and confirmed.

## ⚠️ Disclaimer

This is a fan-made tool created by the Phasmophobia community for the community. It is **not affiliated with, endorsed by, or connected to Kinetic Games** in any way. All ghost mechanics, hunt behaviours, and game data are based on community research, testing, and publicly available information. Game mechanics may change with updates.

Phasmophobia and all related trademarks are property of Kinetic Games.

## 🙏 Acknowledgments

- Kinetic Games for creating Phasmophobia
- The Phasmophobia community for testing and documentation
- Contributors who help keep ghost data accurate and up-to-date

---

**Made with ❤️ for ghost hunters everywhere**
