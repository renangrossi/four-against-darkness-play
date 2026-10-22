# Four Against Darkness — Play Table

**[Open the play table →](https://renangrossi.github.io/four-against-darkness-play/)**

A browser play-aid for solo *Four Against Darkness*, plus a page-indexed play reference.
Everything runs locally in one HTML file. No build step, no server, no account.

**Open `index.html` in any browser.** That's it.

## What's in it

| Tab | What it does |
|---|---|
| **1 · Order** | The whole adventure as a tickable checklist, phases A–H, each step pointing at a book and page |
| **2 · Dice** | Tier-aware die (d6→d20) that applies the **Explosion rule** automatically, compares against a Foe's L, and tells you how many minor foes you killed or how much damage you dealt. Quick buttons for morale, wandering, search, reaction, d66, d88. Below it, the tables you roll constantly |
| **3 · Map** | Grid dungeon mapper. Paint rooms/corridors, caverns, ruins, doors, `S` search marks and `X` foes left behind. Resizable grid |
| **4 · Party** | Four PCs with life pips, level, Madness and Clue counters, notes. Major Foe tally with a one-click **Final Boss check** |
| **5 · Log** | Timestamped adventure log that survives between sessions |
| **6 · Lookup** | Type a rule, a book code or a page and get the answer plus the reference. Includes environment→table-set, town and tier-up indexes |
| **7 · Campaign** | Overland hex notes, the rotation tracker (one environment + one bestiary + one spice per dive), and plot/villain threads |

State is saved to your browser's local storage. **Use Export regularly** — local storage can be
cleared by the browser. Import restores a save file.

## Unofficial fan aid

This is an unofficial, non-commercial play aid for *Four Against Darkness*, a game by
Andrea Sfiligoi, published by **Ganesha Games**. It is not affiliated with or endorsed by
Ganesha Games. Rule summaries here exist to speed up play at the table and are no substitute
for the books — you need them to play. Buy them at
**[ganeshagames.net](https://www.ganeshagames.net)**.

If Ganesha Games would like anything here changed or removed, open an issue and it is done.

## The books are not here, and will not be

This repo contains no PDFs. *Four Against Darkness* and its supplements are commercial products
from Ganesha Games — buy them at [ganeshagames.net](https://www.ganeshagames.net). The app and the
guide reference your own copies by **filename and printed page number**, e.g. `4AD 152` means the
expanded core rulebook, page 152.

Book codes are listed in `src/data.js` and on page 2 of the guide.

## The guide

`docs/4ad-dungeon-dive-guide.pdf` — a 12-page play reference: adventure order, the rolls, a combat
card, environment→table-set, a Troublesome Towns index, an Abyss/Forsaken Depths index, and eleven
rules of thumb. Print it or keep it open beside the app.

## Playing on a phone or tablet

The page is responsive and works offline. Three ways to get it onto another device:

1. **Clone the repo** on that device and open `index.html`.
2. **Sync the folder** (Syncthing, Dropbox, a USB stick) and open the file.
3. **Serve it on your LAN** from the machine that has it:
   `python3 -m http.server 8000` then browse to `http://<that-machine-ip>:8000`.

It is also live at **<https://renangrossi.github.io/four-against-darkness-play/>** — add it to your
home screen and it behaves like an app.

## Layout

```
index.html        the app
src/app.css       styles
src/app.js        logic — dice, map, party, log, lookup, campaign
src/data.js       all reference data and page numbers
docs/             the play reference (md + pdf)
```

Page numbers were read from each book's own table of contents, so they are **printed book pages**,
not PDF viewer positions.
