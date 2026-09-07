#!/usr/bin/env node
// Validates the data files in this repository. No dependencies; Node 18+.
//   node scripts/validate.mjs            # from the repository root
//   node scripts/validate.mjs <dir>      # any directory holding data/
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(process.argv[2] ?? '.');
const TIERS = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythical'];
const ENGINES = ['jet', 'turboprop', 'turboshaft', 'piston', 'electric'];
const FIELDS = new Set(['rarity', 'model', 'manufacturer', 'seats', 'rangeKm', 'cruiseKts', 'engines']);
const CODE = /^[A-Z0-9]{2,4}$/;
const errors = [];
const err = (m) => errors.push(m);

function load(name, required = true) {
  const p = resolve(ROOT, 'data', name);
  if (!existsSync(p)) {
    if (required) err(`${name}: missing`);
    return null;
  }
  try {
    return JSON.parse(readFileSync(p, 'utf8'));
  } catch (e) {
    err(`${name}: not valid JSON — ${e.message}`);
    return null;
  }
}

const aliases = load('aliases.json');
const pseudo = new Set(aliases?.pseudo ?? []);
const dumpAliases = aliases?.dumpAliases ?? {};
for (const k of pseudo) if (!/^[A-Z0-9_]{2,16}$/.test(k)) err(`aliases.json pseudo: odd key ${k}`);
for (const [k, v] of Object.entries(dumpAliases)) {
  if (!/^[A-Z0-9]{2,8}$/.test(k)) err(`aliases.json dumpAliases: odd key ${k}`);
  if (v !== null && !CODE.test(v)) err(`aliases.json dumpAliases: ${k} → ${v} is not a designator`);
}

const legends = load('legends.json');
for (const [k, v] of Object.entries(legends?.types ?? {})) {
  if (!CODE.test(k)) err(`legends.json: ${k} is not a designator`);
  if (typeof v !== 'string' || !v.trim()) err(`legends.json: ${k} has no name`);
}

const manufacturers = load('manufacturers.json');
const mfrNames = new Set();
for (const [name, row] of Object.entries(manufacturers ?? {})) {
  if (name.startsWith('_')) continue;
  mfrNames.add(name);
  if (!row || typeof row !== 'object') { err(`manufacturers.json: ${name} is not an object`); continue; }
  if (!/^[A-Z0-9_]{2,24}$/.test(String(row.id ?? ''))) err(`manufacturers.json: ${name}.id must be UPPER_SNAKE (got ${row.id})`);
  if (!/^[A-Z]{2}$/.test(String(row.country ?? ''))) err(`manufacturers.json: ${name}.country must be ISO2 (got ${row.country})`);
}

const types = load('aircraft-types.json');
const seen = new Set();
for (const [code, row] of Object.entries(types ?? {})) {
  if (code.startsWith('_')) continue;
  const at = `aircraft-types.json ${code}`;
  if (!CODE.test(code)) { err(`${at}: key is not an ICAO designator (2–4 upper-case alphanumerics)`); continue; }
  if (pseudo.has(code)) { err(`${at}: is a pseudo-type marker, not an aircraft`); continue; }
  if (code in dumpAliases) {
    const real = dumpAliases[code];
    err(`${at}: is an alias key from the old dataset${real ? ` — use ${real}` : ' — no real designator exists'}`);
    continue;
  }
  if (seen.has(code)) err(`${at}: duplicate key`);
  seen.add(code);
  if (!row || typeof row !== 'object' || Array.isArray(row)) { err(`${at}: must be an object`); continue; }
  for (const f of Object.keys(row)) if (!FIELDS.has(f)) err(`${at}: unknown field "${f}"`);
  if ('rarity' in row && !TIERS.includes(row.rarity)) err(`${at}: rarity "${row.rarity}" is not one of ${TIERS.join('/')}`);
  if ('model' in row && !(typeof row.model === 'string' && row.model.trim().length >= 3 && row.model.length <= 80)) err(`${at}: model must be a 3–80 char string`);
  if ('manufacturer' in row && !(typeof row.manufacturer === 'string' && row.manufacturer.trim().length >= 2)) err(`${at}: manufacturer must be a string`);
  const int = (f, lo, hi) => {
    if (!(f in row)) return;
    const v = row[f];
    if (!Number.isInteger(v) || v < lo || v > hi) err(`${at}: ${f} must be an integer in ${lo}..${hi} (got ${JSON.stringify(v)})`);
  };
  int('seats', 1, 900);
  int('rangeKm', 50, 20000);
  int('cruiseKts', 30, 700);
  if ('engines' in row) {
    const e = row.engines;
    if (!e || typeof e !== 'object') err(`${at}: engines must be {count,type}`);
    else {
      for (const f of Object.keys(e)) if (f !== 'count' && f !== 'type') err(`${at}: engines has unknown field "${f}"`);
      if (!Number.isInteger(e.count) || e.count < 1 || e.count > 8) err(`${at}: engines.count must be 1..8`);
      if (!ENGINES.includes(e.type)) err(`${at}: engines.type "${e.type}" is not one of ${ENGINES.join('/')}`);
    }
  }
  if (Object.keys(row).length === 0) err(`${at}: empty row`);
}

// tiers.json is generated upstream; when present it must at least be well-formed.
const tiers = load('tiers.json', false);
if (tiers) {
  for (const [code, row] of Object.entries(tiers.types ?? {})) {
    if (!CODE.test(code)) err(`tiers.json: ${code} is not a designator`);
    if (!TIERS.includes(row?.tier)) err(`tiers.json ${code}: tier "${row?.tier}"`);
    if (!['curated', 'dump'].includes(row?.source)) err(`tiers.json ${code}: source "${row?.source}"`);
  }
}

const n = seen.size;
if (errors.length) {
  console.error(`✖ ${errors.length} problem(s):`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log(`✔ ${n} curated types, ${mfrNames.size} manufacturers, ${Object.keys(legends?.types ?? {}).length} legends, ${pseudo.size} pseudo + ${Object.keys(dumpAliases).length} alias keys — all valid${tiers ? `; tiers.json ${Object.keys(tiers.types ?? {}).length} types` : ''}`);
