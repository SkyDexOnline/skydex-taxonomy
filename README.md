# Skydex aircraft taxonomy

The open rarity table behind [skydex.online](https://skydex.online): ICAO
type designators, model names, manufacturers and the **six rarity tiers**
the Skydex ADS-B network and collection game run on.

This repository is a **mirror and an inbox**. The source of truth is the
private Skydex application repository; every merge there republishes these
files, so what you read here is exactly what production runs. Proposals
come in as issues and pull requests here, get reviewed by a human, and are
ported back by hand (automation of the return path is planned).

Live pages built from this data: [/aircraft-types](https://skydex.online/aircraft-types)
· one page per type at `/aircraft-type/{code}` · [ADS-B network hub](https://skydex.online/adsb).

## Files

| File | What it is | Edit it? |
|---|---|---|
| `data/aircraft-types.json` | Curated overrides keyed by ICAO designator: model name, manufacturer, typical seats, range, engines, cruise speed and **`rarity`** where we have set it by hand. This is the file pull requests change. | **yes** |
| `data/tiers.json` | The *effective* tier of every type production knows about, curated or not, with the source of each tier (`curated` or `dump`). Regenerated from the live database on every publish. | no — derived |
| `data/manufacturers.json` | Builders the base reference lacks, keyed by the exact `manufacturer` string used above. | yes |
| `data/aliases.json` | Pseudo-types ADS-B feeds emit (`GND`, `MLAT`, …) and the invented family keys inherited from an older dataset, mapped to the real designator. Rows under these keys are rejected. | rarely |
| `data/legends.json` | The ten "sky legends" — a separate axis from tiers, see `rarity.md`. | rarely |
| `rarity.md` | What the six tiers mean, what they do **not** mean, and how a tier changes. | docs |
| `CONTRIBUTING.md` | How to propose a tier change or a missing type, and what we will not accept. | docs |
| `schema/`, `scripts/validate.mjs` | Shape rules; the validator runs on every pull request. | tooling |

## Why the tiers are ours to argue about

A tier is not "how many were built". It is **how often a spotter in the
network's coverage actually sees one overhead**. That is a judgement, it
was seeded from an older dataset with known inversions, and it is being
corrected type by type — in public, here. Read `rarity.md` before opening
a tier issue; then open it, that is what the repository is for.

## What is deliberately not here

- The list of light-aviation types whose airframes are shown anonymously
  in Skydex. That is a privacy rule, not taxonomy, and it is not up for
  discussion in this repository.
- The airline registry (licence unclear) and any per-country policy table.
- Military types: they carry a tier like any other type, but Skydex never
  auto-alerts on them and they cannot be caught in the game.

## Licence

Data and documentation are released under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) (full text in
`LICENSE`). Attribute as **"Skydex aircraft taxonomy, skydex.online"** with
a link. ICAO designators are ICAO's (DOC 8643); model names are public
record; the tiers are our work.

Join the discussion on [Discord](https://skydex.online/api/public/discord)
or in this repository's Discussions tab.
