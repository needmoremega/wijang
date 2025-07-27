# Wijang – A Simple Library Management Web App

**Wijang** is a web-based library management application built using modern technologies. The frontend uses **Vue 3 + Vite**, and the backend is powered by **Express.js + Firebase Realtime Database**. This project was created as a school project and includes core features such as book management (CRUD), book loans, and user authentication using Firebase Realtime Database.

---

## Features

- Add, edit, and delete books
- User login and management
- Book loan and return transactions
- Real-time data synchronization with Firebase
- Modern responsive interface using Vue 3 and DaisyUI
- Admin panel for managing books and users

---

## Technologies Used

### Frontend
- Vue 3 (Composition API)
- Vite
- Vue Router
- DaisyUI (based on TailwindCSS)
- Firebase SDK

### Backend
- Node.js + Express.js
- Firebase Admin SDK (Realtime Database)

---

## Project Structure

```bash
wijang/
├── backend/                 # Express.js backend
│   ├── routes/             # API routes: books, upload, convert
│   ├── server.js           # Main server entry
│   └── firebaseConfig.js   # Firebase configuration
├── frontend/                # Vue 3 frontend
│   ├── src/
│   │   ├── assets/         # Assets and images
│   │   ├── components/     # Vue components
│   │   ├── views/          # Page views
│   │   ├── router/         # Vue Router configuration
│   │   └── App.vue, main.js
├── README.md


Installation & Running the Project
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/needmoremega/wijang.git
cd wijang
2. Run Backend (Express.js)
bash
Copy
Edit
cd backend
npm install
npm run dev
If needed, create a .env file with your Firebase credentials:

env
Copy
Edit
FIREBASE_DATABASE_URL=your_firebase_database_url
FIREBASE_PROJECT_ID=your_project_id
3. Run Frontend (Vue 3)
bash
Copy
Edit
cd frontend
npm install
npm run dev
