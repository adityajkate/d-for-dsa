# Design guide for LLM-built and LLM-powered interfaces

This guide has two parts. Part A applies whenever you generate or review any interface, and helps it avoid the generic "AI-generated look". Part B applies when the product itself is an AI interface (chat, copilots, generative tools).

---

## 0. How to use this guide

### 0.1 Precedence

1. **The brief, brand, and existing design system win.** If the client's brand uses Inter, a gradient, or a cream-and-terracotta palette, use it. Nothing below overrides an explicit instruction.
2. **The accessibility floor (section 10) is not negotiable.**
3. **Everything else is a default, not a law.** "Avoid X" means "don't use X because it was the easiest option." If you choose X deliberately for this subject, use it and note why.

### 0.2 Process

1. **Plan.** Write a compact token plan before any UI code:
   - Color: 4 to 6 named hex values.
   - Type: typefaces and the role of each.
   - Layout: a one-sentence concept and a rough wireframe. State the alignment (left, centered, justified).
   - Principles: what makes this design specific to this subject.
2. **Review the plan.** Ask whether you would arrive at the same plan for any similar prompt. If so, revise the parts that read as generic and say what you changed.
3. **Build** to the revised plan.
4. **Critique.** Review screenshots if your environment supports them. Cut one decorative element before finishing.

---

# Part A: Avoiding the generic look

## 1. Core principles

### 1.1 Design for humans first
Every decision should solve a user problem, not chase a trend. Consistency builds confidence. Design inclusively from the start.

### 1.2 Make choices specific to the subject
Trend cycles converge on the same safe fonts, gradients, and layouts. The subject's industry, materials, audience, and vocabulary are where distinctive choices come from. A design for children's toys and a dashboard for financial analysts should not look related.

### 1.3 Spend boldness in one place
Let one element be the memorable thing. Keep everything around it quiet and disciplined.

---

## 2. Visual hierarchy

The eye should move through the layout in order of importance.

### 2.1 Three levels

| Level | Role | Elements |
|-------|------|----------|
| **Primary** | Answers "where am I and why does it matter?" | Headlines, hero content, key callouts |
| **Secondary** | Signposts along the scan path | Subheads, captions, section labels |
| **Tertiary** | Sustained reading; drives trust | Body copy, descriptions, metadata |

Hierarchy lives in the contrast between levels, not in any one level's size. A 48px headline in a thin weight can read as weaker than a 24px bold subhead.

### 2.2 Rules

- **Type scale:** Define one scale (typically 4 to 6 steps on a consistent ratio) and give each step a job. Use at least three clearly distinct levels: heading, subheading, body.
- **Focal point:** Each section has one element that catches the eye first.
- **Spacing:** More space signals more importance. Group related items closely and separate unrelated ones.
- **Rhythm:** Alternate dense and airy sections. Uniform spacing everywhere flattens hierarchy, and so does purposeless whitespace.
- **Alignment:** Left-align by default. Reserve centering for hero blocks and calls to action.

### 2.3 Levers
Scale, value (light/dark), color saturation, spacing, placement, weight, tracking, and line height. Size alone is rarely enough.

### 2.4 Anti-patterns

- Centered layouts, or centered long paragraphs
- Every heading the same size
- Body text under 16px or line height under 1.5
- Poor contrast
- Uniform cards with no variation in size or prominence

---

## 3. Color

### 3.1 Strategy

- Pick a dominant color (roughly 60 to 70% of visual weight) and sharp accents (roughly 5 to 10%).
- Derive the palette from the brand or content, not from trends. Name each token and give it a purpose.
- Build a neutral scale with a deliberate warm or cool bias. Avoid pure `#000` and `#FFF` as the main colors.
- Never rely on color alone to convey information. Pair it with text, icons, or patterns.

### 3.2 Common defaults that read as unchosen

These are all legitimate when chosen for a subject. They are generic when they appear regardless of subject:

- Blue-purple or purple/pink/cyan gradients, mesh gradients, holographic effects
- Warm cream background, high-contrast serif display, terracotta accent
- Near-black background with one acid-green or vermilion accent
- Soft grey drop shadows under everything
- Gradient washes used as decoration

### 3.3 Gradients

- Do not use gradient text on headings.
- Do not make gradients the primary visual identity or overlay them on every image.
- A gradient used as a small, purposeful accent is fine. Solid colors, texture, pattern, and illustration are usually stronger foundations.

### 3.4 Contrast
WCAG 2.2 AA minimums: 4.5:1 for body text, 3:1 for large text, and 3:1 for UI components, focus indicators, and meaningful graphics.

---

## 4. Typography

### 4.1 Choosing typefaces

- Choose typefaces for this subject, then test them against alternatives. Do not reach for the shortlist you would use on any project.
- This includes the "distinctive" shortlists. Any list of recommended fonts becomes the next default once everyone uses it, so this guide does not include one.
- Inter, Roboto, Arial, and Space Grotesk are fine when they are the brand's or platform's face, such as system UI or an existing product. They are a tell only when they are the fallback because nobody chose.
- One family is often enough. If you use two, make them clearly distinct in structure. Use no more than three.
- Check licensing and loading, and always provide a real fallback stack.

