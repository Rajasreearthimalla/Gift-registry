# Gift Registry & Wishlist Application

Full-stack gift registry platform built with React, Tailwind CSS, Express, MongoDB, Mongoose, JWT, Axios, and bcrypt.

## Features

- User registration and login with JWT authentication
- Profile management for name, email, bio, and password updates
- Create, edit, delete, and manage multiple wishlists
- Add, edit, delete, reserve, and purchase gift items
- Public share links for guest-friendly reservation flow
- Protected owner routes with token validation and password hashing

## Project Structure

```text
backend/
  config/
  controllers/
  middleware/
  models/
  routes/
  utils/
  server.js
frontend/
  src/
    components/
    context/
    pages/
    services/
    utils/
    App.js
```

## MongoDB Schema Design

### User

- `name`: string, required
- `email`: string, required, unique
- `password`: string, required, hashed with bcrypt
- `bio`: string

### Wishlist

- `owner`: ObjectId reference to `User`
- `title`: string, required
- `description`: string
- `eventDate`: date
- `coverImage`: string
- `isPublic`: boolean
- `shareToken`: unique string for public URLs

### Item

- `wishlist`: ObjectId reference to `Wishlist`
- `owner`: ObjectId reference to `User`
- `name`: string, required
- `price`: number
- `image`: string
- `description`: string
- `link`: string
- `priority`: enum `low | medium | high`
- `isReserved`: boolean
- `reservedByName`: string
- `reservedByEmail`: string
- `reservedAt`: date
- `isPurchased`: boolean
- `purchasedAt`: date

## API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### User

- `GET /api/users/profile`
- `PUT /api/users/profile`

### Wishlists

- `GET /api/wishlist`
- `POST /api/wishlist`
- `GET /api/wishlist/:id`
- `PUT /api/wishlist/:id`
- `DELETE /api/wishlist/:id`
- `GET /api/wishlist/public/:shareToken`

### Items

- `POST /api/items`
- `PUT /api/items/:id`
- `DELETE /api/items/:id`
- `POST /api/items/:id/reserve`

## Environment Setup

### Backend

Create `backend/.env` from `backend/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/gift-registry
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
```

### Frontend

Create `frontend/.env` from `frontend/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Run The Project

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Install frontend dependencies:

```bash
cd frontend
npm install
```

3. Start MongoDB locally and ensure the URI in `backend/.env` is correct.

4. Start the backend server:

```bash
cd backend
npm run dev
```

5. Start the frontend app:

```bash
cd frontend
npm run dev
```

6. Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

## Notes

- The public share page supports guest gift reservation without requiring login.
- Image upload is implemented as image URL support to keep the stack lightweight and easy to run locally.
- Socket.io was left optional and not included so the base app stays focused and deployable with fewer moving parts.
