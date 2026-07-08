#!/usr/bin/env node
/**
 * PhasmoOS — automatic game update fetcher
 * ----------------------------------------
 * Pulls official Phasmophobia patch notes from the Steam News API and merges
 * them into updates.json (the file the Updates page reads at runtime).
 *
 * - Zero dependencies. Requires Node 18+ (built-in fetch).
 * - Never touches entries marked  "manual": true  — your hand-written logs
 *   are preserved forever and can be edited freely in updates.json.
 * - Auto entries are deduped by their Steam news GID, so re-runs are safe.
 * - Designed to run from GitHub Actions (see .github/workflows/fetch-updates.yml)
 *   but works locally too:  node scripts/fetch-updates.js
 *
 * Steam endpoint (public, no API key):
 *   https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/
 */

const fs = require("fs");
const path = require("path");

const APP_ID = 739630; // Phasmophobia
const NEWS_URL =
    `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/` +
    `?appid=${APP_ID}&count=20&maxlength=0&format=json` +
    `&feeds=steam_community_announcements`;

const UPDATES_FILE = path.join(__dirname, "..", "updates.json");
const MAX_ENTRIES = 40; // keep the file lean; oldest auto entries fall off

// ---------------------------------------------------------------------------
// 1. Decide which news items are actually patch notes
// ---------------------------------------------------------------------------
function isPatchNote(item) {
    const tags = (item.tags || []).map(t => String(t).toLowerCase());
    if (tags.includes("patchnotes")) return true; // Steam's official marker
    // Fallback for items Kinetic forgot to tag:
    return /\b(update|patch|hotfix|v\d+\.\d+)\b/i.test(item.title || "");
}

// ---------------------------------------------------------------------------
// 2. BBCode -> { heading, text[], items[] } sections (matches the renderer)
// ---------------------------------------------------------------------------
function stripInlineBBCode(s) {
    return s
        .replace(/\[img\][\s\S]*?\[\/img\]/gi, "")
        .replace(/\[previewyoutube=[^\]]*\][\s\S]*?\[\/previewyoutube\]/gi, "")
        .replace(/\[url=([^\]]*)\]([\s\S]*?)\[\/url\]/gi, "$2")
        .replace(/\[\/?(?:b|i|u|s|strike|code|spoiler|quote|table|tr|th|td|hr|p|center)[^\]]*\]/gi, "")
        .replace(/\{STEAM_CLAN_IMAGE\}[^\s\]]*/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function parseBBCodeToSections(raw) {
    const sections = [];
    let current = null;

    const ensureSection = heading => {
        current = { heading, text: [], items: [] };
        sections.push(current);
    };

    // Tokenise on headings and list blocks so structure survives.
    const tokens = String(raw || "")
        .replace(/\r/g, "")
        .split(/(\[h[1-3]\][\s\S]*?\[\/h[1-3]\]|\[list\][\s\S]*?\[\/list\])/gi)
        .filter(t => t && t.trim());

    for (const token of tokens) {
        const heading = token.match(/^\[h[1-3]\]([\s\S]*?)\[\/h[1-3]\]$/i);
        if (heading) {
            const text = stripInlineBBCode(heading[1]);
            if (text) ensureSection(text);
            continue;
        }

        const list = token.match(/^\[list\]([\s\S]*?)\[\/list\]$/i);
        if (list) {
            if (!current) ensureSection("Patch Notes");
            const items = list[1]
                .split(/\[\*\]/)
                .map(stripInlineBBCode)
                .filter(Boolean);
            current.items.push(...items);
            continue;
        }

        // Plain prose between headings/lists -> paragraphs
        for (const line of token.split("\n")) {
            const text = stripInlineBBCode(line);
            if (!text) continue;
            if (!current) ensureSection("Patch Notes");
            current.text.push(text);
        }
    }

    // Drop empty sections
    return sections.filter(s => s.text.length || s.items.length);
}

// ---------------------------------------------------------------------------
// 3. Build a PhasmoOS update entry from a Steam news item
// ---------------------------------------------------------------------------
function formatDate(unixSeconds) {
    return new Date(unixSeconds * 1000).toLocaleDateString("en-GB", {
        day: "2-digit", month: "long", year: "numeric",
    });
}

