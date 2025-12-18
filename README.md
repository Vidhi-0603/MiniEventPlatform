# Mini Event Platform

A minimal event management platform with a React + Vite frontend and an Express + MongoDB backend. Events support image uploads which are stored in Cloudinary. Authentication uses JWT stored in HTTP-only cookies.

---

## 🔧 Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB (via Mongoose)
- **Image storage:** Cloudinary (via `multer-storage-cloudinary`)
- **Auth:** JWT (tokens stored in cookies)
- **Frontend:** React + Vite, Tailwind CSS
- **HTTP client:** Axios (configured with `withCredentials: true`)

---

## 🚀 Quick Start

Prerequisites:

- Node.js (16+)
- npm or yarn
- MongoDB connection string
- Cloudinary account (cloud name, API key, API secret)

Backend

1. cd `Backend`
2. npm install
3. Create a `.env` file in the `Backend` folder with the variables below
4. npm run dev

Frontend

1. cd `Frontend`
2. npm install
3. Create a `.env` (or `.env.local`) with `VITE_API_URL` pointing to your backend (e.g., `http://localhost:5000`)
4. npm run dev

---

## ⚙️ Environment Variables

Backend `.env` (example):

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.example.mongodb.net/dbname
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173         # Vite dev server URL
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Frontend `.env` (example for Vite):

```
VITE_API_URL=http://localhost:5000
```

---

## 🔁 API Routes

Base URL: `${VITE_API_URL}` (typically `http://localhost:5000`)

### Auth (/api/auth)

- `POST /api/auth/register` — Register a new user. Body: `{ username, email, password }`.
- `POST /api/auth/login` — Login a user. Body: `{ email, password }`. Sets `accessToken` cookie.
- `GET /api/auth/me` — Get current user (requires cookie auth).
- `POST /api/auth/logout` — Clears auth cookie.

### Events (/api/events)

- `POST /api/events/` — Create a new event (requires auth). Accepts multipart/form-data with fields:
  - `title`, `description`, `dateTime`, `location`, `capacity` (form fields)
  - `image` (file field) — image gets uploaded to Cloudinary
- `GET /api/events/` — List all upcoming events
- `GET /api/events/myEvents` — Get events created by logged-in user (requires auth)
- `PUT /api/events/:id` — Update an event (requires auth)
- `DELETE /api/events/:id` — Delete an event (requires auth)

### RSVPs (event-related)

- `POST /api/events/:id/rsvp` — RSVP to event (requires auth)
- `DELETE /api/events/:id/rsvp` — Remove RSVP (requires auth)
- `GET /api/events/rsvps/my` — Get my RSVPs (requires auth)

> Note: Authorization is cookie-based (`accessToken` cookie). The frontend is configured to send cookies with requests (`axios` `withCredentials: true`).

---

## 🖼️ Image Upload (Cloudinary)

- Images are handled using `multer` + `multer-storage-cloudinary` and uploaded directly to Cloudinary.
- Upload middleware accepts files at field name `image` (see `upload.single('image')`).
- Allowed formats: `jpg`, `png`, `jpeg`, `webp`.
- Max file size: 5 MB (configured in middleware).
- After upload, the Cloudinary URL is available as `req.file.path` and stored as `imageUrl` on the event.

How to set up Cloudinary:

1. Create a Cloudinary account at https://cloudinary.com
2. Get **Cloud name**, **API Key**, and **API Secret** from the dashboard
3. Put these values in the Backend `.env` as shown above

Testing uploads with curl (example):

```
curl -X POST "http://localhost:5000/api/events" \
  -F "title=Test Event" \
  -F "description=desc" \
  -F "dateTime=2025-01-01T18:00:00Z" \
  -F "capacity=50" \
  -F "image=@/path/to/image.jpg" \
  -H "Cookie: accessToken=<your_token_here>"
```

Or use Postman: login (so cookie is set), then create a `multipart/form-data` POST with the `image` field.

---

## 🧩 Notes & Tips

- The app stores JWT in an HTTP-only cookie named `accessToken` to keep it secure from XSS.
- The frontend uses `axios` with `withCredentials: true` so cookies are sent automatically.
- Adjust `CLIENT_URL` and CORS in `Backend/.env` to match your frontend origin for cross-origin requests.

---

## 🔭 Development & Deployment

- Backend: `npm run dev` (nodemon) — runs on `PORT` (default 5000)
- Frontend: `npm run dev` (Vite) — runs on Vite dev server (default 5173)

For production, supply real `MONGO_URI` and Cloudinary credentials, and set `NODE_ENV=production`.

---


License: MIT
