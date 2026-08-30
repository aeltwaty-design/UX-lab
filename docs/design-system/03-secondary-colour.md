# Secondary brand colour — #FAC333, and the status collision it caused

Client direction: **#FAC333 (gold) is WalaOne's secondary brand colour**, with its own
shade ramp. Adding it forced two changes to the status palette. Both are recorded here
because they alter colours already in use.

---

## 1. The gold ramp

`500` is pinned to **`#FAC333`** exactly. The other steps are derived in OKLCH with the
hue held constant, on a monotone lightness ladder.

| step | hex | | step | hex |
|---|---|---|---|---|
| 50 | `#FFFAEE` | | 500 | **`#FAC333`** |
| 100 | `#FEF2D9` | | 600 | `#D3A100` |
| 200 | `#FEE8B7` | | 700 | `#AF8500` |
| 300 | `#FEDA8B` | | 800 | `#886600` |
| 400 | `#FECE5D` | | 900 | `#604700` |

**The rule that matters:** gold at brand lightness is **1.63:1 on white**. It cannot carry
white text and it cannot be text on white.

- Gold **fills take dark ink** (`#111317` on gold-500 = 11.44:1).
- The lowest gold step usable as **text on white is 800** (`#886600`, 5.32:1).
- Gold is a *surface* colour in this system, not a text colour.

A first attempt placed the ramp on a ladder that made `400` darker than `500` — because
`#FAC333` is naturally light (OKLCH L 0.844) and was being forced into a mid-ramp slot.
The ladder was rebuilt so lightness decreases monotonically with the step number.

## 2. Warning moved off amber — it collided with the brand

The old warning was `#FAB219`. Against brand gold `#FAC333` that measures **ΔE 4.0**
(OKLab ×100). The series floor is 15. At 4.0 the two are effectively the same colour, so
"this is a warning" and "this is the brand" would have been indistinguishable — the exact
failure the original audit criticised, arrived at from the opposite direction.

Warning moved to **orange `#F97C2F`** (hue 48°), chosen as the point with the best
worst-case separation from *both* neighbours:

- vs brand gold — **ΔE 16.6**
- vs danger red — **ΔE 16.1**

Hues below 40° passed against gold but drifted too close to danger; hues above 58° passed
against danger but drifted back toward gold. 48° is the widest gap available.

New warning ramp: `50 #FFF3ED` · `100 #FFE5D8` · `200 #FFCAB0` · `500 #F97C2F` ·
`700 #B75000` (5.05:1 on white, 4.64:1 on its own 50 tint).

## 3. Info moved off blue — it collided with brand purple

Checking the whole matrix surfaced a **pre-existing** problem unrelated to gold: info
`#2A78D6` sat only **ΔE 10.1** from brand purple `#755BD8`. Info moved to teal
**`#0090A8`** (ΔE 18.8 from purple).

## 4. Final separation matrix

Every brand and status pair now clears 15:

| | gold | warning | danger | success | info |
|---|---|---|---|---|---|
| **purple** | 43.9 | 34.7 | 27.6 | 37.8 | 18.8 |
| **gold** | — | 16.6 | 32.2 | 28.6 | 41.9 |
| **warning** | | — | 16.1 | 29.8 | 35.8 |
| **danger** | | | — | 33.9 | 31.6 |
| **success** | | | | — | 31.3 |

## 5. Where gold is used

Gold leads in **Offers** — the reward side of the product, and the one place a second
brand colour earns its keep without competing with purple. It also marks the points
conversion rate. It is deliberately **not** used for status, charts, or primary actions:
purple remains the action colour, and the status palette stays reserved.

---

**For the client to confirm:** the warning and info moves change colours already in your
Figma library. If Singular's own warning and info values are fixed and cannot move, the
alternative is to restrict gold to non-status surfaces only and accept that gold and
warning look alike wherever they appear together — which I would advise against.