### 4.2 Rules

- Body text is at least 16px with line height of at least 1.5. Give serif body text slightly more leading than sans-serif.
- Keep line length between about 45 and 75 characters, and under 80.
- Set hierarchy with weight, tracking, line height, and color as well as size.
- Let display type be an active part of the design when it is used as a visual element.
- Use display faces for headlines only, never for body copy.

### 4.3 Anti-patterns

- Emphasizing a single word in a headline with italic, bold, or a different color
- ALL CAPS labels as a default treatment
- Gradient text
- Five or more typefaces
- Inconsistent weights and sizes
- Pairing a default icon set with a default typeface without choosing either

---

## 5. Layout, cards, and composition

### 5.1 Start with composition
Start with composition and information hierarchy, not a component list. Give each section one job and one dominant visual idea. Open with the most characteristic thing in the subject's world: a headline, image, live demo, or interactive moment. A big number, small label, and gradient accent is the default hero, so use it only if it is truly the best option.

### 5.2 Use cards only when they carry meaning
Use a card when containment, comparison, selection, or elevation communicates structure. Otherwise use open layout, bands, lists, or tables.

Avoid:
- A card around every region
- Three equal feature cards, repeated bento tiles, or stacked card mosaics
- One border radius on everything regardless of hierarchy
- The same shadow under every card
- The same split image/text section repeated in a zigzag

### 5.3 Better approaches

- Use a small radius scale (for example inputs < containers < overlays) rather than a single value, and keep it consistent.
- Use asymmetric grids when hierarchy calls for them, not as a reflex.
- Use a 4px or 8px spacing scale.
- Design mobile-first and check down to a 320px viewport.

---

## 6. Structural devices and template chrome

Borders, dividers, numbering, eyebrows, and labels are information. Use each only when it says something the content does not already say.

- **Eyebrows** (small labels above headings): omit by default. Use one only when it supplies information the heading cannot. Never use them on adjacent sections; on a long page, no more than about one in three sections.
- **Numbered markers** (01, 02, 03): only when the content is a real sequence, such as steps or a timeline.
- **Common chrome to check before including:** tracked-out all-caps labels, meta strings joined with middle dots, "WORD — fragment" labels, monospace for small data labels, and an arrow appended to every link or button.

---

## 7. Motion and micro-interactions

### 7.1 Purpose over decoration
Motion should show what changed or direct attention. It should answer an action, such as opening, expanding, or confirming.

### 7.2 Rules

- Keep most transitions under 300ms.
- Use consistent duration and easing across the product.
- Give immediate, subtle feedback.
- Respect `prefers-reduced-motion` and provide a static equivalent.
- Never use `transition: all`. List the properties you animate.
- For motion that no one triggered, prefer one orchestrated moment, such as a single page-load sequence, over scattered effects.
- Avoid fade-and-slide-up entrances on every section and hover transitions on every card.

### 7.3 Anatomy of a micro-interaction

- **Trigger:** a user action or system condition.
- **Rules:** what happens after the trigger.
- **Feedback:** the visible, audible, or haptic confirmation.
- **Loops and modes:** duration, repetition, and state changes.

---

## 8. Content and copy

Words are design content. Every string should make the interface easier to understand and use.

### 8.1 Avoid filler

- No buzzwords ("elevate," "unleash," "seamless," "next-generation," "revolutionize"). Replace them with a concrete action or benefit.
- No fake metrics or implausibly round numbers, invented testimonials, or placeholder brands presented as fact.
- No fake product screenshots made from meaningless rectangles.

### 8.2 Interface writing

- Write from the user's perspective in plain language. Say "manage notifications," not "configure webhooks."
- Use sentence case and active voice.
- Buttons say what will happen: "Save changes," not "Submit."
- Keep names consistent through a flow. A "Publish" button produces a "Published" confirmation.
- Errors say what went wrong and how to fix it. They do not apologize or stay vague.
- Empty states point to the next action.

---

## 9. Design tokens and foundations

Define colors, typography, spacing, radius, and shadow before writing UI code. If you receive a mood board, screenshot, or palette, extract its dominant colors and adapt the system to them.

Never hardcode values. Use tokens:

```css
/* Correct */
color: var(--text-primary);
padding: var(--space-4);

/* Incorrect */
color: #333333;
padding: 16px;
```

Define light and dark themes as token sets, not as separate stylesheets.

---

## 10. Accessibility floor

These items are required, regardless of style.

- Contrast meets section 3.4.
- Every interactive element has a visible keyboard focus state and is reachable and operable by keyboard.
- Touch and click targets are at least 24px (WCAG 2.2 minimum), and 44px where space allows.
- Use semantic HTML, and give every form control a label.
- Motion respects reduced-motion preferences.
- Layout works from 320px up, and the page never scrolls sideways. Wide content scrolls in its own container.
- Text can be resized to 200% without loss of content.
- Dynamic updates use live regions that exist in the DOM, empty, before content is injected.