function toEntry(item) {
    const title = stripInlineBBCode(item.title || "Untitled update");
    const versionMatch = title.match(/v?\d+(?:\.\d+){1,3}/i);
    const version = versionMatch
        ? (versionMatch[0].toLowerCase().startsWith("v") ? versionMatch[0] : "v" + versionMatch[0])
        : "Update";

    const sections = parseBBCodeToSections(item.contents);
    if (!sections.length) {
        sections.push({ heading: "Patch Notes", text: ["See the full notes on Steam."], items: [] });
    }

    return {
        id: "steam-" + item.gid,
        manual: false,
        version,
        title: version === "Update" ? title : title.replace(/\s*[-–|]?\s*v?\d+(?:\.\d+){1,3}\s*[-–|]?\s*/i, " ").trim() || title,
        logAdded: formatDate(Math.floor(Date.now() / 1000)),
        gameRelease: formatDate(item.date),
        date: item.date, // unix, used for sorting
        url: item.url || "",
        sections,
    };
}

// ---------------------------------------------------------------------------
// 4. Merge with the existing file (manual entries are sacred)
// ---------------------------------------------------------------------------
function loadExisting() {
    try {
        return JSON.parse(fs.readFileSync(UPDATES_FILE, "utf8"));
    } catch {
        return { updates: [] };
    }
}

// Extract a comparable version number ("Hotfix v0.17.1.5" -> "0.17.1.5").
// Used to stop Steam auto entries duplicating patches you already wrote by hand.
function versionKey(entry) {
    const m = String(entry.version || "").match(/\d+(?:\.\d+)+/);
    return m ? m[0] : null;
}

// Manual entries store human dates; give them a sortable timestamp once.
function sortStamp(entry) {
    if (typeof entry.date === "number") return entry.date;
    const parsed = Date.parse(entry.gameRelease || entry.logAdded || "");
    return Number.isNaN(parsed) ? 0 : Math.floor(parsed / 1000);
}

async function main() {
    console.log("Fetching Steam news for app", APP_ID, "…");
    const res = await fetch(NEWS_URL, { headers: { "User-Agent": "PhasmoOS-updates-bot" } });
    if (!res.ok) throw new Error(`Steam API responded ${res.status}`);
    const data = await res.json();
    const newsItems = (data.appnews && data.appnews.newsitems) || [];
    console.log("Received", newsItems.length, "news items");

    const incoming = newsItems.filter(isPatchNote).map(toEntry);
    console.log("Recognised", incoming.length, "as patch notes");

    const existing = loadExisting();
    const existingUpdates = Array.isArray(existing.updates) ? existing.updates : [];

    const manual = existingUpdates.filter(u => u.manual === true);
    const autoOld = existingUpdates.filter(u => u.manual !== true);

    // Merge autos by id — incoming wins (Steam sometimes edits notes post-release)
    const autoById = new Map(autoOld.map(u => [u.id, u]));
    for (const entry of incoming) autoById.set(entry.id, entry);

    // Drop any auto entry covering a version that already has a manual entry.
    // This also self-heals: duplicates that slipped into updates.json previously
    // are removed on the next run, not just prevented going forward.
    const manualVersions = new Set(manual.map(versionKey).filter(Boolean));
    const autos = [...autoById.values()].filter(u => {
        const key = versionKey(u);
        if (key && manualVersions.has(key)) {
            console.log(`Skipping auto entry ${u.id} (${u.version}) — manual entry covers ${key}`);
            return false;
        }
        return true;
    });

    const merged = [...manual, ...autos]
        .sort((a, b) => sortStamp(b) - sortStamp(a))
        .slice(0, MAX_ENTRIES);

    const output = {
        generated: new Date().toISOString(),
        source: "Steam ISteamNews (auto) + manual entries",
        updates: merged,
    };

    const next = JSON.stringify(output, null, 2) + "\n";
    const prev = fs.existsSync(UPDATES_FILE) ? fs.readFileSync(UPDATES_FILE, "utf8") : "";

    // Ignore the timestamp when deciding whether anything actually changed
    const normalise = s => s.replace(/"generated": "[^"]*"/, "");
    if (normalise(next) === normalise(prev)) {
        console.log("No changes — updates.json left untouched.");
        return;
    }

    fs.writeFileSync(UPDATES_FILE, next);
    console.log("updates.json written with", merged.length, "entries.");
}

main().catch(err => {
    console.error("fetch-updates failed:", err.message);
    process.exit(1);
});
