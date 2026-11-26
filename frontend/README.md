# Smart Campus Lost & Found System - Frontend

This is the modern, responsive React + Vite + TypeScript frontend for the **Smart Campus Lost & Found Management System**.

## Tech Stack
* **Framework:** React 18 with Vite
* **Language:** TypeScript
* **Styling:** Tailwind CSS (Modern SaaS theme)
* **Icons:** Lucide React
* **Charts:** Recharts
* **HTTP Client:** Axios with JWT request & response interceptors
* **Routing:** React Router v6

## Running the Frontend Locally

```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Start development server
npm run dev
```

The application will be accessible at `http://localhost:5173`.
Vite is pre-configured with a reverse proxy routing `/api` and `/uploads` requests directly to the Spring Boot backend running on `http://localhost:8080`.

## Production Build

```bash
npm run build
```
Build output will be bundled into the `dist/` folder.

