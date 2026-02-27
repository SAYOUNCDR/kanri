# Kanri

<div align="center">
  <img src="./frontend/public/Landing.png" alt="Kanri Dashboard Preview" width="100%" style="border-radius: 12px; margin-bottom: 20px;">
</div>

Kanri is a sleek, role-based task management application built with a focus on clean UI and secure access control. It provides separate, tailored experiences for standard users and system administrators.

## Features

- **Role-Based Workflows**: Tailored dashboard views depending on if you log in as a `user` or an `admin`.
- **Admin Console**: Administrators can register new users, dynamically assign tasks across the organization, and filter completion statuses globally.
- **User Dashboard**: Standard users get a focused Kanban-style view of only their assigned tasks, with single-click status updates.
- **Glassmorphic UI**: A premium, modern interface built with the latest Tailwind CSS v4, featuring frosted glass panels and smooth micro-interactions.
- **Bulletproof Security**: Implements strict `HttpOnly` refresh cookies for session management paired with in-memory JWT access tokens, eliminating local storage XSS vulnerabilities entirely.

## Tech Stack

- **Frontend**: React 19, Tailwind CSS v4, React Router DOM, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (JSON Web Tokens), bcrypt

## Getting Started

### Prerequisites

Make sure you have Node.js and MongoDB installed on your local machine. You will also need two separate terminal windows to run both the client and the server.

### 1. Backend Setup

Open your first terminal and navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file in the `/backend` root with the following variables:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
```

Start the backend server:

```bash
npm run dev
```

### 2. Frontend Setup

Open your second terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Start the React development server:

```bash
npm run dev
```

The application will now be running at `http://localhost:5173`.

_(Note: The frontend points to `http://localhost:5001` for the API by default. You can change this in `frontend/src/services/api.js` if necessary)._

## First Time Access

To set up your environment, simply hit the registration endpoint directly to create your first `admin` user, or adjust the default seed script if provided. Once an admin is securely created, all further user registrations can happen directly through the visual Modals inside the Kanri Admin Console.
