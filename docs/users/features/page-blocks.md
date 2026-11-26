# Page blocks

Blocks are ready-made page compositions built from Kvui components and layout classes. They're starting points: copy one into your app and change the content.

```tsx
import { LoginBlock, PricingBlock, SettingsBlock, DashboardBlock, OnboardingBlock } from '@kvui/react';
```

| Block | Use it for | Key props |
| --- | --- | --- |
| `LoginBlock` | Sign-in card with email, password and remember-me | `title`, `subtitle`, `onSubmit(email, password)`, `footer` |
| `PricingBlock` | Pricing tiers that stack on phones | `tiers: { name, price, period?, features, featured?, cta? }[]` |
| `SettingsBlock` | Settings with a section sidebar | `sections`, `active`, `children` |
| `DashboardBlock` | KPI cards, a trend chart and a table | `title`, `kpis`, `months`, `series`, `columns`, `rows`, `notice` |
| `OnboardingBlock` | Multi-step setup | `step`, `steps`, `children` |

Blocks are React-only for now. Angular and Vue users can build the same layouts from the components; the [playground](../../../apps/playground-vite/src/BlocksDemo.tsx) shows each block in use.
