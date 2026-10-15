# DevLink

> A full-stack platform that connects developers, showcases their work, and makes it easier to discover and communicate with other developers.

## Live Demo

- 🌐 **App:** [https://dev-link-frontend-mu.vercel.app](https://dev-link-frontend-mu.vercel.app/)
- 🔗 **API:** [https://dev-link-backend-opal.vercel.app](https://dev-link-backend-opal.vercel.app/)

## Overview

**DevLink** is a full-stack web application designed as a developer networking and discovery platform.

Developers can create profiles, showcase their projects and skills, discover other developers, and communicate through the platform.

The project was built to practice and demonstrate real-world full-stack development, including authentication, REST APIs, database design, frontend state management, file handling, and deployment.

## Features

- 🔐 User authentication and authorization
- 👤 Developer profiles
- 🛠️ Skills and technology management
- 📁 Project showcase
- 🔎 Developer discovery and search
- 💬 Developer messaging
- 🖼️ Profile and project images
- 🔒 HTTP-only cookie authentication & Bearer token fallback
- 📱 Responsive user interface
- 🌐 RESTful backend API

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Context API
- Tailwind CSS
- Lucide React
- React Toastify

### Backend

- Node.js
- Express.js
- Mongoose / MongoDB
- REST API
- JWT Authentication
- HTTP-only Cookies & Bearer Tokens
- CORS

### Database

- MongoDB Atlas (Cloud)

### Development & Deployment

- Git & GitHub
- Vercel
- Postman
- Linux

## Project Structure

```text
dev-link/
│
├── devlink-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── assets/
│   │   └── ...
│   └── package.json
│
├── devlink-backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── ...
│
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/takyEhab/dev-link.git
cd dev-link
```

### 2. Setup the Backend

```bash
cd devlink-backend
npm install
```

Create a `.env` file inside `devlink-backend` (see `.env.example`):

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/devlink?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
```

### 3. Setup the Frontend

Open another terminal:

```bash
cd devlink-frontend
npm install
```

## Development

You can run both the frontend and backend together with a single command from the project root:

```bash
npm run dev
```

Or run them individually:

### Frontend (Vite)
```bash
npm run dev:frontend
```

### Backend (Node.js & Express)
```bash
npm run dev:backend
```

## Deployment

The application is configured to deploy seamlessly to Vercel:

```text
dev-link
│
├── Frontend (React SPA)  → Vercel
│
├── Backend (Express API) → Vercel Serverless
│
└── Database              → MongoDB Atlas (Free M0 Shared Tier)
```

1. **Frontend on Vercel**: Deploy the `devlink-frontend` directory. Add environment variable `VITE_API_URL` pointing to your deployed backend URL.
2. **Backend on Vercel**: Deploy `devlink-backend` as a project. Add `MONGODB_URI` and `JWT_SECRET` under Vercel environment variables.
3. **Resilient Chat Fallback**: On Vercel serverless environments where persistent WebSockets are not supported, the chat automatically uses HTTP REST calls and polling, ensuring messages send and receive smoothly.

## Author

**Taky Allah Ehab Gad**

Full-Stack Developer

- GitHub: [@takyEhab](https://github.com/takyEhab)
- LinkedIn: [Taky Allah Ehab Gad](https://www.linkedin.com/in/taky-gad/)

## License

This project is intended for educational and portfolio purposes.
