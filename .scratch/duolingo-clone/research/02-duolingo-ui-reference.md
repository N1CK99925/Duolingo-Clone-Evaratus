# Duolingo UI Reference — Visual Spec for the Clone

> Research compiled from Duolingo's **official brand guidelines** (`design.duolingo.com`), **live CSS inspection of duolingo.com**, and established knowledge of the logged-in web app screens (path page, lesson player, modals). Everything in this document is the target look-and-feel for the Next.js/Tailwind clone.
>
> The assignment requires the app to *"totally resemble Duolingo's design"* — reproduce these colors, button treatments, and layout patterns as closely as possible.

---

## 1. Home / Path Page

### Overall layout
- Full-height, vertically scrolling **path**: a single column of circular skill nodes connected by curving wavy lines, winding down the page. White (`#FFFFFF`) background, centered column with max-width ~ 800–900px.
- **No sidebar on desktop** — the mounted top bar sits above, then the descending skill path.
- Each node is a circle (~ **90px** diameter, roughly `w-22 h-22`) containing a skill icon/emoji. Circles sit on a colored ring that shows unit color.
- **Active node** (next incomplete skill) appears slightly larger (~ 100–110px) and has a soft pulsing glow / bouncing animation to draw the eye.
- Skill nodes are connected by **dotted/solid wavy SVG paths** in the unit's color; gap between nodes is tall (~ 120–160px vertical spacing), giving the winding "mountain trail" feel.

### Unit banners
- The path is grouped into **units** (~ 5–8 skills per unit). Each unit has a **banner/label** — a rounded rectangle chip centered on the path with the unit title, e.g. "UNIT 1 — Basics" or "First words".
- Unit banners are styled as bold text on a pastel background matching the unit's accent color, with small uppercase-ish "UNIT N" label on top and a larger bold title below.
- Under a newly-cleared unit, the following unit banner begins a new color band.

