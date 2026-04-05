import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(rootDir, "data");
const outputPath = path.join(dataDir, "fuel-rovaniemi.json");
const cachePath = path.join(dataDir, "fuel-geocode-cache.json");

const MENOVESI_PRICES_URL = "https://api.millcore-softwares.com/prices";
const MENOVESI_APP_REFERER = "https://www.millcore-softwares.com/apps/menovesi/";
const BENSA_URL = "https://www.bensa.app/rovaniemi.html";
const MAX_MENOVESI_AGE_DAYS = 5;
const MAX_BENSA_AGE_DAYS = 14;
const MAX_ROVANIEMI_RADIUS_KM = 60;
const ROVANIEMI_CENTER = {
  name: "Valtakatu 4, 96100 Rovaniemi",
  lat: 66.5033446,
  lon: 25.72959,
};

await mkdir(dataDir, { recursive: true });

const geocodeCache = await readJson(cachePath, {});
const nextGeocodeCache = { ...geocodeCache };

const menovesiEntries = await tryBuildMenovesi95E10(nextGeocodeCache);
const fallbackUsed = menovesiEntries.length === 0;
const entries95 = fallbackUsed ? await buildBensa95E10(nextGeocodeCache) : menovesiEntries;

await writeJson(outputPath, {
  source: fallbackUsed ? BENSA_URL : MENOVESI_PRICES_URL,
  sourceName: fallbackUsed ? "bensa.app" : "Menovesi",
  fallbackUsed,
  updatedAt: new Date().toISOString(),
  center: {
    name: ROVANIEMI_CENTER.name,
    latitude: ROVANIEMI_CENTER.lat,
    longitude: ROVANIEMI_CENTER.lon,
  },
  types: {
    "95": entries95.slice(0, 5),
  },
});

await writeJson(cachePath, nextGeocodeCache);

async function tryBuildMenovesi95E10(cache) {
  const response = await fetch(MENOVESI_PRICES_URL, {
    headers: {
      "user-agent": "HomeFlowBoard/1.0 (+https://github.com/PaleEmperor/TaskBoard)",
      referer: MENOVESI_APP_REFERER,
      accept: "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${MENOVESI_PRICES_URL}: ${response.status}`);
  }

  const data = await response.json();
  const prices = Array.isArray(data?.prices) ? data.prices : Array.isArray(data?._lageki) ? data._lageki : [];
  const now = new Date();
  const byStation = new Map();

  for (const row of prices) {
    const priceValue = Number.parseFloat(String(row.price));
    const lat = Number.parseFloat(String(row.lat));
    const lon = Number.parseFloat(String(row.lon));
    const timestamp = parseIsoDate(row.timestamp);
    if (row.fuel_type !== "95E10" || !Number.isFinite(priceValue) || priceValue <= 0) {
      continue;
    }
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || !isFreshEnough(timestamp, MAX_MENOVESI_AGE_DAYS, now)) {
      continue;
    }

    const distanceKm = haversineKm(ROVANIEMI_CENTER.lat, ROVANIEMI_CENTER.lon, lat, lon);
    const localityText = [row.city, row.municipality, row.village, row.station_name]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const looksLikeRovaniemi = localityText.includes("rovaniemi");
    if (!looksLikeRovaniemi && distanceKm > MAX_ROVANIEMI_RADIUS_KM) {
      continue;
    }

    const key = row.station_id ?? `${row.station_name}|${lat.toFixed(5)}|${lon.toFixed(5)}`;
    const existing = byStation.get(key);
    if (!existing || timestamp > existing.timestampDate) {
      byStation.set(key, {
        station: row.station_name?.trim() || "Huoltoasema",
        stationId: row.station_id ?? null,
        lat,
        lon,
        timestampDate: timestamp,
        updated: formatRelativeDate(timestamp),
        price: `${priceValue.toFixed(3)} €`,
        priceValue,
        distanceKm,
        locality: [row.city, row.village, row.municipality].filter(Boolean).join(", "),
      });
    }
  }

  const stations = [...byStation.values()]
    .sort((a, b) => a.priceValue - b.priceValue || a.distanceKm - b.distanceKm || b.timestampDate - a.timestampDate)
    .slice(0, 5);

  for (const station of stations) {
    const cacheKey = `menovesi:${station.stationId ?? station.station}|${station.lat.toFixed(5)}|${station.lon.toFixed(5)}`;
    const cachedAddress = cache[cacheKey];
    if (typeof cachedAddress === "string") {
      station.address = cachedAddress;
      continue;
    }
    const resolvedAddress = await reverseGeocode(station.lat, station.lon);
    if (resolvedAddress) {
      cache[cacheKey] = resolvedAddress;
      station.address = resolvedAddress;
      await sleep(1100);
    } else if (station.locality) {
      station.address = station.locality;
    }
  }

  return stations.map(stripInternalFuelFields);
}

async function buildBensa95E10(cache) {
  const html = await fetchText(BENSA_URL);
  const rows = parseBensa95Table(html, MAX_BENSA_AGE_DAYS);
  const enriched = [];

  for (const row of rows) {
    const cacheKey = `bensa:${row.station}|${row.address}`;
    let coords = cache[cacheKey] || null;
    if (!coords && row.address) {
      coords = await geocodeAddress(`${row.address}, Rovaniemi, Finland`);
      if (coords) {
        cache[cacheKey] = coords;
      }
      await sleep(1100);
    }

    enriched.push({
      station: row.station,
      address: row.address,
      updated: row.updated,
      price: `${row.priceValue.toFixed(3)} €`,
      priceValue: row.priceValue,
      distanceKm: coords ? haversineKm(ROVANIEMI_CENTER.lat, ROVANIEMI_CENTER.lon, coords.lat, coords.lon) : null,
    });
  }

  return enriched
    .sort((a, b) => a.priceValue - b.priceValue || (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999))
    .slice(0, 5);
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "HomeFlowBoard/1.0 (+https://github.com/PaleEmperor/TaskBoard)",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  const buffer = await response.arrayBuffer();
  return new TextDecoder("utf-8").decode(buffer);
}

function parseBensa95Table(html, maxAgeDays) {
  const sectionRegex = /<h2>([^<]+)<\/h2>\s*<table>[\s\S]*?<tbody>([\s\S]*?)<\/tbody>/gi;
  let sectionMatch;

  while ((sectionMatch = sectionRegex.exec(html))) {
    const type = decodeHtml(sectionMatch[1]).trim().toLowerCase();
    if (type !== "95") {
      continue;
    }

    const rows = [];
    const body = sectionMatch[2];
    const rowRegex = /<tr>\s*<td>([\s\S]*?)<\/td>\s*<td>([\s\S]*?)<\/td>\s*<td>([\s\S]*?)<\/td>\s*<\/tr>/gi;
    let rowMatch;

    while ((rowMatch = rowRegex.exec(body))) {
      const stationCell = rowMatch[1];
      const updated = decodeHtml(stripTags(rowMatch[3])).trim();
      const updatedDate = parseBensaUpdatedDate(updated);
      const station = decodeHtml(stripTags(stationCell.replace(/<small>[\s\S]*?<\/small>/i, ""))).trim();
      const addressMatch = stationCell.match(/<small>\(([\s\S]*?)\)<\/small>/i);
      const address = addressMatch ? decodeHtml(stripTags(addressMatch[1])).trim() : "";
      const priceText = decodeHtml(stripTags(rowMatch[2])).trim().replace("â‚¬", "").trim();
      const priceValue = Number.parseFloat(priceText.replace(",", "."));

      if (!station || !Number.isFinite(priceValue) || !isFreshEnough(updatedDate, maxAgeDays)) {
        continue;
      }

      rows.push({
        station: repairMojibake(station),
        address: repairMojibake(address),
        updated,
        priceValue,
      });
    }

    return rows;
  }

  return [];
}

function parseIsoDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseBensaUpdatedDate(value, now = new Date()) {
  const match = String(value || "").match(/^(\d{1,2})\.(\d{1,2})\.?$/);
  if (!match) {
    return null;
  }
  const day = Number.parseInt(match[1], 10);
  const month = Number.parseInt(match[2], 10);
  const candidate = new Date(now.getFullYear(), month - 1, day);
  if (Number.isNaN(candidate.getTime())) {
    return null;
  }
  if (candidate > now) {
    candidate.setFullYear(candidate.getFullYear() - 1);
  }
  return candidate;
}

function formatRelativeDate(date, now = new Date()) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "";
  }
  const ageMs = now - date;
  const ageHours = Math.floor(ageMs / 3600000);
  if (ageHours < 1) {
    return "today";
  }
  if (ageHours < 24) {
    return `${ageHours}h`;
  }
  return `${Math.floor(ageHours / 24)}d`;
}

