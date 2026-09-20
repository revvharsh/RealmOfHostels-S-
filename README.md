# Realm of Hostels

> A polished student residence platform for managing hostel life, room operations, and campus services from one place.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-realmofhostels.vercel.app-8C5828?style=flat-square)](https://realmofhostels.vercel.app)
[![Built with React](https://img.shields.io/badge/Built%20with-React%2019-149ECA?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)

## Overview

Realm of Hostels is a frontend-first campus residence experience with dedicated workflows for students and hostel administrators. It brings room information, notices, payments, dining, maintenance, laundry, transport, and resident support into a single responsive interface.

The application is designed as a realistic product prototype: fast to run locally, easy to deploy, and structured so real APIs and authentication can be introduced without redesigning the core user experience.

**Live application:** [realmofhostels.vercel.app](https://realmofhostels.vercel.app)

## Features

### Student portal

- Personal residence dashboard with room, bed, academic, and emergency-contact details
- Roommate profiles and room inventory for Room B-004
- Notices, calendar reminders, and residence updates
- Mess schedule and weekly dining information
- Fee history, payment records, and receipt generation
- Maintenance tickets with status, technician updates, and resident confirmation
- Laundry ordering, order history, and downloadable receipts
- Daily room-cleaning checklist with resident activity tracking
- Warden directory, transport information, and emergency support access
- Light and dark themes with light mode as the default
- English and Hindi interface options

### Admin portal

- Hostel overview dashboard with occupancy and operational summaries
- Searchable room inventory and visual room matrix
- Resident and payment records
- Notice publishing and editing workflows
- Mess schedule management
- Shuttle and transport schedule management
- Maintenance ticket monitoring and resolution tools
- Shortlists, operational alerts, and quick-action modals

## Demo access

The live demo uses sample credentials:

| Portal | Username | Password |
| --- | --- | --- |
| Student | Any valid email address | `codersrealm` |
| Admin | `realmofhostels` | `codersrealm` |

These credentials are intentionally included for demonstration only. Replace the client-side demo authentication with a secure identity provider before using the project for real residents or administrative data.

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Motion for interface transitions
- Lucide React for icons
- jsPDF for downloadable receipts
- pnpm for package management

## Getting started

### Prerequisites

- Node.js 18 or newer
- pnpm 9 or newer

### Installation

```bash
git clone https://github.com/revvharsh/realmofhostels.git
cd realmofhostels
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production build

```bash
pnpm lint
pnpm build
pnpm preview
```

## Deployment

The production site is deployed on Vercel at [realmofhostels.vercel.app](https://realmofhostels.vercel.app).

To deploy your own instance:

1. Import the repository into Vercel.
2. Select the Vite framework preset.
3. Use `pnpm build` as the build command.
4. Use `dist` as the output directory.
5. Deploy.

No server-side environment variables are required for the current demo build. For a production deployment, add a secure backend, persistent database, proper authentication, and server-side validation before handling real user information.

## Project structure

```text
src/
├── components/          Reusable portal, view, and modal components
│   └── student/         Student-specific workflows and residence services
├── data.ts              Shared demo data for rooms, notices, tickets, and operations
├── types.ts             Shared TypeScript domain models
├── i18n/                Language context and translations
├── utils/               Export and document-generation helpers
├── App.tsx              Authentication and top-level portal routing
└── index.css            Global theme and Tailwind styles
```

## Available scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the Vite development server on port 3000 |
| `pnpm lint` | Run the TypeScript compiler without emitting files |
| `pnpm build` | Create an optimized production build |
| `pnpm preview` | Preview the production build locally |
| `pnpm clean` | Remove generated build output |

## Product direction

The current release focuses on a complete, responsive interface and realistic resident workflows. The next production milestones are API-backed data, role-based access control, persistent payments and tickets, audit logging, and automated end-to-end testing.

## License

This repository does not currently include a license. All rights are reserved unless otherwise stated by the repository owner.
