# Rarity tiers

Skydex ranks every aircraft type on one ladder of six tiers:

| Tier | Meaning on the axis below | Typical examples (today) |
|---|---|---|
| `common` | You will see one on almost any day near a busy airport. | A320, A321neo, 737-800, ATR 72 |
| `uncommon` | Regular, but you notice it. | A319neo, 787-8, A220 |
| `rare` | A few times a month in a good spot; worth a second look. | 777-300ER, 787-9, A350-900, 737-300/400 |
| `epic` | Weeks between sightings for most spotters. | 747-400, A310, MD-80 family, An-26 |
| `legendary` | Months. Plan a trip for it. | 747-8, MD-11, An-124, 737 MAX 10 |
| `mythical` | Once, if ever. | A380, Beluga, 747-100 |

## The axis

**A tier answers one question: how often does a spotter inside the
network's coverage actually see this type overhead?**

That is deliberately not any of these:

- *how many were built* — the 747-400 outnumbers most things ever built and
  is still `epic` today, because almost none fly passengers any more;
- *how valuable or interesting the aircraft is* — that is what the
  "legends" axis is for (see below);
- *how rare it is worldwide* — a type common in Houston and unseen in
  Hamburg gets one global tier for now. Per-region tiers are a planned
  refinement, driven by the network's own measurements, not by votes.

The tier drives the game's XP for a catch, the colour of a card, which
Discord channel an alert lands in, and the order of a collection wall. It
is **balance**, and it is edited by a person, never by a script.

## Where the current tiers came from

Roughly a sixth of the tiers were set by hand in `data/aircraft-types.json`.
The rest were inherited from an older dataset whose tiers nobody had audited,
and several are inverted: a routine widebody sitting at `epic` while its
neo sibling is `common`. `data/tiers.json` prints the source of every tier
(`curated` or `dump`) so you can see which ones have been looked at. The
inherited ones are the best place to start arguing.

## Legends are a different axis

`data/legends.json` lists ten types — Beluga, BelugaXL, Dreamlifter,
An-124, An-225, C-5M, VC-25, B-52, U-2, A400M — that pay a legend bonus
and have a "world first" per type. A legend can sit at any tier; the A400M
is `epic`, the Beluga `mythical`. Legends are about the *event* of seeing
one, tiers are about frequency. Do not propose "make X legendary" when you
mean "add X to legends" — they are separate proposals.

## How a tier changes

1. Open a **Tier change** issue (the form asks where you spot, how often
   you see the type, and what you propose).
2. A maintainer replies on the issue. Agreement means a pull request that
   adds or edits `rarity` for that code in `data/aircraft-types.json`; a
   maintainer can open it for you.
3. Once merged upstream, the new tier applies to the reference within half
   an hour. Cards players already own **keep the tier they were shown**;
   a lowered tier only affects future catches.

Changes are announced on the Discord `#network` channel.

## Frequency, measured

The Skydex receiver network records, per UTC day and 0.5° cell, which
airframes were heard. Turning that into "sightings per week per type per
region" is the planned way to put a number next to every tier so that
debates can be about the number. Until then the number is a person's
judgement, and this repository is where that judgement is questioned.