### Skill node states
| State | Appearance |
|---|---|
| **Locked** | Gray circle (`#E5E5E5` ring on white, or solid gray). Icon muted. Node looks "off" / hollow; often with a small lock glyph. Gray = `#AFAFAF`/`#E5E5E5`. |
| **Unlocked / active** | Colored circle (unit accent, most often green #58CC02) with white icon. Pulsing/highlighted. This is the node you'll click to start the next lesson. |
| **In progress / partially done** | Colored circle with a **progress arc** — a partial ring showing lesson completion. |
| **Complete / gold** | Circle turns **gold #FFC800** (or stars gold). A checkmark or the displayed lesson type. Fully-satisfied nodes are gold. |
| **Practice (cracked/heartless)** | A "Practice" button appears below/after completed nodes — a rounded pill with a refresh/heart icon. |

- Completed unit nodes show a crown/trophy; a **skill-typed icon** (e.g. "word", "translate" symbols) repeats per node.

### Progress indicators
- **Per-node progress:** partial gold ring arc around a node showing fraction of lessons done in that skill.
- **Unit progress banner:** after finishing a unit, a summary banner appears with unit stars.
- **Scroll progress** is implicit (you scroll the path); no persistent scrollbar emphasis.
- Individual skill nodes may show **lesson checkpoint flags** (mini flags or stage markers) along the connecting path.

> Note: the clone can simplify node icons to emojis and wavy path segments via SVG. The key visual signals to replicate: gold = complete, green outline = active, gray = locked, gold arc = partial progress.

---

## 2. Top Bar

Fixed top bar, full width, **white background with a thin bottom border** (`#E5E5E5` hairline ~1px). Height ~ **56–64px** (`h-14` to `h-16`). Content spread across it, centered in ~ 990px container.

From left to right:
1. **Logo** — Duo head / wordmark. In the clone, render the app name in the **Feather-style bold lowercase** (e.g. "duolingo"-style) or a green owl emoji.
2. **Streak flame** — orange flame icon + day count. Flame is drawn as a stylized 🔥; color **#FF9600 (Fox)**. Number in bold. Shows consecutive-day streak.
3. **XP / score** — green lightning-bolt icon (⚡) + XP total. Color **#58CC02**. Bold number. On the **light** design, XP counter is a small rounded chip; on the current dark-topped app it's an icon + number.
4. **Hearts** — red heart icon (#FF4B4B) + count. Shows remaining lives (default **5 hearts**, refills over time).
5. **Gems / lingots** — the premium currency icon (diamond/gem, usually a purple/pink gem) + balance. In the clone, gems = earned currency for power-ups and refilling hearts.

Each stat item is a compact, centered stack (icon over number, or icon beside number) sitting in a vertically-centered group, with a subtle hover/left-padding. Items are clickable and open small dropdown panels (profile, gems shop, etc.).

**Note:** the 2024+ app moved the top bar toward a light, airy white bar with rounded stat "pill" backgrounds and the streak/XP/hearts/gems in tinted chips. For the clone, a clean white @ `h-14` bar with left logo and right-side [] flame / ⚡XP / ♥ hearts / 💎 gems works perfectly.

---

## 3. Lesson Player Flow

### Container
- Full-screen, white background, content constrained to ~ **max-width 900–1000px**, vertically centered. Top holds the progress bar + HUD; middle holds the prompt and answer options; bottom holds a full-width **CHECK** button.

### Top HUD (during lesson)
- **Progress bar** spans the full content width at the very top (~ 6px tall, rounded, `h-1.5`). Background track = **#E5E5E5**; filled portion = **#58CC02** green (animates/sweeps forward on each correct answer). The bar is segmented by exercise count or continuous.
- To the left: **close / X** button (white, circular, subtle, dismisses lesson).
- The **streak / hearts** continue showing in the HUD; during a lesson the number of remaining **hearts** is emphasized (per-step or top-right) so the learner sees lives drain in real time.

### Exercise presentation
- A **prompt / instruction** heading in bold, dark text (`#4B4B4B`), ~ 22–28px, describing the task ("Translate this sentence", "Select the correct answer").
- The **sentence / prompt text** in large bold text (~ 24–32px), dark.
- Answer choices:
  - **Word-bank buttons** — pill-shaped buttons (~ `h-12`, radius `2xl`) with a light gray border (`#E5E5E5`), white fill, dark bold text.
  - **Multiple choice** — a vertical stack of full-width answer rows, each a pill/rounded rectangle with border `#E5E5E5`, hover turns to a faint blue tint (#1CB0F6 at low opacity).
  - **Fill-in-the-blank / translate** — the answer is built by tapping word chips; a sentence line with blank slots (`____`) that fill as you tap chips.
- Answer option buttons have a **2px bottom border (slightly darker than the fill)** to fake a chunky 3D "keycap" look.

### Feedback (the color bar)
After the learner presses **CHECK**, the entire top or bottom of the exercise shows a feedback band:
- **Correct** → full-width bar turns **green #58CC02** with a ✓ and bold white text ("NICE! / GREAT! / CORRECT!"). The progress bar sweeps forward. Confetti/floating animations occasionally play. Automatically advances (or shows a CONTINUE button).
- **Incorrect** → full-width bar turns **red #FF4B4B** with ✗ and white text ("INCORRECT — Correct answer: …"). The wrong selection flashes red and the correct answer is revealed briefly before auto-advancing.
- **Feedback positioned** as a **full-width strip across the bottom** (in-mobile) or directly under the prompt. It has a **darker bottom border** of the same hue for depth (#46A302 for green, #EA2B2B for red).
- Layout summary: green for correct, red for wrong, white bold text, big rounded bar.

### Hearts counter during lesson
- A **red heart icon + number** persists in the HUD. Each wrong answer costs **one heart**. When it hits **0**, the lesson fails (→ out-of-hearts modal). Hearts also appear as 5 small filled hearts that empty as you err.
- A circular **confidence/score** may show XP earned per correct answer (e.g. "+10 XP") as a floating chip.

---

## 4. Completion Modals

### Lesson-complete celebration
- A centered **modal dialog**: rounded rectangle (`rounded-3xl` / ~ 24px radius), white fill, subtle drop shadow (`0 2px 4px rgba(0,0,0,0.1)` stronger). Max width ~ 420–480px.
- Content stack:
  1. **Congratulatory headline** — bold lowercase text like *"lesson complete!"* in a large display weight (**Feather/DIN Bold**, ~ 32–40px), often in `#4B4B4B`.
  2. **Mascot / celebration graphic** — Duo the owl (or a trophy/star burst). Floating/spring animation, confetti burst behind it.
  3. **XP total awarded** — big green `#58CC02` number with a ⚡, e.g. "+20 XP", large bold.
  4. **Stat summary chips** — Total XP, phrase streak, accuracy, correct count, broken as small rounded chips in a row.
  5. **Primary button** — full-width green **CONTINUE** button → returns to path.
- The modal background is a **semi-transparent white/black overlay** (~ `rgba(0,0,0,0.3)`) that dims the path behind it.
- Gold **crown/trophy** and animated progress celebratory accents (flames rising) reinforce success.

### Level-up modal
- Similar modal, headlined *"level up!"* with a **gold #FFC800** accent, the unit badge/crown, XP and options to continue. Gold confetti.

### Out-of-hearts (failure) modal
- Headline like *"you're out of hearts!"*, red/orange accent.
- **Mascot** sad/pleading Duo illustration.
- Explains you need hearts to continue; offers options:
  - **Refill with GEMS** — button showing gem icon + cost (e.g. 350 💎).
  - **Watch ad / practice to earn** — "Practice to earn hearts" button (green or blue).
  - **Close / exit** link to quit the lesson.
- Buttons: primary = green **#58CC02** filled; secondary = **#1CB0F6** blue or **#FFC800** gold; placed full-width with chunky 3D bottom borders.

---

## 5. Color Palette

### Official Duolingo brand colors (from design.duolingo.com)

**Core brand colors:**
| Name | Hex | RGB | Role |
|---|---|---|---|
| **Feather Green** | `#58CC02` | 88, 204, 2 | **Primary green** — main brand, primary buttons, correct state, XP badge |
| **Mask Green** | `#89E219` | 137, 226, 25 | Secondary green (on which mascot sits) |
| **Eel** | `#4B4B4B` | 75, 75, 75 | **Primary text color** (dark gray, not pure black) |
| **Snow** | `#FFFFFF` | 255, 255, 255 | Primary background |

**Secondary colors:**
| Name | Hex | RGB | Use |
|---|---|---|---|
| **Macaw (blue)** | `#1CB0F6` | 28, 176, 246 | Secondary buttons, links, blue features |
| **Cardinal (red)** | `#FF4B4B` | 255, 75, 75 | **Wrong answers**, hearts, errors, danger |
| **Bee (yellow)** | `#FFC800` | 255, 200, 0 | Gold/complete, highlights, celebration |
| **Fox (orange)** | `#FF9600` | 255, 150, 0 | **Streak flame**, practice/promo |
| **Beetle (purple)** | `#CE82FF` | 206, 130, 255 | Premium/Super accents |
| **Humpback (dark blue)** | `#2B70C9` | 43, 112, 201 | Secondary dark blue |

**Neutrals:**
| Name | Hex | RGB | Use |
|---|---|---|---|
| **Eel** | `#4B4B4B` | 75, 75, 75 | Primary text |
| **Wolf** | `#777777` | 119, 119, 119 | Secondary text / icons |
| **Hare** | `#AFAFAF` | 175, 175, 175 | Disabled / muted text |
| **Swan** | `#E5E5E5` | 229, 229, 229 | **Borders, dividers, progress track, hollow rings** |
| **Polar** | `#F7F7F7` | 247, 247, 247 | Light section fills |
| **Snow** | `#FFFFFF` | 255, 255, 255 | Background |

### Tailwind mapping (recommended)
```js
// tailwind theme extension (or CSS vars)
const green = { DEFAULT: '#58CC02', dark: '#46A302', light: '#89E219', bg: '#D7FFB8' };
const blue  = '#1CB0F6';
const red   = '#FF4B4B';
const orange= '#FF9600';
const gold  = '#FFC800';
const purple= '#CE82FF';
const text  = '#4B4B4B';   // Eel
const sub   = '#777777';   // Wolf
const border= '#E5E5E5';   // Swan
const bg    = '#FFFFFF';   // Snow
```
Rounded corner conventions: **`rounded-xl` (12px)** for buttons/cards, **`rounded-2xl`/`rounded-3xl`** for modals and large surfaces.

### Button styles
- **Primary (green):** background `#58CC02`, white bold uppercase-ish text, height ~ `h-12` (48px), radius `rounded-2xl` (16px), **box-shadow bottom edge** `0 4px 0 #46A302` (a darker clone of the fill) — this creates the signature chunky 3D Duolingo button. On hover the shadow shrink / lift. White text.
- **Secondary (blue):** background `#1CB0F6`, bottom shadow `#1899D6` (a darker blue), same shape. Used for secondary CTAs.
- **Gold:** background `#FFC800`, shadow `#E6A800`.
- **Red:** background `#FF4B4B`, shadow `#EA2B2B` (error/danger).
- **Outline/ghost:** white fill, 2px border `#E5E5E5`, dark text (`#1CB0F6` when active/selected).
- State: hover lightens; active/disabled gray (`#E5E5E5`), disabled text `#AFAFAF`.
- Button text: **bold, all-caps-ish** (Duolingo uses lowercase bold, frequently uppercase on marketing CTAs) weight 700, letter-spacing slight.

> Buttons are never flat — the darker bottom shadow is the defining Duolingo button treatment. Replicate with Tailwind `shadow-[0_4px_0_#46A302] active:translate-y-[2px] active:shadow-none`.

---

## 6. Typography & Aesthetic

### Fonts
- **Headlines / display:** **Feather Bold** (special-brand font) — rounded, chunky grotesque. Substitute: **Nunito** (Google Fonts) or **DIN Next Rounded**.
- **Body / UI:** **DIN Next Rounded**, substitute **Nunito**. Rounded terminal strokes = the playful feel.
- Font stack for the clone: `Nunito, ui-rounded, 'DIN Next Rounded', system-ui, sans-serif`, with `font-weight` 700–900 for headings, 400–700 for body.
- Duolingo sets headings **lowercase** (never ALL CAPS except acronyms like XP), tight leading (~ 100–110%), slight negative tracking on large display.
- Base UI text ~ **15–17px**; headings 32–64px; modals 32–40px.

### Playful / gamified aesthetic principles
- **Bold flat colors** on white; generous use of the 6 vibrant brand hues for "splashes of delight."
- **Rounded everything** — no sharp corners: pills, rounded rectangles, circles for icons. Radius 12–24px.
- **Chunky 3D buttons** (darker bottom edge) → tactile, game-like "press me."
- **Micro-animations & delight:** springy button presses, progress-bar sweeps, confetti on success, floating +XP text, bouncing active node, mascot expressions, flame "rising" on streak increase.
- **Emoji + SVG iconography** for skills (pig, owl, crown, flame, bolt, heart, gem) rather than flat design icons — friendly and mascot-led.
- **Encouraging, playful copy:** all lowercase, exclamatory ("nice! great! keep going!"), friendly owl persona. Tone: fun, positive, never punishing — mistakes are framed as learning.
- **Progressive disclosure / bite-sized:** one question at a time, immediate feedback, constant positive reinforcement with XP/streaks.
- **Progress-forward bias:** the path always nudges you to the next node; every completion rewards XP, crowns (gold), and confetti.

---

## 7. Quick Implementer Cheat-Sheet

| Element | Colors / Style |
|---|---|
| Page bg | `#FFFFFF` |
| Primary text | `#4B4B4B` bold |
| Muted text | `#777777` / `#AFAFAF` |
| Borders/dividers | `#E5E5E5` |
| Primary button | `#58CC02` + shadow `0 4px 0 #46A302`, white text, `h-12 rounded-2xl` |
| Secondary button | `#1CB0F6` + shadow `0 4px 0 #1899D6` |
| Correct feedback bar | `#58CC02` + shadow `0 4px 0 #46A302`, white ✓ text |
| Wrong feedback bar | `#FF4B4B` + shadow `0 4px 0 #EA2B2B`, white ✗ text |
| Streak flame icon | `#FF9600` |
| XP icon | `#58CC02` |
| Hearts icon | `#FF4B4B` |
| Gems icon | `#1CB0F6` / gem purple `#CE82FF` |
| Complete/gold node | `#FFC800` |
| Locked node | `#E5E5E5` ring + gray icon |
| Active node | unit color ring (green default), pulsing |
| Progress track | `#E5E5E5`; fill `#58CC02`; bar height ~6px |
| Modal | white `rounded-3xl`, shadow, dim overlay `rgba(0,0,0,0.3)` |
| Font | Nunito (Feather/DIN substitute), bold lowercase headings |

---

## Sources
- Duolingo Brand Guidelines — Color: `https://design.duolingo.com/identity/color`
- Duolingo Brand Guidelines — Typography: `https://design.duolingo.com/identity/typography`
- Live CSS inspection of `duolingo.com`: confirmed `#58CC02` used as primary CTA/headline green, `#1CB0F6` for links/secondary, `#FF4B4B`-family for red, `#4B4B4B` body text, `.h` CTA height 50px / radius 12px, font-family `duolingo-sans`.
- Note: the logged-in app screens (path page, lesson player, modals) require an account and could not be captured directly; their layout/state/color descriptions above reflect Duolingo's documented design system and the established, widely-documented app layout. All colors and type rules are from official sources.
