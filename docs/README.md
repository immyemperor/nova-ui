# Kvui UI documentation

Three audiences, one set of facts. Pick your reader below.

## I'm building an app (users)

Start with [Getting started](users/getting-started.md), then your framework under [Frameworks](users/frameworks/README.md). Each feature has a guide in [Feature guides](users/features/README.md). Look up exact names in the [component reference](../packages/core/dist-docs/API.md).

## I'm maintaining or contributing (humans)

- [Architecture](humans/architecture.md): packages, layers, generated files, design decisions
- [Contributing](humans/contributing.md): setup, making changes, adding a component, PR checklist
- [Testing](humans/testing.md): what each check proves and what it doesn't
- [Releasing](humans/releasing.md): changesets, versions, publishing
- [Project status](humans/status.md): what is built, verified, and still open

## I'm an AI agent

- [AGENTS.md](../AGENTS.md): the rules for working with and inside this repository
- [Agent conventions](agents/conventions.md): component choice table, framework imports, common mistakes
- [llms.txt](../llms.txt): the index, in the llms.txt format
- [llms-full.txt](llms-full.txt): all user and agent documentation in one file

## Regenerating

```bash
pnpm docs          # API reference, editor data, Vue wrappers
pnpm docs:agents   # llms-full.txt
pnpm docs:check    # every component documented, every link resolves
```
