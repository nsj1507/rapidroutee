# 🚦 RapidRoute+

> **AI-powered emergency response & last-minute travel intelligence — built for India.**

RapidRoute+ helps people make fast, safe travel decisions when every minute counts.
It combines **real-time GPS**, **Google Maps**, and **Lovable AI** to suggest the
fastest multi-modal route, alert emergency contacts with one tap, and locate the
nearest hospitals, police stations, and transport hubs.

![RapidRoute+ Banner](docs/screenshots/banner.png)

---

## ✨ Features

- 🆘 **Emergency Mode** — one-tap SOS dial (112), nearby hospitals via Google
  Places, live GPS distance & ETA, and automatic SMS/WhatsApp alerts to saved
  contacts with a live map link.
- 🧠 **AI Route Intelligence** — given any origin/destination, an LLM ranks
  Train, Bus, Flight, and Car options with cost, duration, transfers, and
  booking platforms.
- 🗺️ **Multi-mode Directions** — Google Directions API with Driving, Walking,
  Transit, and Cycling overlays, plus "Use My Vehicle" → Google Maps handoff.
- 📍 **Smart Location Handling** — graceful permission flow, reverse geocoding,
  Haversine fallback when Distance Matrix is unavailable.
- 🔐 **Auth & Profiles** — email/password + Google sign-in via Supabase, with
  RLS-protected `profiles` and `emergency_contacts` tables.

---

## 🎯 Problem Statement

During emergencies and last-minute travel, users juggle multiple apps
(Maps, IRCTC, MakeMyTrip, ambulance dialers, contact lists) and waste
critical minutes. RapidRoute+ unifies these flows into a single, mobile-first
experience that works the moment the user lands on the screen — no manual
configuration required.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, TanStack Start v1, Vite 7 |
| Styling | Tailwind CSS v4, shadcn/ui, Framer Motion |
| Routing | TanStack Router (file-based) |
| Backend | Lovable Cloud (Supabase: Postgres + Auth + RLS) |
| AI | Lovable AI Gateway (Google Gemini 3 Flash) |
| Maps | Google Maps JavaScript API, Places, Directions, Distance Matrix |
| Deploy | Cloudflare Workers (via Wrangler) |

---

## 📸 Screenshots

| Home | Emergency Mode | Travel Intelligence |
|---|---|---|
| ![Home](docs/screenshots/home.png) | ![Emergency](docs/screenshots/emergency.png) | ![Travel](docs/screenshots/travel.png) |

> Replace these placeholders with real screenshots from your build at
> `docs/screenshots/`.

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) ≥ 1.1 (or Node.js ≥ 20 + npm)
- A Google Cloud project with **Maps JavaScript, Places, Directions, and
  Distance Matrix APIs** enabled
- A Lovable Cloud (Supabase) project — auto-provisioned if you fork via
  [Lovable](https://lovable.dev)

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/rapidroute-plus.git
cd rapidroute-plus
```

### 2. Install dependencies

```bash
bun install
# or: npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in the values in `.env` — see comments in `.env.example` for where to
find each one. **Never commit `.env`.**

### 4. Run locally

```bash
bun run dev
# Vite dev server starts on http://localhost:5173
```

### 5. Build for production

```bash
bun run build
bun run start   # preview the production build
```

---

## 🧭 Usage

1. **Sign up** with email or Google.
2. Add **emergency contacts** in Profile → Contacts.
3. Tap **Emergency** → allow location → see nearby hospitals + "Alert all
   contacts" to send an SMS with your live coordinates.
4. Tap **Travel** → type origin & destination → pick a travel mode and let the
   AI rank routes, or hit "Use My Vehicle" to launch Google Maps with the
   route preloaded.

---

## 📁 Project Structure

```text
rapidroute-plus/
├── public/                       # Static assets (logo, favicon)
├── src/
│   ├── assets/                   # Imported images (logo, illustrations)
│   ├── components/
│   │   ├── emergency/            # AlertContactsCard, etc.
│   │   ├── home/                 # Landing bento cards
│   │   ├── layout/               # AppHeader, BottomNav
│   │   ├── location/             # Permission banner
│   │   ├── travel/               # Map, Directions, mode selector
│   │   └── ui/                   # shadcn primitives
│   ├── hooks/                    # useAuth, useGPSLocation, useNearbyHospitals
│   ├── integrations/supabase/    # Auto-generated Supabase clients & types
│   ├── routes/                   # TanStack file-based routes
│   │   ├── __root.tsx            # Root layout (head, providers)
│   │   ├── index.tsx             # Landing page
│   │   ├── emergency.tsx         # Emergency mode
│   │   ├── travel.tsx            # AI travel planner
│   │   ├── login.tsx / signup.tsx
│   │   └── profile.tsx
│   ├── lib/                      # Helpers (utils, formatters)
│   ├── router.tsx                # Router bootstrap
│   └── styles.css                # Tailwind tokens & globals
├── supabase/
│   ├── config.toml               # Project + edge-function config
│   └── functions/
│       └── route-intelligence/   # AI route-ranking edge function
├── .env.example                  # Environment variable template
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🔒 Security Notes

- All API keys are loaded from environment variables — none are hardcoded.
- Supabase Row-Level Security is enabled on `profiles` and `emergency_contacts`.
- The `route-intelligence` edge function requires a valid JWT to prevent
  anonymous AI-credit abuse.
- Always **restrict your Google Maps API key by HTTP referrer** before going
  to production.

---

## 🌱 Future Enhancements

- 🚑 Real ambulance dispatch integration (108 partner APIs)
- 🗣️ Voice-activated SOS ("Hey RapidRoute, I need help")
- 🌐 Offline mode with cached hospital data
- 📲 Native push notifications for contact alerts
- 🌏 Multi-language support (Hindi, Tamil, Bengali, Marathi)
- 🤝 Crowd-sourced traffic & incident reports

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd
like to change. For pull requests:

1. Fork the repo & create a feature branch (`git checkout -b feat/amazing`)
2. Commit with conventional messages (`git commit -m "feat: add X"`)
3. Push and open a PR

---

## 👥 Contributors

| Name | Role | GitHub |
|---|---|---|
| _Your Name_ | Lead Developer | [@your-handle](https://github.com/your-handle) |
| _Teammate_ | UI/UX | [@teammate](https://github.com/teammate) |

_Add yourself by opening a PR!_

---

## 📄 License

Released under the [MIT License](LICENSE). Built with ❤️ on
[Lovable](https://lovable.dev).
