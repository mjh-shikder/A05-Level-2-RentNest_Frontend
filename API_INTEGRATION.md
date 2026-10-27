# API integration map

All backend requests use `BACKEND_URL`. Authenticated dashboard requests send the login token as a Bearer token; public property and category reads do not require authentication. API errors are shown in the relevant form or dashboard section.

| Frontend surface | Backend endpoint | Purpose |
| --- | --- | --- |
| `app/(authGroup)/_authComponents/LoginForm.tsx` | `POST /api/auth/login` | Sign in and store the access token and basic profile in HTTP-only cookies. |
| `app/(authGroup)/_authComponents/RegisterForm.tsx` | `POST /api/auth/register` | Register a tenant or landlord account. |
| `app/properties/page.tsx` | `GET /api/all/properties` | Load public property listings. |
| `app/properties/[id]/page.tsx` | `GET /api/properties/:id` | Load a property's details, owner, and reviews. |
| `app/dashboard/tenant/page.tsx` | `GET /api/rental/tenants-requests` | Show a tenant's rental request history. |
| `app/dashboard/tenant/page.tsx` | `GET /api/payment/history` | Show tenant payment history and totals. |
| `app/dashboard/actions.ts` | `POST /api/payment/create` | Create a Stripe Checkout session for an approved rental request and redirect to its validated checkout URL. |
| `app/dashboard/actions.ts` | `POST /api/review/create` | Submit a review for a completed rental. |
| `app/dashboard/landlord/page.tsx` | `GET /api/landlord/properties` | Load the landlord's listings. |
| `app/dashboard/landlord/page.tsx` | `GET /api/category/all` | Populate the property category selector. |
| `app/dashboard/actions.ts` | `POST /api/landlord/properties` | Create a property listing. |
| `app/dashboard/actions.ts` | `PUT /api/landlord/properties/:id` | Update a property listing. |
| `app/dashboard/actions.ts` | `DELETE /api/landlord/properties/:id` | Delete a property listing. |
| `app/dashboard/landlord/page.tsx` | `GET /api/rental/landlord/requests` | Show tenant requests for the landlord's properties. |
| `app/dashboard/actions.ts` | `PATCH /api/rental/landlord/requests/:id` | Approve or reject a rental request. |
| `app/dashboard/admin/page.tsx` | `GET /api/admin/all-users` | Populate searchable, paginated user management. |
| `app/dashboard/admin/page.tsx` | `GET /api/admin/all-properties` | Review platform property listings. |
| `app/dashboard/admin/page.tsx` | `GET /api/admin/all-rentals` | Review platform rental activity. |
| `app/dashboard/actions.ts` | `PATCH /api/admin/users/:id` | Block or restore a user account. |

`POST /api/payment/confirm` is a Stripe webhook handled by the backend; the frontend must not call it directly. The API examples have inconsistent response envelopes and list shapes, so dashboard consumers validate responses and account for list endpoints that return either an array or a single record.
