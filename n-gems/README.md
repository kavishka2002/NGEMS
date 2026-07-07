# N-GEMS — National Government Electronic Medical System

Frontend-only UI for the first onboarding step of a national hospital registry
system: **Hospital Registration** and **Hospital Login**. Built with the
Next.js App Router and Tailwind CSS. No backend, database, auth logic, or
dashboard is included by design.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 — it links to `/register` and `/login`.

## Pages

- `/` — simple entry screen linking to the two flows
- `/register` — Hospital Registration (two-column layout with branding panel)
- `/login` — Hospital Login (centered card)

## Components (`/components`)

| Component         | Purpose                                              |
|--------------------|-------------------------------------------------------|
| `Logo`             | N-GEMS mark + wordmark, light/dark variants           |
| `Navbar`           | Top navigation shared across pages                    |
| `Button`           | Primary / secondary / ghost buttons with loading state|
| `Input`            | Text input with label, icon, hint, and error states    |
| `Select`           | Styled dropdown for hospital type, province, district |
| `PasswordInput`    | Password field with show/hide toggle                   |
| `FileUpload`       | Drag-and-drop hospital logo upload with preview        |
| `FormCard`         | Card shell used to wrap the registration form          |
| `InfoPanel`        | Left-side branding panel with illustration & stats      |
| `HospitalIdField`  | Read-only "registry stamp" display of the auto-ID       |
| `SuccessModal`     | Post-registration confirmation dialog                  |

## Design notes

- Palette: registry navy (`#0B2545`), clinical blue (`#146C94`), health green
  (`#1B998B`), and a restrained seal gold (`#B08D57`) for official/registry
  accents — tuned in `tailwind.config.ts`.
- Type: Fraunces (display), Inter (body/UI), IBM Plex Mono (registry IDs).
- All form validation is client-side and cosmetic only — there is no backend
  connected. Submitting the login form always shows a sample error state;
  submitting registration always shows the success modal.
