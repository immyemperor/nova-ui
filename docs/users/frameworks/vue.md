# Vue 3

Vue wrappers are generated from the same component manifest as the other frameworks. They're thin: props go in, events come out as Vue emits.

## Install

```bash
pnpm add @nova-ui/core @nova-ui/css @nova-ui/vue
```

## Setup

```ts
// src/main.ts
import { createApp } from 'vue';
import '@nova-ui/css/nova.css';
import { defineCustomElements } from '@nova-ui/core/loader';
import App from './App.vue';

defineCustomElements();
createApp(App).mount('#app');
```

## Use components

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { UiButton, UiInput, UiSelect } from '@nova-ui/vue';

const owner = ref('');
const owners = [{ value: 'ada', label: 'Ada Lovelace' }, { value: 'grace', label: 'Grace Hopper' }];
</script>

<template>
  <UiInput label="Email" name="email" type="email" required />
  <UiSelect label="Owner" :options="owners" searchable @ui-change="(e) => (owner = e.detail)" />
  <UiButton>Save</UiButton>
</template>
```

- Props use Vue's camelCase names: `:options="owners"`, `:page-size` and `pageSize` both work.
- Events are listened to with `@ui-change` (Vue maps it to the emitted `uiChange`).
- Slots work as normal Vue slots.

## Forms

Use `:value` with `@ui-change` to keep a control in sync with your state. Plain `v-model` isn't wired for these components yet, so don't rely on it.

## Generated wrappers

The wrappers live in `packages/vue/src/components.ts` and are regenerated with `pnpm docs`. Don't edit that file; change the component source and regenerate.

## Gotchas

- **Components not registered**: call `defineCustomElements()` once before mounting.
- **Object props**: they're passed as properties, so a plain array works.
- **Status**: the generated wrappers parse and cover all components, but they have not been run against Vue in CI yet. Report any issue you hit.
