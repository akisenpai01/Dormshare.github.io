# DormShare Cross-Platform App

Expo + React Native client for Android, iOS, and web, designed from the attached DormShare marketplace screens and wired to the existing Spring Boot backend contract.

## Run locally

```bash
npm install
npm run start
```

Optional environment variable:

```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
```

Use `npm run android`, `npm run ios`, or `npm run web` for platform targets.

## What is included

- Cross-platform auth flow with session persistence
- Explore marketplace with search, category chips, and featured cards
- Item details screen with borrow request action
- Lending dashboard with portfolio insights and owned listings
- Activity feed driven by transaction history
- Handoff verification screen with QR generation
- Backend-aware service layer with offline/demo fallbacks for smoother development

## Deployment notes

- For Android and iOS builds, configure Expo EAS or native run targets.
- For web, set `EXPO_PUBLIC_API_BASE_URL` to the deployed backend and publish the Expo web bundle.
- The backend still needs its production environment variables set before public deployment.
