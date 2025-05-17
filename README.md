# Stack Overflow Clone

A modern Stack Overflow clone built with Astro v5 and Tailwind CSS, providing a responsive and feature-rich Q&A platform.

## Features

- Responsive design that works on mobile, tablet, and desktop
- Dark mode support with automatic system preference detection
- User authentication with GitHub OAuth
- Question listing with search and filtering
- Question detail pages with answers and comments
- Voting system with reputation points
- Bookmarking functionality
- Real-time notifications
- Real-time updates for new questions and answers
- Advanced search with multiple filters
- Keyboard shortcuts for power users

## Technology Stack

- **Framework**: Astro v5 with Server-Side Rendering (SSR)
- **Styling**: Tailwind CSS v3
- **Authentication**: Auth.js via auth-astro integration
- **Deployment**: Netlify with SSR adapter

## Authentication Architecture

This project uses [Auth.js](https://authjs.dev/) via the [auth-astro](https://github.com/nowaythatworked/auth-astro) integration to handle authentication.

### Key Components

1. **`auth.config.ts`**: Contains the authentication configuration, including providers (GitHub OAuth) and session settings.

2. **`src/auth.ts`**: Exports helper functions for authentication, including `signIn` and `signOut` URL generators.

3. **API Endpoints**: Authentication endpoints are automatically created at `/api/auth/[...auth]` by the auth-astro integration.

4. **Session Management**: Sessions are retrieved using the `getSession()` function from `auth-astro/server`.

### Authentication Flow

1. User clicks "Login" which redirects to `/api/auth/signin` with the provider parameter
2. After authenticating with the provider (GitHub), the user is redirected back to the callback URL
3. Auth.js creates a session and sets cookies
4. The user is redirected to the homepage or original destination

### Usage in Components

To access the current user session in a component or page:

```astro
---
import { getSession } from 'auth-astro/server';

// Get the current session
const session = await getSession(Astro.request);
const user = session?.user;
---

{user ? (
  <p>Welcome, {user.name}!</p>
) : (
  <p>Please log in</p>
)}
```

### Protected Routes

To create protected routes that require authentication:

```astro
---
import { getSession } from 'auth-astro/server';

// Get the current session
const session = await getSession(Astro.request);

// Redirect if not logged in
if (!session) {
  return Astro.redirect('/users/login?redirect=' + Astro.url.pathname);
}
---
```

### Environment Variables

Authentication requires the following environment variables:

- `AUTH_SECRET`: A secret key used to encrypt cookies (generate with `openssl rand -hex 32`)
- `AUTH_TRUST_HOST`: Set to `true` for proper handling of cookies in production
- `GITHUB_CLIENT_ID`: OAuth Client ID from GitHub Developer settings
- `GITHUB_CLIENT_SECRET`: OAuth Client Secret from GitHub Developer settings

## Real-Time Updates Architecture

This project implements real-time updates using Server-Sent Events (SSE), allowing users to see new questions and answers without refreshing the page.

### Key Components

1. **`/api/sse` Endpoint**: A long-lived connection that sends events to the client when new content is available.

2. **Client Connections**: JavaScript on the client side connects to the SSE endpoint and listens for events.

3. **Event Broadcasting**: When a new question or answer is created, the server broadcasts an event to all connected clients.

4. **UI Updates**: The client-side code updates the UI in real-time when new content is available, with visual indicators.

### Usage in Components

New questions appear in the questions list with a notification:
```html
<!-- Real-time status indicator -->
<div id="realtime-status" class="fixed bottom-4 right-4 bg-[#f8f9f9] dark:bg-[#2d2d2d] border border-[#d6d9dc] dark:border-[#3d3d3d] rounded-lg shadow-md p-2 text-sm z-50">
  <div class="flex items-center">
    <span class="h-2 w-2 rounded-full bg-green-500 mr-2 pulse-animation"></span>
    <span>Real-time updates active</span>
  </div>
  <div id="new-content-alert" class="mt-1 text-[#0074cc] dark:text-[#6cbbf7] cursor-pointer">
    New questions available. Click to view.
  </div>
</div>
```

### Implementation Flow

1. User posts a new question or answer through the form
2. API endpoint processes the submission and saves it
3. Server broadcasts the new content to all connected clients via SSE
4. Client-side JavaScript receives the event and updates the UI
5. Users see a notification and can click to view the new content
6. New content is highlighted temporarily for visibility

## Project Structure

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── AuthButton.astro  # Login/logout button component
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── ...
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── questions/
│   │   │   ├── index.astro   # Questions list page
│   │   │   ├── [id].astro    # Question detail page
│   │   │   └── ask.astro     # Ask question page
│   │   ├── api/
│   │   │   ├── auth/         # Auth.js API endpoints
│   │   │   ├── notifications/ # Notification endpoints
│   │   │   ├── vote/         # Voting endpoints
│   │   │   ├── sse/          # Server-sent events endpoints
│   │   │   ├── questions/    # Question CRUD endpoints
│   │   │   ├── answers/      # Answer CRUD endpoints
│   │   │   └── ...
│   │   └── ...
│   ├── scripts/
│   │   └── keyboard-shortcuts.js
│   ├── styles/
│   │   └── global.css
│   └── auth.ts               # Auth helpers
├── auth.config.ts            # Auth.js configuration
├── astro.config.mjs          # Astro configuration
└── package.json
```

## Getting Started

1. Clone the repository
2. Create a `.env` file based on `.env.example`
3. Install dependencies: `bun install`
4. Start the development server: `bun run dev`

## Commands

| Command           | Action                                           |
| :---------------- | :----------------------------------------------- |
| `bun install`     | Installs dependencies                            |
| `bun run dev`     | Starts local dev server at `localhost:4321`      |
| `bun run build`   | Build your production site to `./dist/`          |
| `bun run preview` | Preview your build locally, before deploying     |
