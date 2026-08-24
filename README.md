# CloudStry UI Components

A React component library built on [Material Design 3](https://m3.material.io/) and [Material Web Components](https://github.com/material-components/material-web). Provides a complete set of accessible, token-driven UI components for React 18–20 and Next.js applications with full SSR support.

---

## Features

- **Material Design 3** — components conform to the M3 specification using Google's official Material Web (`@material/web`) custom elements as the rendering layer
- **React-first API** — clean, stable React props; `@material/web` tags and `--md-*` tokens are implementation details that never leak to consumers
- **Token-driven theming** — every component exposes a `--cst-*` CSS custom property contract; theme the entire library or individual instances without specificity wars or shadow-DOM hacks
- **SSR support** — a dedicated `/ssr` entry point ships SSR-safe variants of every component for use in Next.js App Router and other server-rendering environments
- **Controlled + uncontrolled** — all stateful components (inputs, checkboxes, dialogs, etc.) support both usage modes
- **Accessible by default** — ARIA roles, live regions, keyboard navigation, and dev-mode warnings are built in
- **Responsive foundation** — ships a `responsive.css` layer with M3-aligned breakpoint tokens (`--cst-space-*`, `--cst-page-pad-x`, `--cst-container-max`) and utility classes
- **Tree-shakeable** — dual ESM + CJS build with `preserveModules`; import only what you use

---

## Installation

```bash
npm install @cloudstrytech/ui-components @material/web
```

---

### React (Vite / Create React App)

**1. Import the stylesheet**

Open `src/main.jsx` (Vite) or `src/index.jsx` (Create React App) — the entry file that mounts your React tree — and add the import at the top:

```js
// src/main.jsx  ← Vite
// src/index.jsx ← Create React App
import "@cloudstrytech/ui-components/styles.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```

The stylesheet only needs to be imported once; every component in your app will pick it up automatically.

**2. Add the Material Symbols font (required for `IconButton` and icon strings in `Button`)**

Open `index.html` in the project root (the single HTML file Vite / CRA ships) and add the `<link>` inside `<head>`:

```html
<!-- index.html (project root) -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>

    <!-- Add this line ↓ -->
    <link
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

> Skip step 2 if you do not use `IconButton` or icon string props on `Button`.

---

### Next.js (App Router — Next.js 13+)

**1. Import the stylesheet**

Open `app/layout.jsx` (or `app/layout.tsx`) — the root layout that wraps every page — and import the stylesheet at the top of that file:

```jsx
// app/layout.jsx  ← this is your application root in App Router
import "@cloudstrytech/ui-components/styles.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

This single import covers every page and component in your app.

**2. Add the Material Symbols font (required for `IconButton` and icon strings in `Button`)**

Next.js has no standalone `index.html`. The recommended approach is to use the built-in `next/font` Google Fonts integration, which self-hosts the font and avoids an external network request.

**Option A — `next/font` (recommended):**

```jsx
// app/layout.jsx
import "@cloudstrytech/ui-components/styles.css";
import { Inter } from "next/font/google";

// next/font doesn't support variable fonts from the icons CDN directly,
// so load Material Symbols via the link tag approach in metadata instead.
export const metadata = {
  // other metadata fields …
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

**Option B — Next.js `<head>` metadata (alternative):**

If you prefer to keep `<head>` metadata separate, add it via the `generateMetadata` export or the `metadata` object:

```jsx
// app/layout.jsx
import "@cloudstrytech/ui-components/styles.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Next.js allows extra <link> tags directly inside <head> in layout */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

> Skip step 2 if you do not use `IconButton` or icon string props on `Button`.

---

### Next.js (Pages Router — Next.js 12 and below / legacy)

**1. Import the stylesheet**

Open `pages/_app.jsx` (or `pages/_app.tsx`) — the custom App component that wraps all pages — and import the stylesheet at the top:

```jsx
// pages/_app.jsx
import "@cloudstrytech/ui-components/styles.css";

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
```

**2. Add the Material Symbols font**

Open `pages/_document.jsx` (create it if it doesn't exist) — this is the equivalent of `index.html` in Pages Router and is the correct place to inject global `<head>` tags:

```jsx
// pages/_document.jsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Add this ↓ */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

> `pages/_document.jsx` only renders on the server; it is the right place for font tags, not `pages/_app.jsx`.

---

## Quick Start

```jsx
import "@cloudstrytech/ui-components/styles.css";
import { Button, Input, Card, CardHeader, Dialog } from "@cloudstrytech/ui-components";
import { useState } from "react";

export default function Example() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  return (
    <Card header={<CardHeader title="Contact form" subtitle="Enter your details" />}>
      <Input
        label="Full name"
        value={name}
        onChange={setName}
        required
      />
      <Button onClick={() => setOpen(true)}>Submit</Button>

      <Dialog
        open={open}
        headline="Submitted"
        onClose={() => setOpen(false)}
        actions={<Button onClick={() => setOpen(false)}>Close</Button>}
      >
        Hello, {name}!
      </Dialog>
    </Card>
  );
}
```

---

## Components

### Actions

| Component | Export(s) | Description |
|---|---|---|
| Button | `Button` | All 5 M3 variants: `filled`, `tonal`, `elevated`, `outlined`, `text`; sizes `xs`–`xl`; `loading` state; link button via `href`; native `type` semantics inside a `<form>` |
| FAB | `FAB` | Floating Action Button; `md`/`lg` sizes; `branded` variant; optional `position` prop for fixed placement |
| IconButton | `IconButton` | 4 MWC variants: `standard`, `filled`, `tonal`, `outlined`; toggle mode |

### Text Inputs

| Component | Export(s) | Description |
|---|---|---|
| Input / TextField | `Input` | Outlined and filled variants; controlled + uncontrolled; error state; icons; prefix/suffix; multiline/textarea; character counter; `onEnter` + implicit form submission |
| PasswordField | `PasswordField` | Input composition with show/hide toggle |
| SearchField | `SearchField` | Input composition with search semantics |
| Select | `Select` | Input composition + `Menu`/`MenuItem` popup (`md-menu`); data-driven `options`; `multiple`; `clearable`; controlled-only |
| Combobox | `Combobox` | Search-as-you-type picker: filters as you type, single or `multiple`, chip output, optional create-new row. Popup positioned with `@floating-ui/react` |
| OTP Input | `OtpInput` | Numeric OTP with auto-focus management, paste handling, WebOTP (Android Chrome), and resend timer |

### Selection

| Component | Export(s) | Description |
|---|---|---|
| Checkbox | `Checkbox`, `CheckboxGroup` | Controlled + uncontrolled; `indeterminate`; sizes `sm`/`md`/`lg`; `CheckboxGroup` uses `<fieldset>`+`<legend>` with `vertical`/`horizontal` orientation |
| Radio | `Radio`, `RadioGroup` | `RadioGroup` with `<fieldset>`+`<legend>`; controlled + uncontrolled; value-first `onChange` |
| Switch | `Switch` | MWC `md-switch`; icons; controlled + uncontrolled |
| Slider | `Slider` | Single and range modes; `onInput` (continuous) + `onChange` (committed); `formatValue` for thumb labels |
| Chips | `AssistChip`, `FilterChip`, `InputChip`, `SuggestionChip`, `ChipSet` | All 4 M3 chip types; sizes `sm`/`md`; `ChipSet` with configurable wrapping |

### Containment

| Component | Export(s) | Description |
|---|---|---|
| Card | `Card`, `CardHeader` | 3 MWC Labs variants: `elevated`, `filled`, `outlined`; `header`/`media`/`body`/`actions` slot layout; `loading` skeleton; `horizontal` layout; `background` prop; interactive (`onClick`/`href`) |
| Dialog | `Dialog` | Controlled; 3-slot API (`headline`/`children`/`actions`); `size="basic"\|"sm"\|"md"\|"lg"\|"xl"\|"full-screen"`; per-instance `width`; `closeOnBackdrop` |
| List | `List`, `ListItem` | MWC list with `start`/`end` icon slots; `dense` mode; `data-disabled` link support |
| Divider | `Divider` | Pure CSS `<hr>`; horizontal/vertical; inset variants; SSR-safe (no `"use client"`) |

### Communication

| Component | Export(s) | Description |
|---|---|---|
| Progress | `CircularProgress`, `LinearProgress` | MWC progress elements; `value` 0–100; `fourColor` mode |
| Snackbar | `Snackbar`, `SnackbarProvider`, `useSnackbar` | Fully custom; FIFO queue; persistent ARIA live regions; hover/focus pause; `type` variants; `position` |
| Tooltip | `Tooltip` | Fully custom with `@floating-ui/react`; `cloneElement` trigger pattern; portal rendering; `aria-describedby` wired automatically |
| Badge | `Badge` | MWC Labs badge; `BadgeWrapper` pattern for relative positioning; `value`/`max`/`variant`. A dot/counter overlaid on another element — for a standalone status label use `Tag` |
| Tag | `Tag` | Read-only status label ("Ongoing", "Completed"); 6 variants; `dot`; sizes `sm`/`md`; pure CSS, SSR-safe (no `"use client"`) |

### Navigation

| Component | Export(s) | Description |
|---|---|---|
| Tabs | `Tabs`, `Tab`, `TabPanel` | MWC `md-tabs`; `primary`/`secondary` variants; icon support; composition API |
| Menu | `Menu`, `MenuItem` | MWC menu; `anchorRef`-based positioning; controlled + imperative `open`; `keepOpen` per item. Also usable as a **general anchored popover** with arbitrary children — see below |

### Layout / Utility

| Component | Export(s) | Description |
|---|---|---|
| Footer | `Footer` | Slot-based (`brand`/`links`/`social`/`legal`/`children`); `simple`/`centered`/`split` variants; SSR-safe |
| Table | `Table` | Custom data table; sortable columns; single/multi row selection; search; pagination; expandable rows (`renderExpandedRow`); `col.interactive` action cells; density modes; sticky header; zebra striping; bulk actions toolbar |

### Select

`Select` composes the same `Input` shell used by `PasswordField`/`SearchField` with a `Menu`/`MenuItem` popup (`md-menu` composition): a read-only trigger styled identically to `TextField`, opening a `role="listbox"` popup of options anchored to it. Data-driven via an `options` array; value-first `onChange`; inherits `label`/`floatingLabel`/`error`/`supportingText`/`required`/`disabled`/`ref` from the shared field shell. Multi-select is supported via `multiple` (see below).

**Import**

```js
import { Select } from "@cloudstrytech/ui-components";
// or
import { default as Select } from "@cloudstrytech/ui-components/select";
```

**Basic**

```jsx
const ROLE_OPTIONS = [
  { label: "Admin", value: "admin" },
  { label: "Editor", value: "editor" },
  { label: "Guest", value: "guest" },
];

function RoleField() {
  const [role, setRole] = useState("");
  return (
    <Select
      label="Role"
      placeholder="Choose a role"
      options={ROLE_OPTIONS}
      value={role}
      onChange={setRole}
    />
  );
}
```

**Options — disabled entries**

```jsx
const OPTIONS = [
  { label: "Admin", value: "admin" },
  { label: "Editor", value: "editor" },
  { label: "Viewer (coming soon)", value: "viewer", disabled: true },
];
```

A disabled option renders dimmed and cannot be selected; the rest of the dropdown stays interactive. `disabled` on `Select` itself (rather than on an option) prevents the field from opening at all.

```jsx
<Select label="Role" options={ROLE_OPTIONS} value="admin" disabled />
```

**Controlled usage**

`Select` is controlled-only — pass `value` + `onChange`. Unlike `Input`/`PasswordField`/`SearchField`, there is no uncontrolled `defaultValue` mode.

```jsx
const [country, setCountry] = useState("");

<Select
  label="Country"
  placeholder="Select a country"
  options={COUNTRY_OPTIONS}
  value={country}
  onChange={setCountry}
  error={!country ? "Required" : ""}
  required
/>
```

**SSR**

```js
import { Select } from "@cloudstrytech/ui-components/ssr";
```

Same data-driven API as the client export; defers `@material/web` registration to the client, like every other SSR variant.

---

### Combobox

The search-as-you-type picker. `SearchField` is deliberately *not* an autocomplete (no popup, list, or
suggestion logic) and `Select` has no text entry, so "type to search, pick one or more, show the picks as
removable chips" previously had to be hand-rolled in every app. `Combobox` is that component.

Unlike `Select`, the popup is **not** `md-menu`: a menu owns focus, roving tabindex, and typeahead over its
items, which fights a nested text input. The listbox here is positioned with `@floating-ui/react` — the same
overlay foundation `Tooltip` uses — so focus stays in the field and the highlighted row travels via
`aria-activedescendant`. `useDismiss` also handles outside-click through `composedPath()`, including the case
where selecting an item re-renders the list while the click is still bubbling.

```jsx
import { Combobox } from "@cloudstrytech/ui-components";

// Single select
<Combobox label="Country" options={countries} value={value} onChange={setValue} />

// Multi-select with chips + create-new
<Combobox
    label="Elements"
    options={elements}
    value={picked}           // string[] when `multiple`
    onChange={setPicked}     // emits string[]
    onCreate={(query) => addElement(query)}
    multiple
    creatable
    clearable
/>

// External / async option source
<Combobox options={results} onSearchChange={setQuery} loading={isFetching} />
```

| Prop | Type | Description |
|---|---|---|
| `options` | `{label, value, disabled?}[]` | Option list |
| `value` | `string \| string[]` | Controlled selection; array when `multiple` |
| `onChange` | `(value) => void` | Value-first; emits an array when `multiple` |
| `multiple` | `boolean` | Pick several; renders selections as removable chips |
| `clearable` | `boolean` | Trailing reset control |
| `creatable` | `boolean` | Show an "Add …" row when the query matches nothing |
| `onCreate` | `(query: string) => void` | Called when the create row is chosen |
| `createLabel` | `(query) => string` | Label for the create row |
| `filterFn` | `(option, query) => boolean` | Custom filter (default: case-insensitive label match) |
| `onSearchChange` | `(query: string) => void` | Observe the typed query — use for server-side sources |
| `loading` | `boolean` | Show a loading row instead of "no results" |

Keyboard: `↓`/`↑` move the highlight (opening the popup if shut), `Enter` commits, `Esc` closes, `Tab` closes,
and `Backspace` on an empty query removes the last chip in `multiple` mode.

> **Accessibility caveat (shared with `Select`).** Material Web's text field sets `role="presentation"` on its
> own host via `ElementInternals`, because the real control is an `<input>` inside its shadow root. The
> `role="combobox"` this component sets therefore does not reach the accessibility tree, and it cannot simply
> be moved to the inner input either — `aria-controls`/`aria-activedescendant` are IDREFs and cannot cross a
> shadow boundary to reach the popup. Keyboard operation is fully correct, but a screen reader announces this
> as a text field rather than a combobox. Closing that gap means replacing the Material text-field shell with
> a native `<input>`, which is an open design decision for the library.

### Tag

A read-only, non-interactive coloured **label** — the third distinct member of the "small coloured element"
family, and the one that used to be missing:

| | Purpose | Interactive? |
|---|---|---|
| `Badge` | A dot or count overlaid on the **corner** of another element | No (`aria-hidden`) |
| Chips | Filter / assist / suggestion / input controls | **Yes** |
| `Tag` | A standalone coloured **label**: "Ongoing", "Completed", "Draft" | No |

`Tag` is plain CSS over a `<span>` — no Material Web element and no client boundary, so it renders in a Server
Component unchanged (like `Divider`).

```jsx
import { Tag } from "@cloudstrytech/ui-components";

<Tag variant="success">Completed</Tag>
<Tag variant="warning" dot>Ongoing</Tag>
<Tag variant="neutral" size="sm" icon="checkIcon">Verified</Tag>
```

`variant`: `neutral` (default) · `brand` · `info` · `success` · `warning` · `error`. `size`: `sm` · `md`.
`dot` adds a leading status dot in the label colour.

Colour is never the only carrier of meaning — the label states the status in words. Pass `aria-label` when the
visible text is an abbreviation.

### Enter-to-submit and `Button` type

A `Button` follows native `<button>` semantics: **inside a `<form>` it defaults to `type="submit"`, outside one
to `type="button"`.** Form membership is detected on mount; an explicit `type` prop always wins and is the
escape hatch for non-submitting controls inside a form.

```jsx
<form onSubmit={handleSubmit}>
    <Input label="Mobile number" value={mobile} onChange={setMobile} />
    <Button type="button" variant="text" onClick={cancel}>Cancel</Button>
    <Button>Send OTP</Button>   {/* submits — no onClick needed */}
</form>
```

`Input` also submits its form on Enter, the way a native `<input>` does. That needs real code rather than
coming for free: the field is an `<input>` inside the Material Web element's *shadow* root, so it is not one of
the form's own controls, and the submit `Button` is a form-associated custom element, which the browser's
implicit submission algorithm does not accept as a "default button" either. Between them, Enter previously did
nothing.

- `onEnter(value, event)` — fires on Enter (parity with `OtpInput.onEnter` / `SearchField.onSearch`). Composes
  with a consumer `onKeyDown` rather than replacing it. Never fires on a multiline field.
- `submitOnEnter={false}` — opt out of implicit submission. Calling `preventDefault()` from
  `onEnter`/`onKeyDown` suppresses it for a single keystroke (this is how `Combobox` uses Enter to commit a
  highlighted option without submitting the form).

### Select — multi-select and clearing

```jsx
<Select label="Roles" options={roles} value={selected} onChange={setSelected} multiple />
<Select label="Role"  options={roles} value={role} onChange={setRole} clearable onClear={reset} />
```

`multiple` switches `value`/`onChange` to arrays, keeps the popup open while picking, joins the selected labels
in the trigger, and adds `aria-multiselectable` to the listbox. `clearable` adds a trailing reset control,
mirroring `SearchField`'s — it replaces the `hasFilters` boolean plus separate "Reset" `Button` that filtered
list screens tend to hand-roll. Clearing a `multiple` Select emits `[]`, not `""`.

### Table — expandable rows and action cells

```jsx
<Table
    columns={columns}
    data={rows}
    rowKey="id"
    renderExpandedRow={(row) => <SubmissionPhotos id={row.id} />}
    expandable={(row) => row.hasPhotos}    // optional per-row gate
/>
```

Supplying `renderExpandedRow` enables an expander column; the detail row spans the full table width. Open rows
are tracked internally unless you pass `expandedKeys` + `onExpandedChange` to own them.

Mark a column `interactive: true` (or `type: "actions"`) when its cells contain their own controls — a
`Switch`, `IconButton`s, a link. `Table` then stops click and Enter/Space propagation for that cell, so it no
longer fires `onRowClick`. This replaces the `<div onClick={(e) => e.stopPropagation()}>` wrapper that
otherwise gets copy-pasted at every such call site.

```jsx
{ key: "_actions", label: "", interactive: true, render: (row) => <IconButton … /> }
```

### Dialog — width

`size` now takes a scale as well as the original two values: `basic` (default, 560px) · `sm` 400 · `md` 560 ·
`lg` 720 · `xl` 960 · `full-screen`. Because the modifier sets `--cst-dialog-width` **on the instance**, two
dialogs on the same screen can be different widths — previously the only lever was the global token, which
resized every dialog in the app. `width` takes an arbitrary value for one-offs:

```jsx
<Dialog open={open} size="lg" …>…</Dialog>
<Dialog open={open} width="70vw" …>…</Dialog>
```

The ≤599px mobile clamp still caps every size at the viewport width.

### Card — background

A card's fill is painted **inside the element's shadow DOM**, so a light-DOM `background-color` — whether from
`style` or a `className` rule — silently does nothing. Use the `background` prop (alias `bg`):

```jsx
<Card background="#e8f4ff">…</Card>            // works, any variant
<Card style={{ "--cst-card-bg": "#e8f4ff" }}>  // equivalent; still wins over the prop
<Card style={{ backgroundColor: "#e8f4ff" }}>  // ✗ no effect
```

### Menu as a general anchored popover

`Menu` is not restricted to `MenuItem` lists. It accepts arbitrary `children`, an `anchorRef`, controlled
`open`, and `onOpen`/`onClose` — it is a generic anchored popover, and it is what `Select` is built on. Reach
for it instead of hand-rolling `position: absolute` plus a `document.addEventListener("click", …)` dismiss
handler:

```jsx
const triggerRef = useRef(null);

<button ref={triggerRef} onClick={() => setOpen((o) => !o)}>Ananya Sharma ▾</button>

<Menu anchorRef={triggerRef} open={open} onClose={() => setOpen(false)}>
    <div className="profile-card">
        <strong>Ananya Sharma</strong>
        <button onClick={signOut}>Sign out</button>
    </div>
</Menu>
```

**Caveat:** `md-menu` owns focus and typeahead over its children, so this suits *non-focusable* content — text,
avatars, summaries, a short stack of buttons. For a popover containing a **text input** (a search box, a filter
field), use `Combobox`, which is built on `@floating-ui/react` precisely so the input keeps focus.

---

## Theming

All components expose a `--cst-*` CSS custom property contract. These tokens are mapped internally to `--md-*` Material 3 tokens — consumers never need to touch `--md-*` directly.

### Scoping levels

**Global (entire app):**
```css
:root {
  --cst-button-bg: #6200ee;
  --cst-button-radius: 4px;
  --cst-input-focus: #6200ee;
}
```

**Scoped to a section:**
```css
.admin-panel {
  --cst-button-bg: #1e3a5f;
}
```

**Per-instance via `style` prop:**
```jsx
<Button
  style={{ "--cst-button-bg": "#6200ee", "--cst-button-radius": "4px" }}
>
  Custom
</Button>
```

### Common tokens by component

#### Button
| Token | Default | Controls |
|---|---|---|
| `--cst-button-bg` | `#00b7e9` | Filled background; accent color for all other variants |
| `--cst-button-text` | `#ffffff` | Label color on filled variant |
| `--cst-button-tonal-bg` | `#cdeffb` | Tonal container color |
| `--cst-button-tonal-text` | `#00404f` | Tonal label color |
| `--cst-button-outlined-border` | `var(--cst-button-bg)` | Outlined variant border color |
| `--cst-button-radius` | `9999px` | Border radius (M3 pill default) |
| `--cst-button-height` | `40px` | Container height (md size) |
| `--cst-button-font-size` | `0.875rem` | Label font size (md size) |
| `--cst-button-line-height` | `20px` | Label line height (md size). **Set per size tier** — Material Web derives the button's own vertical padding from `max(line-height, icon-size)`, so overriding font-size without this makes the rendered height stop matching `--cst-button-height` |
| `--cst-button-icon-size` | `18px` | Icon size (md size) |

#### Input
| Token | Default | Controls |
|---|---|---|
| `--cst-input-width` | `100%` | Field width |
| `--cst-input-radius` | varies | Container border radius |
| `--cst-input-focus` | `#00b7e9` | Focus ring / active indicator color |

#### Card
| Token | Default | Controls |
|---|---|---|
| `--cst-card-bg` | *unset* | Container fill for whichever variant is active. The only hook that reaches the fill — a light-DOM `background-color` cannot, because the fill is painted inside the element's shadow DOM. Usually set through the `background` prop rather than directly |
| `--cst-card-width` | `100%` | Card width |
| `--cst-card-radius` | varies | Border radius |
| `--cst-card-focus-ring-color` | `#00b7e9` | Focus outline color |
| `--cst-card-media-aspect-ratio` | `16 / 9` | Media slot aspect ratio |
| `--cst-card-horizontal-media-width` | `200px` | Media width in horizontal layout |

#### Dialog
| Token | Default | Controls |
|---|---|---|
| `--cst-dialog-width` | `560px` | Dialog max-width. The `size` prop (`sm`/`md`/`lg`/`xl`) sets this **on the instance**, so prefer `size` or `width` over a global override |
| `--cst-dialog-max-width` | `var(--cst-dialog-width)` | Hard cap; takes precedence over `--cst-dialog-width` |

#### Snackbar
| Token | Default | Controls |
|---|---|---|
| `--cst-snackbar-bg` | `#1e293b` | Background color |
| `--cst-snackbar-text` | `#f1f5f9` | Message text color |
| `--cst-snackbar-radius` | `4px` | Border radius |
| `--cst-snackbar-min-width` | `320px` | Minimum width |

#### Tag
| Token | Default | Controls |
|---|---|---|
| `--cst-tag-bg` | per variant | Background fill |
| `--cst-tag-color` | per variant | Label + dot colour |
| `--cst-tag-border` | `transparent` | Border colour (set it for an outlined tag) |
| `--cst-tag-radius` | `9999px` | Corner radius |
| `--cst-tag-height` | `24px` | Min height (`sm`: 20px) |

#### Combobox
| Token | Default | Controls |
|---|---|---|
| `--cst-combobox-bg` | `#ffffff` | Popup background |
| `--cst-combobox-shape` | `8px` | Popup corner radius |
| `--cst-combobox-option-height` | `40px` | Option row min height |
| `--cst-combobox-option-active-bg` | `rgba(0,183,233,.10)` | Highlighted/hovered option |
| `--cst-combobox-check-color` | `#00b7e9` | Multi-select check mark |
| `--cst-combobox-z-index` | `1300` | Popup stacking order |

The field itself is themed by the shared `--cst-input-*` contract.

#### Responsive foundation tokens
The library ships `--cst-space-*` (4px–64px scale), `--cst-page-pad-x/y`, `--cst-container-max` (`1200px`), `--cst-container-narrow` (`640px`), and breakpoint-responsive variants that update automatically at 600px, 905px, and 1440px viewports. These are available globally once `styles.css` is imported.

---

## SSR

Every component ships an SSR-safe variant exported from `@cloudstrytech/ui-components/ssr`. These variants do not register custom elements (which require `window`/`HTMLElement`) at import time, making them safe to render on the server.

### Named exports from `/ssr`

The SSR entry exports the same component names as the client entry:

```js
import {
  Button,
  Input,
  PasswordField,
  SearchField,
  Select,
  Combobox,
  OtpInput,
  Footer,
  Table,
  Card,
  Badge,
  Checkbox,
  CheckboxGroup,
  AssistChip,
  FilterChip,
  InputChip,
  SuggestionChip,
  ChipSet,
  Dialog,
  Divider,
  FAB,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuItem,
  CircularProgress,
  LinearProgress,
  Radio,
  RadioGroup,
  Slider,
  Snackbar,
  SnackbarProvider,
  Switch,
  Tabs,
  Tab,
  TabPanel,
  Tag,
  Tooltip,
} from "@cloudstrytech/ui-components/ssr";
```

> **Note:** `useSnackbar` is not available from the SSR entry because it is a React hook (client-only). Import it from the main entry in a `"use client"` component.

### Next.js App Router pattern

```jsx
// app/layout.js — Server Component
import { Footer } from "@cloudstrytech/ui-components/ssr";
import "@cloudstrytech/ui-components/styles.css";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Footer variant="simple" legal="© 2025 CloudStry" />
      </body>
    </html>
  );
}
```

```jsx
// app/components/submit-button.jsx — Client Component
"use client";
import { Button } from "@cloudstrytech/ui-components";
import { useState } from "react";

export default function SubmitButton() {
  const [loading, setLoading] = useState(false);
  return (
    <Button loading={loading} onClick={() => setLoading(true)}>
      Submit
    </Button>
  );
}
```

---

## Import Patterns

### Default (full library)

```js
import { Button, Input, Dialog } from "@cloudstrytech/ui-components";
```

### Per-component subpath imports

Each component is also available via a dedicated subpath for more explicit imports:

```js
import { default as Button }          from "@cloudstrytech/ui-components/button";
import { default as Input }           from "@cloudstrytech/ui-components/input";
import { PasswordField }              from "@cloudstrytech/ui-components/passwordField";
import { SearchField }                from "@cloudstrytech/ui-components/searchField";
import { default as Select }          from "@cloudstrytech/ui-components/select";
import { default as OtpInput }        from "@cloudstrytech/ui-components/otp";
import { default as Footer }          from "@cloudstrytech/ui-components/footer";
import { default as Table }           from "@cloudstrytech/ui-components/table";
import { Card, CardHeader }           from "@cloudstrytech/ui-components/card";
import { Badge }                      from "@cloudstrytech/ui-components/badge";
import { Checkbox, CheckboxGroup }    from "@cloudstrytech/ui-components/checkbox";
import { AssistChip, FilterChip,
         InputChip, SuggestionChip,
         ChipSet }                    from "@cloudstrytech/ui-components/chips";
import { Dialog }                     from "@cloudstrytech/ui-components/dialog";
import { Divider }                    from "@cloudstrytech/ui-components/divider";
import { FAB }                        from "@cloudstrytech/ui-components/fab";
import { IconButton }                 from "@cloudstrytech/ui-components/iconbutton";
import { List, ListItem }             from "@cloudstrytech/ui-components/list";
import { Menu, MenuItem }             from "@cloudstrytech/ui-components/menu";
import { CircularProgress,
         LinearProgress }             from "@cloudstrytech/ui-components/progress";
import { Radio, RadioGroup }          from "@cloudstrytech/ui-components/radio";
import { Slider }                     from "@cloudstrytech/ui-components/slider";
import { Snackbar, SnackbarProvider,
         useSnackbar }                from "@cloudstrytech/ui-components/snackbar";
import { Switch }                     from "@cloudstrytech/ui-components/switch";
import { Tabs, Tab, TabPanel }        from "@cloudstrytech/ui-components/tabs";
import { Tooltip }                    from "@cloudstrytech/ui-components/tooltip";
```

### SSR entry

```js
import { Button, Input } from "@cloudstrytech/ui-components/ssr";
```

### Styles

```js
import "@cloudstrytech/ui-components/styles.css";
```

---

## Project Structure

```
cloudstry-ui-components/
├── src/
│   ├── index.js              # Main client entry — exports all components
│   ├── ssr.js                # SSR entry — exports SSR-safe variants
│   ├── styles/
│   │   └── responsive.css    # Breakpoint tokens + layout utility classes
│   └── components/
│       ├── badge/            # Badge, BadgeWrapper
│       ├── buttons/          # Button (5 variants, xs–xl sizes)
│       ├── card/             # Card, CardHeader
│       ├── checkbox/         # Checkbox, CheckboxGroup
│       ├── chips/            # AssistChip, FilterChip, InputChip, SuggestionChip, ChipSet
│       ├── combobox/         # Combobox (search-as-you-type picker)
│       ├── dialog/           # Dialog
│       ├── divider/          # Divider
│       ├── fab/              # FAB
│       ├── footer/           # Footer
│       ├── iconbutton/       # IconButton
│       ├── input/            # Input / TextField
│       ├── list/             # List, ListItem
│       ├── menu/             # Menu, MenuItem
│       ├── otp/              # OtpInput
│       ├── passwordField/    # PasswordField
│       ├── progress/         # CircularProgress, LinearProgress
│       ├── radio/            # Radio, RadioGroup
│       ├── searchField/      # SearchField
│       ├── select/           # Select
│       ├── slider/           # Slider
│       ├── snackbar/         # Snackbar, SnackbarProvider, useSnackbar
│       ├── switch/           # Switch
│       ├── table/            # Table
│       ├── tabs/             # Tabs, Tab, TabPanel
│       ├── tag/              # Tag (read-only status label)
│       └── tooltip/          # Tooltip
├── scripts/
│   └── flatten-types.js      # Post-build: flattens dist/types layout
├── dist/                     # Build output (not committed)
│   ├── esm/                  # ES module build
│   ├── cjs/                  # CommonJS build
│   └── types/                # TypeScript declarations
├── rollup.config.mjs
├── tsconfig.json
└── package.json
```

Each component folder follows a three-layer pattern:

| File | Purpose |
|---|---|
| `X.base.jsx` | Presentational layer; imports CSS; no element registration |
| `X.jsx` | Client layer; registers MWC custom elements (`"use client"`) |
| `XSSR.jsx` | SSR layer; renders `<XBase>` without element registration |
| `X.css` | Component styles and `--cst-*` token contract |
| `index.js` | Barrel: re-exports client and SSR variants |

---

## Building

```bash
# Full build (clean + rollup + type declarations)
npm run build

# Type declarations only
npm run build:types
```

The build produces dual ESM + CJS output under `dist/` with `preserveModules: true` for maximum tree-shaking. CSS is extracted to a single `dist/esm/styles.css`.

---

## License

MIT
