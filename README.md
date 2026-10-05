# D for DSA

A structured repository of essential Data Structures and Algorithms problems.
143 problems across ten chapters, sequenced so each one only asks for what the
last one taught you.

## What it does

- **All 143 problems on one page**, grouped by chapter, in learning order.
- **Track progress.** Click any problem to mark it solved. Stored in
  `localStorage`, so it stays put between visits and never leaves the browser.
- **Search everything.** Press <kbd>⌘K</kbd> / <kbd>Ctrl K</kbd> or <kbd>/</kbd>.
  Matches on problem name, chapter name, or as a subsequence (`bs` finds
  *binary search*).
- **Per-chapter progress dots** in the sidebar index: one square per problem.
- **Deep links.** `index.html#sorting` opens straight to a chapter.
- **Keyboard.** <kbd>j</kbd> / <kbd>k</kbd> walk the list, <kbd>Enter</kbd> toggles.
- **Two themes.** Ink (warm near-black, default) and paper, with a toggle in the
  header. The choice is remembered, and the initial default follows your OS
  preference.

## Files

```
index.html      markup and SEO metadata
styles.css      design tokens, themes, all layout
script.js       application logic
curriculum.js   the syllabus, as data
```

No build step, no dependencies, no framework. Open `index.html` and it runs.

## Chapters

| Chapter | Problems |
| --- | --- |
| Basics | 1 |
| Basics Programs | 12 |
| Bitwise | 7 |
| Recursion | 12 |
| Lists | 21 |
| Searching | 17 |
| Sorting | 26 |
| Matrix | 8 |
| Hashing | 20 |
| Strings | 19 |

## Editing the syllabus

Everything lives in `curriculum.js`. Add or remove entries in the `problems`
array of the relevant chapter; the counts, dot matrices, progress totals and
search index all derive from it automatically.

## Accessibility and motion

Single `h1`, real heading order, list semantics on the problem lists,
`aria-pressed` on every toggle, visible focus rings, and full keyboard reach.
Motion is additive only and is disabled under `prefers-reduced-motion: reduce`.

## Credits

By Aditya Kate. Typeset in Cabinet Grotesk and Geist.
