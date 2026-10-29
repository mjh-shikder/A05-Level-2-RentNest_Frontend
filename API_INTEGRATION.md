# API integration map

This document maps backend HTTP requests that the frontend currently makes. Requests use the server-side `BACKEND_URL` environment variable. Authenticated requests send the saved access token in the `Authorization` header; public property reads do not send a token. The frontend calls the backend from Server Components, Server Actions, and shared server-side data helpers rather than directly from browser components.

| Frontend surface | Backend request | Authentication and behavior |
| --- | --- | --- |
| `components/auth/LoginForm.tsx` via `app/(authGroup)/_authActions/authActions.ts` | `POST /api/auth/login` | Public. Submits email and password; on success stores the access token and basic user profile in HTTP-only cookies, then redirects to `/`. |
| `components/auth/RegisterForm.tsx` via `app/(authGroup)/_authActions/authActions.ts` | `POST /api/auth/register` | Public. Registers a tenant or landlord; on success redirects to `/login`. |
| `components/home/FeatureProperties.tsx`, `app/properties/page.tsx`, via `lib/properties.ts` | `GET /api/all/properties` (and `?page=N` when pagination metadata reports more pages) | Public. Loads and normalizes listings for the home page and properties browser. The home page displays up to three available listings. |
| `app/properties/[id]/page.tsx` via `lib/properties.ts`; `app/dashboard/actions.ts` when validating a property before admin deletion | `GET /api/properties/:id` | Public. Loads property details, landlord information, and reviews; the admin delete action also checks the property's current status before deletion. |
| `app/dashboard/tenant/page.tsx` via `lib/dashboard-data.ts` | `GET /api/rental/tenants-requests` | Tenant access required. Loads the signed-in tenant's rental requests. |
| `app/dashboard/tenant/page.tsx` via `lib/dashboard-data.ts` | `GET /api/payment/history` | Authenticated. Loads payment history for the signed-in user. |
| `components/properties/RequestRentalForm.tsx` via `app/dashboard/actions.ts` | `POST /api/rental/create-request` | Tenant access required. Submits property ID, start date, and optional end date and message. |
| `app/dashboard/actions.ts` (`createCheckoutAction`) | `POST /api/payment/create` | Tenant access required. Creates a checkout session for a rental request and redirects to the returned `checkoutUrl` only when it is a valid HTTPS Stripe Checkout URL. |
| `app/dashboard/tenant/page.tsx` review form via `app/dashboard/actions.ts` | `POST /api/review/create` | Tenant access required. Submits a rating and optional comment for a property and completed rental request. |
| `app/dashboard/landlord/page.tsx` via `lib/dashboard-data.ts` | `GET /api/landlord/properties` | Landlord access required. Loads the signed-in landlord's listings. |
| `app/dashboard/landlord/page.tsx` via `lib/dashboard-data.ts` | `GET /api/rental/landlord/requests` | Landlord access required. Loads rental requests for the landlord to review. |
| `app/dashboard/landlord/page.tsx` via `lib/dashboard-data.ts` | `GET /api/category/all` | The API reference lists this endpoint as public. The current dashboard fetches it through the authenticated dashboard helper, so this frontend request sends the user's access token. |
| `components/dashboard/ProfileForm.tsx` via `app/dashboard/actions.ts` | `PATCH /api/user/update` | Authenticated. Updates the signed-in user's name, optional phone number, and avatar. |
| `components/dashboard/PropertyForm.tsx` via `app/dashboard/actions.ts` | `POST /api/landlord/properties` | Landlord access required. Creates a property listing. |
| `components/dashboard/PropertyForm.tsx` via `app/dashboard/actions.ts` | `PUT /api/landlord/properties/:id` | Landlord access required. Updates an existing property listing. |
| `app/dashboard/landlord/page.tsx` via `app/dashboard/actions.ts` | `DELETE /api/landlord/properties/:id` | Landlord access required. Deletes a landlord listing. |
| `app/dashboard/landlord/page.tsx` via `app/dashboard/actions.ts` | `PATCH /api/rental/landlord/requests/:id` | Landlord access required. Approves or rejects a tenant request. |
| `app/dashboard/actions.ts` (`getAuthenticatedUserId`) | `GET /api/auth/me` | Authenticated. Used as a fallback to resolve the current user's ID when it is not available in the saved profile before creating or updating a listing. |
| `app/dashboard/admin/page.tsx` via `lib/dashboard-data.ts` | `GET /api/admin/all-users` | Admin access required. Loads users for the admin dashboard. The UI provides search and pagination over the data returned to it. |
| `app/dashboard/admin/page.tsx` via `lib/dashboard-data.ts` | `GET /api/admin/all-properties` | Admin access required. Loads properties for admin review. |
| `app/dashboard/admin/page.tsx` via `lib/dashboard-data.ts` | `GET /api/admin/all-rentals` | Admin access required. Loads rental records for admin review. |
| `app/dashboard/admin/page.tsx` via `app/dashboard/actions.ts` | `PATCH /api/admin/users/:id` | Admin access required. Changes a user's status to active or blocked. |
| `app/dashboard/admin/page.tsx` via `app/dashboard/actions.ts` | `DELETE /api/landlord/properties/:id` | Admin access required. Deletes an available property after checking its details through the public `GET /api/properties/:id` endpoint. |

## Requests not made by the frontend

`POST /api/payment/confirm` is a Stripe webhook handled by the backend. The browser and frontend do not call it; Stripe sends the confirmation to the backend. The payment success page is a return page and does not itself verify or confirm payment.

The frontend does not currently call every endpoint listed in the product requirements or API reference. This map intentionally lists only requests found in the current implementation.

## Response and error handling

- Property reads validate the response envelope and listing/detail shapes in `lib/properties.ts`; connection, HTTP, and unexpected-data failures are surfaced to the relevant page.
- Dashboard reads in `lib/dashboard-data.ts` expect a `data` value containing either an array of records or a single record. Array entries are validated. An unexpected non-array primitive currently produces an empty record list without an error, so not every malformed response shape is surfaced.
- Dashboard mutations generally parse backend messages and show a success or error notice. Rental-request creation currently displays a generic active-request error for any unsuccessful response, rather than preserving the backend's specific failure message.
- Auth forms display registration and login errors. Registration redirects to `/login` only after a successful backend response.
- API documentation and sample responses are reference material; response envelopes and collection shapes can vary. The implementation should be checked against the live backend contract when it changes.
