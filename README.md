# **@cloudstrytech/ui-components**

A collection of reusable UI components built on **Material Web (M3)** for React and Next.js (App Router).
All components are tree-shakeable, TypeScript-ready, and designed for modern client-side applications.

---

## **Installation**

Install the UI library:

```bash
npm install @cloudstrytech/ui-components
```

Install Material Web (peer dependency):

```bash
npm install @material/web
```

---

## **Usage**

### **Button**

```tsx
"use client";

import { Button } from "@cloudstrytech/ui-components/button";

export default function Demo() {
  return <Button label="Click Me" variant="filled" />;
}
```

### **Input**

```tsx
"use client";

import { Input } from "@cloudstrytech/ui-components/input";

export default function Example() {
  return <Input label="Email" type="email" />;
}
```

### **OTP Input**

```tsx
"use client";

import { OtpInput } from "@cloudstrytech/ui-components/otp";

export default function OTP() {
  return <OtpInput length={6} />;
}
```

### **Footer**

```tsx
"use client";

import { Footer } from "@cloudstrytech/ui-components/footer";

export default function AppFooter() {
  return <Footer text="© Cloudstry Tech" />;
}
```

---

## **Import Paths**

| Component   | Import Path                           |
| ----------- | ------------------------------------- |
| All exports | `@cloudstrytech/ui-components`        |
| Button      | `@cloudstrytech/ui-components/button` |
| Input       | `@cloudstrytech/ui-components/input`  |
| OTP         | `@cloudstrytech/ui-components/otp`    |
| Footer      | `@cloudstrytech/ui-components/footer` |
| SSR helpers | `@cloudstrytech/ui-components/ssr`    |

---

## **Next.js SSR Notice**

Material Web components run only in the browser.
To avoid `HTMLElement is not defined` errors, all UI components must be used inside **client components**.

Add this to the top of the file:

```tsx
"use client";
```

or import the component with SSR disabled:

```tsx
import dynamic from "next/dynamic";

const Button = dynamic(
  () => import("@cloudstrytech/ui-components/button").then((m) => m.Button),
  { ssr: false }
);
```

---

## **Styles**

A shared stylesheet is provided:

```ts
import "@cloudstrytech/ui-components/styles.css";
```

Paste this in main.jsx for react.js and for next.js paste it in src/app/layout.jsx

---

## **TypeScript**

Each component includes complete `.d.ts` typings.

Examples:

```
dist/types/button.d.ts
dist/types/input.d.ts
dist/types/otp.d.ts
dist/types/footer.d.ts
dist/types/ssr.d.ts
```

Type definitions load automatically when the package is installed.

---

## **SSR Utilities**

Some environments require custom element registration for SSR hydration.

```ts
import { registerSSRComponents } from "@cloudstrytech/ui-components/ssr";

registerSSRComponents();
```

Use only when needed.
For Next.js App Router, preferred usage is **client components only**.

---

## **License**

MIT License – Cloudstry Tech

---
