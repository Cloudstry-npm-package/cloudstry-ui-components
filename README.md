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
npm install @cloudstrytech/ui-components
```

### Peer dependencies

Install the following peer dependencies alongside the library:

```bash
npm install @material/web @floating-ui/react react react-dom
```

| Peer dependency | Required version |
|---|---|
| `@material/web` | `>=1.0.0 <3.0.0` |
| `@floating-ui/react` | `>=0.26.0` |
| `react` | `>=18 <21` |
| `react-dom` | `>=18 <21` |

### Styles

Import the compiled stylesheet once at your application root:

```js
import "@cloudstrytech/ui-components/styles.css";
```

### Material Symbols font (icon components)

`IconButton` and any component that renders `<md-icon>` require the Material Symbols Outlined font. Add it to your HTML:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
  rel="stylesheet"
/>
```

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
| Button | `Button` | All 5 M3 variants: `filled`, `tonal`, `elevated`, `outlined`, `text`; sizes `xs`–`xl`; `loading` state; link button via `href` |
| FAB | `FAB` | Floating Action Button; `md`/`lg` sizes; `branded` variant; optional `position` prop for fixed placement |
| IconButton | `IconButton` | 4 MWC variants: `standard`, `filled`, `tonal`, `outlined`; toggle mode |

### Text Inputs

| Component | Export(s) | Description |
|---|---|---|
| Input / TextField | `Input` | Outlined and filled variants; controlled + uncontrolled; error state; icons; prefix/suffix; multiline/textarea; character counter |
| PasswordField | `PasswordField` | Input composition with show/hide toggle |
| SearchField | `SearchField` | Input composition with search semantics |
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
| Card | `Card`, `CardHeader` | 3 MWC Labs variants: `elevated`, `filled`, `outlined`; `header`/`media`/`body`/`actions` slot layout; `loading` skeleton; `horizontal` layout; interactive (`onClick`/`href`) |
| Dialog | `Dialog` | Controlled; 3-slot API (`headline`/`children`/`actions`); `size="basic"\|"full-screen"`; `closeOnBackdrop` |
| List | `List`, `ListItem` | MWC list with `start`/`end` icon slots; `dense` mode; `data-disabled` link support |
| Divider | `Divider` | Pure CSS `<hr>`; horizontal/vertical; inset variants; SSR-safe (no `"use client"`) |

### Communication

| Component | Export(s) | Description |
|---|---|---|
| Progress | `CircularProgress`, `LinearProgress` | MWC progress elements; `value` 0–100; `fourColor` mode |
| Snackbar | `Snackbar`, `SnackbarProvider`, `useSnackbar` | Fully custom; FIFO queue; persistent ARIA live regions; hover/focus pause; `type` variants; `position` |
| Tooltip | `Tooltip` | Fully custom with `@floating-ui/react`; `cloneElement` trigger pattern; portal rendering; `aria-describedby` wired automatically |
| Badge | `Badge` | MWC Labs badge; `BadgeWrapper` pattern for relative positioning; `value`/`max`/`variant` |

### Navigation

| Component | Export(s) | Description |
|---|---|---|
| Tabs | `Tabs`, `Tab`, `TabPanel` | MWC `md-tabs`; `primary`/`secondary` variants; icon support; composition API |
| Menu | `Menu`, `MenuItem` | MWC menu; `anchorRef`-based positioning; controlled + imperative `open`; `keepOpen` per item |

### Layout / Utility

| Component | Export(s) | Description |
|---|---|---|
| Footer | `Footer` | Slot-based (`brand`/`links`/`social`/`legal`/`children`); `simple`/`centered`/`split` variants; SSR-safe |
| Table | `Table` | Custom data table; sortable columns; single/multi row selection; search; pagination; density modes; sticky header; zebra striping; bulk actions toolbar |

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

#### Input
| Token | Default | Controls |
|---|---|---|
| `--cst-input-width` | `100%` | Field width |
| `--cst-input-radius` | varies | Container border radius |
| `--cst-input-focus` | `#00b7e9` | Focus ring / active indicator color |

#### Card
| Token | Default | Controls |
|---|---|---|
| `--cst-card-width` | `100%` | Card width |
| `--cst-card-radius` | varies | Border radius |
| `--cst-card-focus-ring-color` | `#00b7e9` | Focus outline color |
| `--cst-card-media-aspect-ratio` | `16 / 9` | Media slot aspect ratio |
| `--cst-card-horizontal-media-width` | `200px` | Media width in horizontal layout |

#### Dialog
| Token | Default | Controls |
|---|---|---|
| `--cst-dialog-width` | `560px` | Dialog max-width |

#### Snackbar
| Token | Default | Controls |
|---|---|---|
| `--cst-snackbar-bg` | `#1e293b` | Background color |
| `--cst-snackbar-text` | `#f1f5f9` | Message text color |
| `--cst-snackbar-radius` | `4px` | Border radius |
| `--cst-snackbar-min-width` | `320px` | Minimum width |

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
│       ├── slider/           # Slider
│       ├── snackbar/         # Snackbar, SnackbarProvider, useSnackbar
│       ├── switch/           # Switch
│       ├── table/            # Table
│       ├── tabs/             # Tabs, Tab, TabPanel
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
