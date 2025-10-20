# Q Edu Admin Frontend

React + Vite single-page application that provides dashboards for super administrators, academy owners, teachers, and students. It integrates with the NestJS backend (`../Q_Edu_backend`) via REST APIs and supports OTP-based email verification, Zoom credit management, user approval workflows, and platform settings management.

---

## 1. Prerequisites

- **Node.js**: v18 or newer
- **npm**: v9+
- **Backend**: Q Edu backend running locally (default `http://localhost:3000/api`)

---

## 2. Environment configuration

Copy `.env.example` (if present) or edit `.env`:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

If the backend runs on a different host or port, update the value accordingly. The OTP verification flow expects outbound email from the backend, so ensure SMTP settings are configured there.

---

## 3. Installation & development

```bash
cd SaaS
npm install

# start Vite dev server on http://localhost:5173
npm run dev
```

The app will proxy API calls directly to the backend using `VITE_API_BASE_URL`.

---

## 4. Production build

```bash
npm run build
```
Output will be placed in `dist/`. You can preview the build with:
```bash
npm run preview
```

---

## 5. Key features

- **Role-based dashboards** for super admin, academy owner, teacher, and student personas
- **OTP email verification flow** (`/verify-email`) that pairs with backend `/auth/register`, `/auth/verify-otp`, and `/auth/resend-otp`
- **Super admin tools**: academy management, user approvals (approve/reject with reason), platform settings, and payments/reports
- **Responsive navigation** with contextual links for authenticated roles
- **API client with automatic token refresh** via the backend authentication endpoints

---

## 6. Useful scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production bundle |
| `npm run preview` | Preview production build |
| `npm run lint` *(if configured)* | Lints source files |

---

## 7. Troubleshooting

| Problem | Fix |
| ------- | ---- |
| API calls fail with CORS | Ensure backend `CORS_ALLOWED_ORIGINS` includes `http://localhost:5173`. |
| OTP email not received | Verify backend SMTP settings and inspect backend logs for `sendRegistrationOtp`. |
| Redirect loop after login | Ensure backend migration/seed created user with approved status (`User.status = APPROVED` and `isActive = true`). |
| API base URL wrong in production | Update `VITE_API_BASE_URL` and rebuild. |

---

For backend setup, follow `../Q_Edu_backend/README.md`. With both services running, visit `http://localhost:5173` to begin. 🎓
