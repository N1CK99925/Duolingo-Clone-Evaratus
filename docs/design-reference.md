# Duolingo Design Reference

Collected from https://design.duolingo.com (official brand guidelines).

---

## Brand Colors

### Core

| Name | Hex | Usage |
|------|-----|-------|
| Feather Green | #58CC02 | Primary brand color, buttons, progress |
| Mask Green | #89E219 | Secondary green, Duo's background |
| Eel | #4B4B4B | Typography |
| Snow | #FFFFFF | Primary background |

### Secondary

| Name | Hex | Usage |
|------|-----|-------|
| Macaw | #1CB0F6 | Links, info, XP-related |
| Cardinal | #FF4B4B | Errors, hearts, wrong answers |
| Bee | #FFC800 | Streak, crowns, achievements |
| Fox | #FF9600 | Warnings, secondary highlights |
| Beetle | #CE82FF | Premium, gems |
| Humpback | #2B70C9 | Deep blue accents |

### Neutrals

| Name | Hex |
|------|-----|
| Eel | #4B4B4B |
| Wolf | #777777 |
| Hare | #AFAFAF |
| Swan | #E5E5E5 |
| Polar | #F7F7F7 |
| Snow | #FFFFFF |

### Extended Palette (from illustration guidelines)

| Hex | Color |
|-----|-------|
| D7FFB8 | Light green |
| A5ED6E | Medium green |
| 58A700 | Dark green |
| DDFFF5 | Light cyan |
| 84D8FF | Light blue |
| 1899D6 | Dark blue |
| 1453A3 | Deep blue |
| FF4B4B | Red |
| EA2B2B | Dark red |
| FBE56D | Light yellow |
| FFC800 | Yellow |
| FF9600 | Orange |
| CE82FF | Purple |
| 9069CD | Dark purple |
| 6F4EA1 | Deep purple |
| FFCAFF | Pink |

### Duo's Palette (mascot-specific)

| Part | Hex |
|------|-----|
| Wing Overlay | #43C000 |
| Feather Green | #58CC02 |
| Mask Green | #89E219 |
| Beak Inner | #B66E28 |
| Beak Lower/Feet | #F49000 |
| Beak Upper | #FFC200 |
| Beak Highlight | #FFDE00 |
| Tongue Pink | #FFCAFF |

---

## Typography

### Feather Bold (bespoke — not available publicly)
- Used for: Headlines, short phrases
- Usage: Left-aligned, lowercase, tracking -20, kerning optical
- Never below 30px onscreen
- Never use all caps

### DIN Next Rounded (public alternative: Nunito, Quicksand)
- Used for: Body copy, sub-headings, long headlines (>10 words)
- Usage: Leading 140%, tracking 0, kerning optical
- Never below 14px onscreen
- Left-aligned or centered, never justified

### Web Substitute
Since Feather Bold is proprietary, use:
- **Nunito** (Google Fonts) — closest publicly available match to DIN Next Rounded
- **Quicksand** — good alternative for rounded feel
- For bold headlines, **Nunito Extra Bold** or **Fredoka One**

---

## Button Styles

- **Rounded corners** — Duolingo uses heavily rounded buttons (border-radius ~16px)
- **Drop shadow** — buttons have a subtle bottom shadow (translate-y for pressed state)
- **Primary**: Green (#58CC02) with darker green bottom border for 3D effect
- **Secondary**: Blue (#1CB0F6)
- **Danger**: Red (#FF4B4B)
- **Disabled**: Gray (#E5E5E5)

---

## UI Patterns

### Top Bar
- Logo (left)
- Streak flame icon + count
- XP lightning + count
- Hearts heart icon + count
- Gems gem icon + count
- All horizontally centered in a sticky bar

### Home Path / Skill Tree
- Vertical scrolling path
- Circular skill nodes (like buttons on a board game path)
- Active skill: bright colored ring with icon inside
- Completed: gold crown or filled state
- Locked: gray/muted with lock icon
- Units separated by banners with title and description
- Zigzag path connecting nodes

### Lesson Player
- Progress bar across the top (green fill)
- Hearts counter (top right, red heart)
- Exercise centered on page
- Bottom bar: "Check" button (green) or "Skip" (gray)
- Feedback bar slides up from bottom:
  - Correct: green background, "+10 XP", encouragement text
  - Incorrect: red background, correct answer shown, "-1 heart"
- Sound button (top right of exercise)
- "Report" option (three dots)

### Exercise Types Layout
- **Multiple choice**: 2-4 options as rounded rectangles
- **Translate (word bank)**: Sentence at top, word chips below that tap into answer area
- **Match pairs**: Two columns of tappable items
- **Fill in blank**: Sentence with blank space, keyboard input below
- **Type answer**: Text input field with language toggle

### Modals
- **Lesson complete**: Large green checkmark, XP earned, streak maintained, celebration confetti
- **Out of hearts**: Sad Duo mascot, hearts depleted message, "Practice to earn hearts" CTA
- **Daily goal reached**: Star animation, goal progress

### Character / Mascot States
- Happy Duo: used on correct answers, lesson completion
- Sad/Teaching Duo: used on incorrect answers, hints
- Celebration Duo: used on milestones
- Sleeping Duo: used on streak break
