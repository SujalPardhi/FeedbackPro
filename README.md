# Student Feedback System Pro 🚀

A professional multi-page feedback management system built with the MERN stack (MongoDB, Express, React, Node.js). 
This project features a clean, modern card-based UI with an Orange/White theme.

## Features
- **Public Feedback Portal**: Submit custom feedback with ratings.
- **Feedback Showcase**: Browse all submissions dynamically.
- **Admin Dashboard**: See aggregated metrics (total counts, average ratings) and delete feedback.

## Prerequisites
- Node.js (v14 or above)
- MongoDB (Running locally on `127.0.0.1:27017` or change the `MONGO_URI` in `/backend/.env`)

---

## ⚙️ Installation & Setup

1. **Clone the project** (or extract the folder).
2. Ensure MongoDB is running locally.

### Backend Setup
Open a terminal and navigate to the backend directory:
```bash
cd backend
npm install
```

### Frontend Setup
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
```

---

## ▶️ Running the Application

To run the application, you need to start both the backend server and the frontend development server.

### 1. Start the Backend Server
In the `backend` terminal:
```bash
node server.js
```
*The server will start on `http://localhost:5000` and connect to the local MongoDB database.*

### 2. Start the Frontend App
In the `frontend` terminal:
```bash
npm run dev
```
*The frontend will start on your local machine. Because Vite proxy is set up in `vite.config.js`, all `/api` requests automatically route to `http://localhost:5000`.*

---

## 📁 Project Structure

```
project-root
│
├── frontend (React + Vite)
│   ├── src
│   │   ├── components (Navbar, Footer, FeedbackCard)
│   │   ├── pages (Home, FeedbackForm, FeedbackList, AdminDashboard)
│   │   ├── App.jsx (Routing)
│   │   ├── main.jsx (Entry point)
│   │   └── index.css (Global theme)
│   └── vite.config.js (Proxy configuration)
│
└── backend (Node.js + Express)
    ├── models (Feedback.js schema)
    ├── controllers (Feedback CRUD logic)
    ├── routes (API endpoints)
    ├── server.js (Express server)
    └── .env (Local config)
```
