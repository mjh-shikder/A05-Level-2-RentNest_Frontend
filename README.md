<div align="center">

# RentNest

### Find a place to call home.

An online rental platform connecting tenants and landlords, with tools to discover properties, manage rental requests, and track payments.

[Live App](https://rentnest.mjhshikder.com/) · [Backend API](https://a04-level-2.onrender.com) · [Project Walkthrough](https://drive.google.com/file/d/xxx/)

</div>

---

## About the project

RentNest is a full-stack rental marketplace. Visitors can explore the home page and browse rental listings. Registered users get tools tailored to their role: tenants can request rentals and manage payment activity, landlords can manage listings and respond to requests, and administrators can oversee users, properties, and rentals.

The frontend is built with Next.js App Router and communicates with the RentNest backend through server-side requests. Authentication tokens are stored in HTTP-only cookies, and protected operations are handled through Server Actions.

## Project links

| Resource | Link |
| --- | --- |
| Live application | [rentnest.mjhshikder.com](https://rentnest.mjhshikder.com/) |
| Backend API | [a04-level-2.onrender.com](https://a04-level-2.onrender.com) |
| Project explanation video | [Watch the Loom walkthrough](https://drive.google.com/file/d/xxx/) |
| API integration map | [API_INTEGRATION.md](./API_INTEGRATION.md) |

## Features

### Property discovery

- Home page with featured available listings.
- Property browser with keyword search and filters for category, availability, bedrooms, furnishing, and monthly rent.
- Sort listings by rent and browse results in pages.
- Property detail pages with listing details, landlord information, and reviews.
- Tenants can submit a rental request with dates and an optional message.

### Tenant accounts

- Review rental requests and their current statuses.
- Continue to Stripe Checkout after a landlord approves a request.
- View payment history and completed payment totals.
- Leave a review for an eligible completed rental.
- Update profile information.

### Landlord accounts

- Create, edit, and delete property listings.
- Review incoming rental requests and approve or reject them.
- See listing and request summaries in the landlord dashboard.
- Update profile information.

### Administrator accounts

- Browse and search user records, with client-side pagination.
- Activate or block user accounts.
- Review property listings and rental activity.
- Delete eligible available listings.
- Update profile information.

### Shared experience

- Responsive layouts with light, dark, and system theme support.
- Role-aware navigation and dashboards.
- Form feedback through toast messages and inline status notices.
- Dedicated payment return pages for checkout success and cancellation.

## Application routes

| Route | Description |
| --- | --- |
| `/` | Home page and featured listings |
| `/about` | Introduction to RentNest and its user roles |
| `/properties` | Search, filter, sort, and browse listings |
| `/properties/[id]` | Listing details and rental request form |
| `/login` | Sign in to an existing account |
| `/register` | Register as a tenant or landlord |
| `/dashboard/tenant` | Tenant requests, payment history, reviews, and profile |
| `/dashboard/landlord` | Landlord listings, rental requests, and profile |
| `/dashboard/admin` | User, property, and rental administration |
| `/payment/success` | Checkout return page for successful checkout |
| `/payment/cancel` | Checkout return page for cancelled checkout |

Dashboard routes require an authenticated account with the matching role. Property detail routes currently redirect unauthenticated visitors to sign in.

## Technology

- **Framework:** Next.js 16 App Router with React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI:** Radix UI primitives, custom components, and Lucide icons
- **Theme:** `next-themes`
- **Notifications:** Sonner
- **Authentication:** Backend-issued access token stored in an HTTP-only cookie
- **Payments:** Stripe Checkout session created by the backend
- **Package manager:** pnpm

## Getting started

### Requirements

- Node.js compatible with the installed Next.js version
- pnpm (the project declares pnpm 12)
- Access to the RentNest backend, locally or at the hosted API URL

### Install dependencies

```bash
pnpm install
```

### Configure the backend URL

Create a local environment file from the example:

```bash
cp .env.example .env.local
```

Set `BACKEND_URL` to the backend origin. For the hosted API, use:

```env
BACKEND_URL=https://a04-level-2.onrender.com
```

`BACKEND_URL` is read only by server-side code. Do not prefix it with `NEXT_PUBLIC_` or commit secrets and local environment files.

### Run locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
pnpm build
pnpm start
```

### Lint

```bash
pnpm lint
```

## Backend integration

The frontend uses the configured `BACKEND_URL` for backend requests. Public listing reads and authenticated dashboard operations are made by Server Components, shared server-side helpers, or Server Actions. Authenticated requests include the saved access token in the `Authorization: Bearer ...` header.

The frontend integrates with backend endpoints for:

- Authentication and registration
- Property listings, details, and categories
- Tenant rental requests, payment history, and reviews
- Landlord property management and request decisions
- Administrator user, property, and rental management
- Stripe Checkout session creation

The detailed endpoint and behavior map is maintained in [`API_INTEGRATION.md`](./API_INTEGRATION.md). Stripe payment confirmation is handled by a backend webhook; the frontend's success page is a return screen and does not itself verify payment.

## Project structure

```text
app/
  (authGroup)/       Login, registration, and authentication actions
  about/             About page
  dashboard/         Role-based dashboards and Server Actions
  payment/           Checkout success and cancellation pages
  properties/        Listing browser and property detail route
components/
  auth/              Login and registration forms
  dashboard/         Dashboard tables, forms, and controls
  home/              Home page sections
  payment/           Payment return UI
  properties/        Listing cards, filters, and request form
  shared/            Navigation, footer, and theme components
  ui/                Shared interface primitives
lib/                 Property data, dashboard auth/data, and utilities
public/              Logos, backgrounds, and static assets
```

## Notes

- Successful login stores the backend access token and basic profile data in HTTP-only cookies. The cookies are configured as secure in production and use a one-day lifetime.
- The `proxy.ts` request handler redirects unauthenticated requests to protected routes to `/login`; dashboard pages also enforce the user's role on the server.
- Rental checkout is offered only after landlord approval. The backend/Stripe webhook is responsible for confirming payment and updating its status.
- Some backend endpoints and expected response shapes are documented in `API_INTEGRATION.md`; consult that file when changing API behavior.

## License

No license is currently specified in this repository. Contact the project owner before reusing or redistributing the code.
