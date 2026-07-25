# Petspace - Frontend

Petspace is a social network idea I've been building where you make a profile for your pet instead of yourself. Breed, weird little "interests" (favorite treats, guilty habits, crimes), a family tree of parent/child pets, friends, a post feed, real-time chat.

Backend lives here: [petspace-backend](https://github.com/k1nada/petspace-backend)

## What's in it

- Multi-step signup with avatar upload
- Profile page: info, interests, photo gallery
- Friends and follows (they're separate, you can follow without being friends)
- Family tree
- Post feed with likes, comments, reposts
- Real-time chat over Socket.IO
- English and Polish translations

## Stack

Next.js 16 (App Router), React 19, TypeScript, Zustand, Axios, React Hook Form, next-intl, Sass, Socket.IO-client

## Structure

```
src/app/[locale]/     routed pages
src/app/features/     feature modules (auth, profile, friends, family, messages, photos)
src/app/uikit/        shared UI components (form, navigation, overlays, feedback)
src/app/hooks/        shared hooks and Zustand stores
src/app/providers/    context providers
src/services/         API/socket clients
src/i18n/             localization setup
messages/             translation files (en, pl)
```

## Running it

```bash
npm install
npm run dev
```

Needs a `.env` with:

```
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
```

## Status

In development.
