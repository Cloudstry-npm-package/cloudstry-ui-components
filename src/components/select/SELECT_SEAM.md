# Select — DEFERRED (seam only, not implemented)

Select is **intentionally not built** in this session. Its *rendering* architecture
is still unresolved (the field family's one genuinely open decision), so building
it now would bake in an architecture we may have to undo.

This folder is a **reserved location + integration note**. There is no component,
no entry in `rollup.config.mjs`, no barrel export, and no `package.json` subpath —
adding any of those is the only work needed to ship Select once the decision below
is made.

## Why the shell is already Select-ready

Select needs exactly the contract the TextField shell (`Input`) already exposes —
so no shell changes are required to add it later:

- `label` + `floatingLabel` — visual parity with the other fields
- `error: string` + `supportingText` — one validation/help channel across the family
- `startIcon` / `endIcon` — the chevron lives in `endIcon` (same seam as the
  password toggle and the search clear button)
- `--cst-input-*` token contract — Select themes identically to TextField
- `forwardRef` + `name` — a form layer can focus/validate/coordinate it
- value-first `onChange(value)` — consistent selection API

When built, Select will be **composition over the shell** in the same shape as
PasswordField / SearchField: a `select.base.jsx` owning the menu/listbox delta,
plus `select.jsx` (`"use client"`) and `selectSSR.jsx` wiring the renderer.

## The open decision (must be resolved before implementation)

| Option | Approach | Trade-off |
|--------|----------|-----------|
| A | `@material/web/menu` composition (text-field-styled trigger + `md-menu` popup) | Most M3-accurate; reuses an MWC primitive; more wiring (positioning, keyboard, listbox a11y) |
| B | Custom listbox on the field shell | Full control, no extra dep; we own all a11y |
| C | Styled native `<select>` | Least effort; best mobile/a11y for free; limited M3 fidelity |

See `Documents/Input/input-modernization-plan.md` §10.3 and the implementation
summary (§"Deferred Select decision").