---

# Part B: Patterns for AI products

## 11. Trust and transparency

- Visually distinguish AI-generated content from human-written content.
- Cite sources. When a response draws on several, link each one. In recommendation tables, link each item to its detail page.
- Show uncertainty where it matters. Do not present every output with the same confidence.

## 12. Control and forgiveness

AI makes mistakes. The interface should make correcting them cheap.

- Let users **regenerate**, **edit**, **undo**, and **stop**.
- Offer regeneration with direction where it fits, for example "shorter," "more formal," or "prioritize price over popularity," alongside a plain "Try again."
- Keep previous versions available so regenerating never destroys a result the user liked.
- Show when results are becoming repetitive, and suggest changing the request.
- Trigger costly or surprising generation, such as images, on explicit user intent rather than automatically.
- Use progressive disclosure: the answer first, an expandable "why" second, and the sources, tool calls, and steps taken third. Present the trace as what the system did, not as a guaranteed account of why it produced the answer.

## 13. Latency and streaming

- Render tokens as they arrive. Do not fake a typing effect over a response that has already finished.
- Use skeleton placeholders for structured content such as cards, tables, and images. Do not use them for streaming text.
- Show a clear working state before the first token, and a visible **Stop** control during generation.
- Render partial markdown gracefully, and do not shift the layout or steal scroll position while the user reads.
- For screen readers, announce that a response has started and finished. Do not announce every token.

## 14. Input

- Give the empty input a job: a specific placeholder, a few example prompts, or context the model already has.
- Use an auto-expanding text area for long prompts.
- Show **context pills** for the files, data, or tools the model is using, and let users remove them.
- Support slash commands (for example `/image`, `/code`) for power users. Make them discoverable and keyboard accessible.

## 15. Errors, refusals, and limits

- Say what happened and what the user can do next. Preserve their input.
- Rate and usage limits state when they reset.
- A refusal explains what could not be done in plain terms and offers an alternative where one exists.
- Provide a lightweight way to give feedback on a response, such as a rating with an optional comment, and a way to report a problem.

## 16. Safety of rendered output

- Never inject raw model output into the DOM. Sanitize HTML and markdown before rendering.
- Add `rel="noopener noreferrer"` to links in model output, and treat model-produced URLs and code as untrusted.
- Never execute model-produced code in the page's own context.

## 17. Component set

An AI interface typically needs:

- **Prompt input:** auto-expanding, with context pills and slash commands.
- **Streaming response container:** handles partial content and stop/retry.
- **Trust indicators:** citations, sources, and confidence where meaningful.
- **Explainability:** "why" expanders and tool traces.
- **Control cluster:** regenerate, edit, copy, undo, and feedback.
- **Error, empty, and limit states:** written per section 15.

---

# Checklist

**Precedence and process**
- [ ] Brief and brand constraints applied first
- [ ] Token plan written and reviewed against "would any similar prompt produce this?"
- [ ] One memorable element; one decorative element cut

**Hierarchy and type**
- [ ] Defined type scale, at least three clearly distinct levels
- [ ] One focal point per section; centering only for hero and calls to action
- [ ] Typefaces chosen for this subject; two or three families at most
- [ ] Body at least 16px, line height at least 1.5, line length under 80 characters

**Color**
- [ ] Dominant color plus sharp accents; named tokens
- [ ] No gradient text; gradients only as small, purposeful accents
- [ ] No pure black or white as the main colors unless chosen
- [ ] Contrast meets WCAG 2.2 AA, including UI components and focus indicators
- [ ] Color never the only carrier of meaning

**Layout and chrome**
- [ ] Cards only where they carry structure; radius and shadow vary with hierarchy
- [ ] No three equal feature cards or zigzag repetition by default
- [ ] Eyebrows, numbering, all-caps labels, and arrows each justified by the content
- [ ] Works from 320px up

**Motion**
- [ ] Most transitions under 300ms with consistent easing
- [ ] Reduced motion respected; no `transition: all`
- [ ] Motion tied to user actions, not scattered

**Copy**
- [ ] No buzzwords, fake metrics, or invented social proof
- [ ] Buttons name their action; errors say what happened and how to fix it
- [ ] Empty states point to the next action

**AI products**
- [ ] AI content distinguishable from human content; sources cited
- [ ] Stop, regenerate, edit, and undo available
- [ ] Real streaming, not simulated; skeletons only for structured content
- [ ] Input never a bare box; context visible
- [ ] Errors, refusals, and limits explain next steps
- [ ] Model output sanitized before rendering

---

*Review this guide as standards and user research evolve. Fonts, palettes, and layouts that read as distinctive today will become defaults, so keep the principle (choose deliberately for the subject) ahead of any specific example.*