function isFreshEnough(updatedDate, maxAgeDays, now = new Date()) {
  if (!(updatedDate instanceof Date) || Number.isNaN(updatedDate.getTime())) {
    return false;
  }
  const ageMs = now - updatedDate;
  return ageMs >= 0 && ageMs <= maxAgeDays * 86400000;
}

async function geocodeAddress(query) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");
  const response = await fetch(url, {
    headers: {
      "user-agent": "HomeFlowBoard/1.0 (+https://github.com/PaleEmperor/TaskBoard)",
      "accept-language": "fi,en",
    },
  });
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  if (!Array.isArray(data) || !data.length) {
    return null;
  }
  return {
    lat: Number.parseFloat(data[0].lat),
    lon: Number.parseFloat(data[0].lon),
  };
}

async function reverseGeocode(lat, lon) {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lon));
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("zoom", "18");

  const response = await fetch(url, {
    headers: {
      "user-agent": "HomeFlowBoard/1.0 (+https://github.com/PaleEmperor/TaskBoard)",
      "accept-language": "fi,en",
    },
  });
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  const address = data?.address || {};
  const road = address.road || address.pedestrian || address.footway || address.cycleway || "";
  const houseNumber = address.house_number || "";
  const postcode = address.postcode || "";
  const city = address.city || address.town || address.village || address.municipality || "";
  const parts = [
    [road, houseNumber].filter(Boolean).join(" ").trim(),
    [postcode, city].filter(Boolean).join(" ").trim(),
  ].filter(Boolean);
  return parts.join(", ") || data?.display_name || null;
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function stripTags(value) {
  return value.replace(/<[^>]+>/g, " ");
}

function decodeHtml(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function repairMojibake(value) {
  if (!value || (!value.includes("Ãƒ") && !value.includes("Ã¢") && !value.includes("Ã¤"))) {
    return value;
  }
  try {
    return Buffer.from(value, "latin1").toString("utf8");
  } catch {
    return value;
  }
}

function stripInternalFuelFields(entry) {
  const { station, address = "", updated = "", price = "", priceValue = null, distanceKm = null } = entry;
  return { station, address, updated, price, priceValue, distanceKm };
}

async function readJson(filePath, fallback) {
  try {
    const content = await readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch {
    return fallback;
  }
}

async function writeJson(filePath, data) {
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
