# Contributing

Everything here is edited through issues and pull requests. Read
`rarity.md` first; most tier arguments are already answered there.

## Propose a tier change

Open a **Tier change** issue. It asks for:

- the ICAO designator (`A333`, not "A330");
- the current and proposed tier;
- **where you spot and how often you see this type there** — this is the
  evidence, not "it is rare in general";
- optionally a link to a Skydex station page or collection that shows it.

One issue per type. A maintainer replies; agreement becomes a pull request
that sets `rarity` for that code in `data/aircraft-types.json`.

## Add a missing type

Open a **Missing type** issue or a pull request. Non-negotiable:

- the key **must be the ICAO DOC 8643 designator** — link the DOC 8643
  entry (for example the ICAO 8643 search page). An older dataset behind
  Skydex invented keys like `E195E2` where the transponder says `E295`;
  every invented key is a page nobody will ever reach. Pull requests
  adding a designator that is not in DOC 8643 are closed without review;
- `model` is the full marketing name with the manufacturer
  ("Boeing 737-800", "Piper PA-46-500TP Malibu Meridian");
- `manufacturer` must match a name Skydex knows. If the builder is missing,
  add it to `data/manufacturers.json` in the same pull request;
- only fields you are sure of. An absent field is fine; a guessed number is
  not — the type page reads these numbers out loud.

## Fix a name or a spec

Pull request, one type per commit, with a source in the description.
`cruiseKts` is in **knots**; `rangeKm` in kilometres; `seats` is a typical
two-class figure, not the certified maximum.

## Validation

Every pull request runs `node scripts/validate.mjs`. Run it locally before
pushing; it needs Node 18+ and nothing else. It checks designator shape,
the tier vocabulary, field types and ranges, and rejects keys listed in
`data/aliases.json`.

## What we will not accept

- Changes to which types are shown anonymously in Skydex. That list is not
  in this repository and is a privacy decision, not a taxonomy one.
- Auto-alerts for military types, in any form.
- Tiers copied from another product's rarity table. Skydex has its own
  axis and its own measurements.
- Per-country policy of any kind.
- Anything that needs the private application repository to change first
  (new fields, new tiers). Open a Discussion for those.

## Review

Maintainers are the Skydex operators. Expect a reply within a week; a
merged pull request reaches production with the next upstream sync and is
announced on Discord `#network`.
