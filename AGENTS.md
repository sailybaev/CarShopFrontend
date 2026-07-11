<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This project uses Next.js 16.2.1 with React 19. APIs and conventions can differ from the stable docs you were trained on. Read the local guide in `node_modules/next/dist/docs/` before writing or fixing code, especially anything related to routing, data fetching, or the React Compiler. Heed deprecation notices in the installed docs.
<!-- END:nextjs-agent-rules -->

## Project snapshot

- Next.js 16.2.1 + React 19 + App Router. `next.config.ts` enables the React Compiler (`reactCompiler: true`) and restricts images to `images.unsplash.com`.
- Tailwind CSS v4 with CSS-based configuration in `app/globals.css`. There is no `tailwind.config.js`.
- shadcn/ui registry style is `radix-lyra`; icon library is `phosphor` (`@phosphor-icons/react`). UI primitives live in `components/ui/`.
- Single-package repo, not a monorepo. Path alias `@/*` maps to the repo root (`./`).
- Both `bun.lock` and `package-lock.json` are present; prefer one and avoid letting them drift.

## Developer commands

| Command | What it does | Caveat |
|---|---|---|
| `npm run dev` | Starts the dev server on `localhost:3000` |  |
| `npm run build` | Production build + type checks via Next.js | No separate `typecheck` script exists; use this for TS validation or run `npx tsc --noEmit` manually. |
| `npm run lint` | ESLint via `eslint.config.mjs` (flat config) | Uses `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`. |
| `npm test` | Runs Vitest in **watch** mode | Script name is misleading: default `vitest` is watch. |
| `npm run test:watch` | Runs Vitest **once** | Script name is misleading: `vitest run` executes a single run. Use this for CI/verification. |
| `npm run test:coverage` | Runs tests once with v8 coverage | Coverage covers `components/`, `lib/`, and `store/`; excludes `components/ui/`. |

## Backend and external services

- The backend API is expected at `http://localhost:5107` (hardcoded in `lib/api.ts` and `store/authStore.ts`).
- Real-time chat uses SignalR (`@microsoft/signalr`) on `/hub/chat` at the same backend URL. JWT is passed via the `access_token` query string because WebSockets cannot send HTTP headers.
- The contact form submits to a hardcoded Google Apps Script Web App URL in `lib/api.ts`. See `lib/CHATTASK.md` for chat architecture notes.

## Testing notes

- Stack: Vitest + `@vitejs/plugin-react` + jsdom + `@testing-library/react` + `@testing-library/jest-dom`.
- `vitest.setup.ts` mocks `window.matchMedia`, `ResizeObserver`, and `IntersectionObserver`, and clears `localStorage` before each test. Many tests rely on this clear.
- Zustand stores (`store/authStore.ts`, `store/cartStore.ts`, `store/chatStore.ts`) use `localStorage` persistence, so the test clear is required to avoid cross-test state.
- Tests live in `__tests__/` and are currently grouped under `__tests__/components/`, `__tests__/lib/`, and `__tests__/stores/`.

## Design conventions

- Visual system is documented in `Design.md`: Tesla-inspired, monochrome palette, sharp corners (`rounded-none`), `motion` (Framer Motion) for scroll animations. Check it before adding new UI.

## Common pitfalls

- The `test` / `test:watch` script names are swapped from the usual convention. Use `npm run test:watch` for a single CI-style run and `npm test` for local watch mode.
- There is no dedicated `typecheck` script. If you need to run TypeScript in isolation, use `npx tsc --noEmit`.
- No Prettier, Husky, or lint-staged config is present; don't assume formatting is auto-enforced beyond ESLint.
- `app/layout.tsx` wraps the app in `ThemeProvider`, `ThemeWrapper`, `ChatConnect`, and `QueryProvider`. Client-side state providers and SignalR are set up there.
