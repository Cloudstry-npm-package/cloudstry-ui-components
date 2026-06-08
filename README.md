# @cloudstrytech/ui-components

A collection of reusable UI components built on [Material Web (M3)](https://github.com/material-components/material-web) for React and Next.js (App Router). All components are tree-shakeable and TypeScript-ready.

---

## Installation

```bash
npm install @cloudstrytech/ui-components @material/web
```

Import the shared stylesheet once in your root layout or entry file:

```js
import "@cloudstrytech/ui-components/styles.css";
```

---

## Components

### Button

Material 3 backed button with five variants and Cloudstry token theming.

```jsx
import { Button } from "@cloudstrytech/ui-components";
// or subpath:
import Button from "@cloudstrytech/ui-components/button";
```

```jsx
<Button
  variant="filled"          // filled | tonal | elevated | outlined | text  (default: filled)
  size="md"                 // sm | md | lg                                  (default: md)
  startIcon={<AddIcon />}   // ReactNode — leading icon
  endIcon={<ArrowIcon />}   // ReactNode — trailing icon
  loading={isSaving}        // boolean — inline spinner, blocks interaction
  fullWidth                 // boolean — width: 100%
  disabled={false}
  type="button"             // button | submit | reset                       (default: button)
  onClick={handleClick}
  className="my-class"
  style={{ "--cst-button-bg": "#16a34a" }}
  ref={buttonRef}
>
  Save Changes
</Button>
```

**Variants**

| `variant` | M3 element | Use for |
|-----------|-----------|---------|
| `filled` (default) | `md-filled-button` | Primary action |
| `tonal` | `md-filled-tonal-button` | Secondary action |
| `elevated` | `md-elevated-button` | Separated surface |
| `outlined` | `md-outlined-button` | Medium-emphasis |
| `text` | `md-text-button` | Lowest-emphasis |

**Backward compatibility:** `label` prop still works (rendered when `children` is absent). Legacy `icon` string prop renders as a leading `<md-icon>`.

**Notable semantics:**
- `type` defaults to `"button"` — submit buttons must explicitly pass `type="submit"`.
- `onClick` is guarded: no-op while `loading` or `disabled`.
- `...rest` is forwarded to the host element (`aria-*`, `data-*`, `id`, etc.).

**CSS tokens** — override globally (`:root`), scoped to a `className`, or per-instance via `style`:

| Token | Default | Controls |
|-------|---------|----------|
| `--cst-button-bg` | `#00b7e9` | Brand primary (filled container; label/accent on other variants) |
| `--cst-button-text` | `#ffffff` | Filled label color |
| `--cst-button-tonal-bg` | `#cdeffb` | Tonal container |
| `--cst-button-tonal-text` | `#00404f` | Tonal label |
| `--cst-button-radius` | `9999px` | Corner radius (pill by default) |
| `--cst-button-height` | `40px` (size-scaled) | Container height |
| `--cst-button-font-size` | `0.875rem` (size-scaled) | Label size |
| `--cst-button-font-weight` | `500` | Label weight |
| `--cst-button-icon-size` | `18px` (size-scaled) | Icon and spinner size |
| `--cst-button-gap` | `8px` (size-scaled) | Icon ↔ label spacing |

---

### Input (TextField)

Material 3 text field with floating label, validation, icons, prefix/suffix, and controlled/uncontrolled support.

```jsx
import { Input } from "@cloudstrytech/ui-components";
// or subpath:
import Input from "@cloudstrytech/ui-components/input";
```

```jsx
<Input
  label="Email address"
  variant="outlined"            // outlined | filled  (default: outlined)
  floatingLabel                 // boolean — M3 floating label (default: external top label)
  value={email}
  defaultValue=""               // uncontrolled initial value
  onChange={(value) => setEmail(value)}   // value-first: (string) => void
  placeholder="you@example.com"
  type="email"                  // text | email | password | search | tel | url | number | textarea
  multiline                     // boolean — sugar for type="textarea"
  rows={4}
  error="Invalid email"         // string | boolean — activates error state
  errorText="Please try again"  // message when error is boolean
  supportingText="We'll never share your email"
  required
  disabled
  readOnly
  startIcon={<MailIcon />}      // ReactNode → leading icon slot
  endIcon={<CheckIcon />}       // ReactNode → trailing icon slot
  prefix="$"
  suffix=".00"
  maxLength={100}               // native character counter
  name="email"
  autoComplete="email"
  className="my-wrapper"        // outer wrapper (layout/width)
  fieldClassName="my-field"     // field host element (advanced)
  style={{ "--cst-input-focus": "#7c3aed" }}
  ref={inputRef}                // → focus() / select() / reportValidity()
  onBlur={handleBlur}
  aria-describedby="hint"
/>
```

**CSS tokens**

| Token | Default | Drives |
|-------|---------|--------|
| `--cst-input-focus` | `#00b7e9` | Focus outline, caret, focused label |
| `--cst-input-error` | `#d32f2f` | All error-state colors |
| `--cst-input-label-color` | `#171717` | External label color |
| `--cst-input-icon-color` | `#5f6368` | Slot icons and family action buttons |
| `--cst-input-radius` | `4px` | Field corner radius |
| `--cst-input-filled-bg` | `#f3f3f3` | Filled variant background |
| `--cst-input-gap` | `6px` | Gap between external label and field |
| `--cst-input-width` | `100%` | Wrapper width |

---

### PasswordField

Composes over `Input`. Adds an accessible visibility toggle button. Inherits the full `Input` API.

```jsx
import { PasswordField } from "@cloudstrytech/ui-components";
// or subpath:
import PasswordField from "@cloudstrytech/ui-components/passwordField";
```

```jsx
<PasswordField
  label="Password"
  value={password}
  onChange={(value) => setPassword(value)}
  visibilityToggle              // boolean — show/hide toggle button  (default: true)
  defaultVisible={false}        // initial visibility state
  onVisibilityChange={(visible) => console.log(visible)}
  error="Password is required"
  required
  /* All other Input props pass through (variant, supportingText, ref, etc.) */
/>
```

- `type` is owned internally (`password` ↔ `text`); callers cannot override it.
- `endIcon` is only used when `visibilityToggle={false}`.
- The toggle is accessible: `type="button"`, `aria-pressed`, `aria-label="Show/Hide password"`.

---

### SearchField

Composes over `Input`. Adds a search glyph, clear button, optional debounce, and Enter-to-search. Inherits the full `Input` API.

```jsx
import { SearchField } from "@cloudstrytech/ui-components";
// or subpath:
import SearchField from "@cloudstrytech/ui-components/searchField";
```

```jsx
<SearchField
  label="Search"
  value={query}
  onChange={(value) => setQuery(value)}
  onSearch={(value) => fetchResults(value)}   // fires on Enter; also per-keystroke when debounce set
  debounce={300}                              // ms — enables debounced per-keystroke search
  clearable                                   // boolean — trailing × when non-empty  (default: true)
  startIcon={<CustomSearchIcon />}            // overrides default search glyph
  /* All other Input props pass through */
/>
```

- `type` is fixed to `"search"`.
- Without `debounce`, `onSearch` fires on Enter only.
- Auto-applies `aria-label="Search"` when no `label` or `aria-*` is supplied.
- Clear button has `aria-label="Clear search"`.

---

### OtpInput

Logic-rich OTP input with countdown timer and resend support. Built on native `<input>` elements.

```jsx
import { OtpInput } from "@cloudstrytech/ui-components";
// or subpath:
import OtpInput from "@cloudstrytech/ui-components/otp";
```

```jsx
<OtpInput
  length={6}                          // number of digit inputs  (default: 6)
  initialSeconds={59}                 // countdown start in seconds  (default: 59)
  value={otp}                         // controlled value (string of digits)
  onChange={(value) => setOtp(value)} // (string) => void
  onResend={() => requestNewCode()}
  onEnter={(value) => verifyOtp(value)}
  description="Didn't get the code?"
  resendLabel="Click to resend"
  timerPrefix="Resend in"
  className="my-otp"
  inputClassName="my-otp-input"
/>
```

**Behavior:**
- Each box accepts one digit (numeric only).
- Paste support: digits distribute from the focused position.
- Backspace on an empty box moves focus to the previous box.
- Enter fires `onEnter` with the current value string.
- Countdown disables resend until it reaches zero, then re-enables it.
- Resend clears all inputs, resets the timer, and calls `onResend`.

---

### Table

Data table with CSS token theming, column rendering, sorting, row selection, toolbar, and bulk actions.

```jsx
import { Table } from "@cloudstrytech/ui-components";
// or subpath:
import Table from "@cloudstrytech/ui-components/table";
```

**Basic usage**

```jsx
const columns = [
  { key: "name",   label: "Name",   width: 200 },
  { key: "status", label: "Status", align: "center",
    render: (row) => <StatusBadge status={row.status} /> },
  { key: "actions", label: "",
    render: (row) => <Button size="sm" onClick={() => edit(row)}>Edit</Button> },
];

<Table
  title="Issuers"
  columns={columns}
  data={rows}
  rowKey="id"
/>
```

**Table props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | — | Table heading (`<h2>`) |
| `columns` | `ColumnDef[]` | `[]` | Column definitions |
| `data` | `any[]` | `[]` | Row data |
| `rowKey` | `string` | — | Field used as stable row key (required for selection) |
| `loading` | `boolean` | `false` | CSS-only spinner; sets `aria-busy` |
| `emptyMessage` | `string` | `"No records found"` | Empty state text |
| `emptyNode` | `ReactNode` | — | Custom empty state (overrides `emptyMessage`) |
| `onRowClick` | `(row) => void` | — | Row click handler; adds keyboard support (Enter/Space) |
| `density` | `"compact" \| "comfortable" \| "spacious"` | `"comfortable"` | Row height variant |
| `stickyHeader` | `boolean` | `false` | Fixes header while body scrolls |
| `zebra` | `boolean` | `false` | Alternating row backgrounds |
| `ariaLabel` | `string` | — | `aria-label` on `<table>` |
| `ariaLabelledby` | `string` | — | `aria-labelledby` on `<table>` |
| `sortBy` | `{ key: string, direction: "asc" \| "desc" } \| null` | — | Controlled sort state |
| `onSortChange` | `(sort) => void` | — | Called when a sortable column is clicked |
| `selectionMode` | `"none" \| "single" \| "multi"` | `"none"` | Row selection mode |
| `selectedKeys` | `Set<string>` | — | Controlled selection state |
| `onSelectionChange` | `(keys: Set<string>) => void` | — | Called when selection changes |
| `toolbar` | `ReactNode` | — | Slot above the table (below title) |
| `bulkActions` | `ReactNode` | — | Replaces toolbar when rows are selected |
| `className` | `string` | — | Wrapper class |
| `titleClassName` | `string` | — | Title `<h2>` class |
| `tableClassName` | `string` | — | `<table>` class |
| `headerClassName` | `string` | — | `<thead>` class |
| `bodyClassName` | `string` | — | `<tbody>` class |
| `rowClassName` | `string \| (row, index) => string` | — | `<tr>` class |
| `emptyClassName` | `string` | — | Empty state cell class |
| `toolbarClassName` | `string` | — | Toolbar wrapper class |

**ColumnDef**

| Property | Type | Description |
|----------|------|-------------|
| `key` | `string` | Data field name |
| `label` | `string` | Header text |
| `width` | `string \| number` | Column width |
| `align` | `"left" \| "center" \| "right"` | Cell alignment |
| `render` | `(row, index) => ReactNode` | Custom cell renderer |
| `headerRender` | `() => ReactNode` | Custom header cell content |
| `sortable` | `boolean` | Enables sort button on the header |

**Sorting example**

```jsx
const [sortBy, setSortBy] = useState(null);

const sorted = sortBy
  ? [...rows].sort((a, b) => {
      const cmp = String(a[sortBy.key]).localeCompare(String(b[sortBy.key]));
      return sortBy.direction === "asc" ? cmp : -cmp;
    })
  : rows;

<Table
  columns={[{ key: "name", label: "Name", sortable: true }, ...]}
  data={sorted}
  sortBy={sortBy}
  onSortChange={setSortBy}
/>
```

**Selection example**

```jsx
const [selected, setSelected] = useState(new Set());

<Table
  columns={columns}
  data={rows}
  rowKey="id"
  selectionMode="multi"
  selectedKeys={selected}
  onSelectionChange={setSelected}
  bulkActions={
    <Button onClick={() => deleteSelected(selected)}>Delete selected</Button>
  }
/>
```

**CSS tokens**

| Token | Default | Controls |
|-------|---------|----------|
| `--cst-table-header-bg` | `#49d3ee` | Header background |
| `--cst-table-header-color` | `#ffffff` | Header text |
| `--cst-table-title-color` | `#00b7e9` | Title `<h2>` color |
| `--cst-table-border-color` | `#dcdcdc` | Cell borders |
| `--cst-table-row-hover-bg` | `#f3fcff` | Row hover |
| `--cst-table-row-selected-bg` | `#e8f7fb` | Selected row background |
| `--cst-table-zebra-bg` | `#f7fdff` | Zebra even-row background |
| `--cst-table-spinner-color` | `#49d3ee` | Loading spinner |
| `--cst-table-min-width` | `700px` | Table minimum width |
| `--cst-table-sticky-max-height` | — | Container height when `stickyHeader` |
| `--cst-table-checkbox-accent` | — | Checkbox tick color |
| `--cst-table-toolbar-bg` | — | Toolbar background |

---

### Footer

Minimal footer bar.

```jsx
import { Footer } from "@cloudstrytech/ui-components";
// or subpath:
import Footer from "@cloudstrytech/ui-components/footer";
```

```jsx
<Footer
  text="© Cloudstry Tech. All rights reserved."
  className="my-footer"
/>
```

---

## SSR / Next.js App Router

**Client components** (`Input`, `PasswordField`, `SearchField`, `Button`) include a `"use client"` directive in their bundle — Next.js Server Components can import them directly without wrapping.

**SSR variants** defer `@material/web` custom-element registration to `useEffect` (browser-only). Use them in environments where full SSR is required:

```jsx
import { ButtonSSR, InputSSR, PasswordFieldSSR, SearchFieldSSR } from "@cloudstrytech/ui-components/ssr";
```

**`dynamic` import** is an alternative for any component:

```jsx
import dynamic from "next/dynamic";

const Button = dynamic(
  () => import("@cloudstrytech/ui-components/button").then((m) => m.Button),
  { ssr: false }
);
```

---

## Import paths

| Import | Exports |
|--------|---------|
| `@cloudstrytech/ui-components` | All components (barrel) |
| `@cloudstrytech/ui-components/button` | `Button` |
| `@cloudstrytech/ui-components/input` | `Input` |
| `@cloudstrytech/ui-components/passwordField` | `PasswordField` |
| `@cloudstrytech/ui-components/searchField` | `SearchField` |
| `@cloudstrytech/ui-components/otp` | `OtpInput` |
| `@cloudstrytech/ui-components/footer` | `Footer` |
| `@cloudstrytech/ui-components/table` | `Table` |
| `@cloudstrytech/ui-components/ssr` | `ButtonSSR`, `InputSSR`, `PasswordFieldSSR`, `SearchFieldSSR` |
| `@cloudstrytech/ui-components/styles.css` | Global stylesheet |

---

## TypeScript

Type definitions are generated automatically and load when the package is installed:

```
dist/types/index.d.ts
dist/types/button.d.ts
dist/types/input.d.ts
dist/types/passwordField.d.ts
dist/types/searchField.d.ts
dist/types/otp.d.ts
dist/types/footer.d.ts
dist/types/table.d.ts
dist/types/ssr.d.ts
```

---

## Peer dependencies

```json
{
  "@material/web": ">=1.0.0 <3.0.0",
  "react": ">=18 <21",
  "react-dom": ">=18 <21"
}
```

---

## License

MIT License — Cloudstry Tech
